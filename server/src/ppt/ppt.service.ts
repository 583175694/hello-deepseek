import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PPTOperationService } from './services/ppt-operation.service';
import { PPTOperationType } from './entities/ppt-operation.entity';
import axios from 'axios';
import * as crypto from 'crypto';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { models } from 'src/configs/models';

@Injectable()
export class PPTService {
  private readonly logger = new Logger(PPTService.name);
  private readonly baseUrl = 'https://co.aippt.cn';
  private modelInstance: ChatDeepSeek;

  constructor(
    private readonly configService: ConfigService,
    private readonly pptOperationService: PPTOperationService,
  ) {
    // 初始化DeepSeek模型实例
    this.modelInstance = new ChatDeepSeek({
      modelName: models.bytedance_deepseek_v3.modelName,
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL: models.bytedance_deepseek_v3.baseURL,
        apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      },
    });
    this.logger.log('PPT服务已使用独立的DeepSeek模型初始化');
  }

  // 新的AI内容生成方法，完全独立于聊天模块
  private async generateAIContent(prompt: string): Promise<string> {
    this.logger.log('使用独立方法为PPT生成AI内容');

    try {
      // 创建简单的提示模板
      const promptTemplate = ChatPromptTemplate.fromMessages([
        [
          'system',
          '你是一个专业的PPT内容生成专家，请根据用户的要求生成高质量的内容。',
        ],
        ['human', '{input}'],
      ]);

      // 创建聊天链
      const chain = promptTemplate.pipe(this.modelInstance);

      // 调用模型生成内容
      let fullResponse = '';
      const stream = await chain.stream({
        input: prompt,
      });

      // 处理流式响应
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = chunk.content.toString();
          fullResponse += content;
        }
      }

      // 清理响应
      const cleanedResponse = fullResponse.startsWith('\n\n')
        ? fullResponse.slice(2)
        : fullResponse;

      this.logger.log('成功为PPT生成AI内容');
      return cleanedResponse;
    } catch (error) {
      this.logger.error('Error generating AI content for PPT:', error);

      // 重试一次
      try {
        this.logger.log('正在重试AI内容生成...');

        // 使用更简单的提示模板重试
        const retryPromptTemplate = ChatPromptTemplate.fromMessages([
          ['system', '生成PPT内容，简洁明了。'],
          ['human', '{input}'],
        ]);

        const retryChain = retryPromptTemplate.pipe(this.modelInstance);

        let retryResponse = '';
        const retryStream = await retryChain.stream({
          input: prompt,
        });

        for await (const chunk of retryStream) {
          if (chunk.content) {
            retryResponse += chunk.content.toString();
          }
        }

        this.logger.log('重试成功生成AI内容');
        return retryResponse.startsWith('\n\n')
          ? retryResponse.slice(2)
          : retryResponse;
      } catch (retryError) {
        this.logger.error('Retry also failed:', retryError);
        throw new Error('Failed to generate AI content for PPT after retry');
      }
    }
  }

  // AIPPT 相关功能
  private generateSignature(
    method: string,
    uri: string,
    timestamp: number,
  ): string {
    const secretKey = this.configService.get<string>('AIPPT_SECRET_KEY');

    // 按照文档要求构造待签字符串
    const stringToSign = `${method}@${uri}@${timestamp}`;

    // 使用 HMAC-SHA1 算法生成签名
    const hmac = crypto.createHmac('sha1', secretKey);
    return hmac.update(stringToSign).digest('base64');
  }

  async getAuthCode(
    clientId: string,
  ): Promise<{ code: string; operationId: number; pptId: string }> {
    try {
      // 创建一个新的授权操作记录
      const operation = await this.pptOperationService.createOperation(
        clientId,
        PPTOperationType.AUTH,
      );

      const timestamp = Math.floor(Date.now() / 1000);
      const uri = '/api/grant/code/';
      const signature = this.generateSignature('GET', uri, timestamp);
      const accessKey = this.configService.get<string>('AIPPT_ACCESS_KEY');

      const response = await axios.get(`${this.baseUrl}${uri}`, {
        headers: {
          'x-api-key': accessKey,
          'x-timestamp': timestamp.toString(),
          'x-signature': signature,
        },
        params: {
          uid: '1',
          channel: 'test',
        },
      });

      if (response.data.code === 0) {
        const authCode = response.data.data.code;

        // 更新操作记录
        await this.pptOperationService.updateOperation(operation.id, {
          authCode,
        });

        return {
          code: authCode,
          operationId: operation.id,
          pptId: operation.pptId,
        };
      } else {
        await this.pptOperationService.markOperationAsError(
          operation.id,
          response.data.msg || 'Failed to get auth code',
        );
        throw new Error(response.data.msg || 'Failed to get auth code');
      }
    } catch (error) {
      this.logger.error('Failed to get auth code:', error);
      throw error;
    }
  }

  // PPT 生成相关功能
  async generateOutline(
    clientId: string,
    title: string,
    pptId?: string,
  ): Promise<{ outline: string; operationId: number; pptId: string }> {
    // 创建一个新的大纲生成操作记录
    const operation = await this.pptOperationService.createOperation(
      clientId,
      PPTOperationType.OUTLINE,
      { title, pptId },
    );

    const prompt = `请为以下内容生成一个详细的PPT大纲：

内容描述：${title}

要求：
1. 根据内容描述提取关键主题，生成一个合适的PPT标题
2. 根据主题的复杂性生成4-7个主要章节
3. 每个章节下应该有2-4个子要点
4. 大纲层次要清晰，使用数字编号（1., 1.1, 1.2等）
5. 内容要有逻辑性和连贯性
6. 大纲的深度和广度要适中，既不能太简单也不能太复杂
7. 确保每个要点都与主题相关，并能支撑主题
8. 用中文输出

请直接输出大纲内容，不要有任何额外的解释或说明。`;

    try {
      // 直接使用独立的AI内容生成方法
      this.logger.log(`正在为标题为"${title}"的PPT生成大纲`);
      const outline = await this.generateAIContent(prompt);

      // 更新操作记录
      await this.pptOperationService.updateOperation(operation.id, {
        outline,
      });

      return {
        outline,
        operationId: operation.id,
        pptId: operation.pptId,
      };
    } catch (error) {
      await this.pptOperationService.markOperationAsError(
        operation.id,
        '生成PPT大纲失败',
      );
      this.logger.error('生成PPT大纲失败:', error);
      throw new Error('生成PPT大纲失败');
    }
  }

  async generateContent(
    clientId: string,
    title: string,
    outline: string,
    pptId?: string,
  ): Promise<{ content: string; operationId: number; pptId: string }> {
    // 创建一个新的内容生成操作记录
    const operation = await this.pptOperationService.createOperation(
      clientId,
      PPTOperationType.CONTENT,
      { title, outline, pptId },
    );

    const prompt = `你是一个专业的PPT内容生成专家。请基于以下信息生成PPT内容：

标题：${title}
大纲：
${outline}

要求：
1. 为每个大纲章节生成对应的PPT页面内容
2. 使用多级标题结构，包括主标题(#)、一级标题(##)、二级标题(###)、三级标题(####)等
3. 每个标题下应包含相关的要点列表，使用"-"作为列表标记
4. 内容要专业、准确、有深度
5. 语言要简洁清晰
6. 确保内容的连贯性和逻辑性
7. 用中文输出

请使用以下格式输出（markdown格式）：

# 主标题
## 1. 一级标题
### 1.1 二级标题
#### 1.1.1 三级标题
- 要点1
- 要点2
- 要点3

注意：
1. 使用层次分明的标题结构，从主标题(#)到三级标题(####)
2. 每个要点都要以"-"开头
3. 标题之间要有逻辑关系和层次感
4. 确保内容的专业性和准确性
5. 每个页面的内容量要适中，不要过多或过少
6. PPT页数不要超过30页`;

    try {
      // 直接使用独立的AI内容生成方法
      this.logger.log(`正在为标题为"${title}"的PPT生成内容`);
      const content = await this.generateAIContent(prompt);

      // 更新操作记录
      await this.pptOperationService.updateOperation(operation.id, {
        content,
      });

      return {
        content,
        operationId: operation.id,
        pptId: operation.pptId,
      };
    } catch (error) {
      await this.pptOperationService.markOperationAsError(
        operation.id,
        '生成PPT内容失败',
      );
      this.logger.error('生成PPT内容失败:', error);
      throw new Error('生成PPT内容失败');
    }
  }

  // 获取操作记录
  async getOperationById(operationId: number) {
    return this.pptOperationService.getOperationById(operationId);
  }

  async getOperationsByClientId(clientId: string) {
    return this.pptOperationService.getOperationsByClientId(clientId);
  }

  async getOperationsByPptId(pptId: string) {
    return this.pptOperationService.getOperationsByPptId(pptId);
  }
}
