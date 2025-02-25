import { Injectable, Logger } from '@nestjs/common';
import { AIChatService } from '../chat/services/ai-chat.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class PPTService {
  private readonly logger = new Logger(PPTService.name);
  private readonly baseUrl = 'https://co.aippt.cn';

  constructor(
    private readonly aiChatService: AIChatService,
    private readonly configService: ConfigService,
  ) {}

  private async getAIResponse(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let response = '';
      this.aiChatService
        .streamChat(
          prompt,
          'ppt-service',
          undefined,
          (chunk) => {
            if (chunk.type === 'content') {
              response += chunk.content;
            }
          },
          false,
          false,
          false,
          'bytedance_deepseek_v3',
        )
        .then(() => resolve(response))
        .catch(reject);
    });
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

  async getAuthCode(): Promise<{ code: string }> {
    try {
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
        return { code: response.data.data.code };
      } else {
        throw new Error(response.data.msg || 'Failed to get auth code');
      }
    } catch (error) {
      this.logger.error('Failed to get auth code:', error);
      throw error;
    }
  }

  // PPT 生成相关功能
  async generateOutline(title: string): Promise<string> {
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

    // 直接返回 markdown 格式的大纲
    return this.getAIResponse(prompt);
  }

  async generateContent(title: string, outline: string): Promise<string> {
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
#### 1.1.2 三级标题
- 要点1
- 要点2
- 要点3
### 1.2 二级标题
- 要点1
- 要点2
- 要点3

# 主标题
## 2. 一级标题
### 2.1 二级标题
- 要点1
- 要点2
- 要点3

注意：
1. 使用层次分明的标题结构，从主标题(#)到三级标题(####)
2. 每个要点都要以"-"开头
3. 标题之间要有逻辑关系和层次感
4. 确保内容的专业性和准确性
5. 每个页面的内容量要适中，不要过多或过少
6. 参考以下示例格式：
7. PPT页数不要超过30页

# 构建智能助手的核心技术方案
## 1. 概述
### 1.1 智能助手定义
#### 1.1.1 技术背景
- 人工智能与机器学习技术的快速发展，为智能助手提供了强大的算法支持。
- 自然语言处理（NLP）和语音识别技术的进步，使得智能助手能够理解并响应用户指令。
- 云计算和大数据技术的融合，为智能助手提供了高效的数据处理和存储能力。`;

    try {
      // 直接返回 markdown 格式的内容
      return await this.getAIResponse(prompt);
    } catch (error) {
      console.error('生成PPT内容失败:', error);
      throw new Error('生成PPT内容失败');
    }
  }
}
