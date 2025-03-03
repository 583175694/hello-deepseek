import { Injectable, Logger } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import * as fs from 'fs';
import * as path from 'path';
import { models } from 'src/configs/models';
import { Observable } from 'rxjs';

@Injectable()
export class ReaderService {
  private readonly logger = new Logger(ReaderService.name);
  private modelInstances: Record<string, ChatDeepSeek> = {}; // 存储所有模型实例

  constructor() {
    this.logger.log('正在初始化Reader服务...');
    this.initializeAllModels();
  }

  // 初始化所有可用的模型实例
  private initializeAllModels() {
    this.logger.log('正在初始化DeepSeek模型...');

    // 遍历配置的模型
    Object.entries(models).forEach(([modelId, modelConfig]) => {
      try {
        this.modelInstances[modelId] = new ChatDeepSeek({
          modelName: modelConfig.modelName,
          temperature: 0.7,
          streaming: true,
          configuration: {
            baseURL: modelConfig.baseURL,
            apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
          },
        });
        this.logger.log(`成功初始化模型: ${modelId}`);
      } catch (error) {
        this.logger.error(`初始化模型失败: ${modelId}`, error);
      }
    });
  }

  // 获取指定的模型实例
  private getModel(modelId: string): ChatDeepSeek {
    if (!this.modelInstances[modelId]) {
      this.logger.warn(`请求的模型 ${modelId} 不存在，使用默认模型`);
      return this.modelInstances['bytedance_deepseek_v3']; // 使用默认模型
    }
    return this.modelInstances[modelId];
  }

  // 从PDF文件中提取文本内容
  async extractTextFromPDF(filePath: string): Promise<string> {
    try {
      this.logger.log(`正在从PDF文件提取文本: ${filePath}`);
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      // 合并所有页面的文本
      const text = docs.map((doc) => doc.pageContent).join('\n\n');
      this.logger.log(`成功从PDF提取了 ${text.length} 字符的文本`);

      return text;
    } catch (error) {
      this.logger.error(`从PDF提取文本失败:`, error);
      throw new Error(`无法从PDF文件提取文本: ${error.message}`);
    }
  }

  // 生成文章摘要的流式处理
  async streamSummary(
    filePath: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filePath} 生成摘要`);

      // 提取PDF文本
      const text = await this.extractTextFromPDF(filePath);

      // 获取模型实例
      const model = this.getModel(modelId);

      // 构建提示词
      const prompt = `
你是一个专业的文章摘要生成器。请对以下文章内容进行全面的总结，包括：

1. 文章的主要主题和目的
2. 关键论点和发现
3. 重要的数据和证据
4. 结论和建议

请以清晰、简洁的方式组织摘要，使用markdown格式，包括适当的标题、列表和强调。确保摘要全面涵盖文章的重要内容，但长度控制在原文的20%以内。

以下是文章内容：

${text}
`;

      // 调用模型生成摘要
      const stream = await model.stream(prompt);

      // 处理流式响应
      for await (const chunk of stream) {
        if (chunk.content) {
          onToken({ content: chunk.content.toString() });
        }
      }

      this.logger.log(`成功完成文件 ${filePath} 的摘要生成`);
    } catch (error) {
      this.logger.error(`生成摘要失败:`, error);
      throw error;
    }
  }
}
