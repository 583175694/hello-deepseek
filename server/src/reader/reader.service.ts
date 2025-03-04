import { Injectable, Logger } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { models } from 'src/configs/models';
import { PDFFileService } from './services/pdf-file.service';

@Injectable()
export class ReaderService {
  private readonly logger = new Logger(ReaderService.name);
  private modelInstances: Record<string, ChatDeepSeek> = {}; // 存储所有模型实例

  constructor(private readonly pdfFileService: PDFFileService) {
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
    filename: string = '',
    clientId: string = '',
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filePath} 生成摘要`);

      // 如果提供了filename和clientId，先检查数据库中是否已有摘要
      if (filename && clientId) {
        const existingSummary = await this.pdfFileService.getSummary(
          filename,
          clientId,
        );
        if (existingSummary) {
          this.logger.log(`使用数据库中已有的摘要内容`);
          onToken({ content: existingSummary });
          return;
        }
      }

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

请以清晰、简洁的方式组织摘要，包括适当的标题、列表和强调。确保摘要全面涵盖文章的重要内容，但长度控制在原文的20%以内。

以下是文章内容：

${text}
`;

      // 用于收集完整的摘要内容
      let fullSummary = '';

      // 调用模型生成摘要
      const stream = await model.stream(prompt);

      // 处理流式响应
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = chunk.content.toString();
          fullSummary += content;
          onToken({ content });
        }
      }

      // 如果提供了filename和clientId，将摘要保存到数据库
      if (filename && clientId && fullSummary) {
        await this.pdfFileService.saveSummary(filename, clientId, fullSummary);
        this.logger.log(`已将摘要保存到数据库`);
      }

      this.logger.log(`成功完成文件 ${filePath} 的摘要生成`);
    } catch (error) {
      this.logger.error(`生成摘要失败:`, error);
      throw error;
    }
  }

  // 生成文章精读的流式处理
  async streamDeepReading(
    filePath: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
    filename: string = '',
    clientId: string = '',
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filePath} 生成逐页精读分析`);

      // 如果提供了filename和clientId，先检查数据库中是否已有精读分析
      if (filename && clientId) {
        const existingDeepReading = await this.pdfFileService.getDeepReading(
          filename,
          clientId,
        );
        if (existingDeepReading) {
          this.logger.log(`使用数据库中已有的精读分析内容`);
          onToken({ content: existingDeepReading });
          return;
        }
      }

      // 加载PDF文档，获取所有页面
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      // 获取模型实例
      const model = this.getModel(modelId);

      // 用于收集完整的精读内容
      let fullDeepReading = '';

      // 逐页处理
      for (let i = 0; i < docs.length; i++) {
        const pageContent = docs[i].pageContent;
        const pageNum = i + 1;

        this.logger.log(`正在分析第 ${pageNum} 页`);

        // 为每页内容构建提示词
        const prompt = `
你是一个专业的文章精读分析专家。这是一篇PDF文档的第${pageNum}页内容。

首先，请判断本页的内容类型（封面、目录、正文、参考文献、附录等）和内容丰富程度。

如果本页是封面、目录、参考文献列表、附录等辅助性内容：
- 只需简要说明本页的类型和基本信息（1-2句话即可）
- 不需要进行深入分析

如果本页是正文内容，请根据内容的丰富程度和复杂性进行适当深度的分析：

对于内容丰富、信息量大的页面：
1. 本页主要内容概述
   - 本页的核心主题
   - 在文章整体中的作用和地位

2. 重要内容解析
   - 关键论点和观点
   - 重要概念和术语解释
   - 论据和例证分析

3. 重点和难点
   - 本页最重要的信息
   - 需要特别关注的内容

对于内容较少或简单的页面：
- 简要概述本页内容（3-5句话）

请根据页面内容的实际情况灵活调整分析的深度和广度，避免对内容简单的页面过度分析。分析应当与内容的丰富程度成正比。

以下是第${pageNum}页的内容：

${pageContent}
`;

        // 添加页面分隔标记
        if (i > 0) {
          const separator = '\n\n-------------------\n';
          fullDeepReading += separator;
          onToken({ content: separator });
        }

        const pageHeader = `\n## 第 ${pageNum} 页分析\n\n`;
        fullDeepReading += pageHeader;
        onToken({ content: pageHeader });

        // 调用模型生成当前页的精读分析
        const stream = await model.stream(prompt);

        // 处理流式响应
        for await (const chunk of stream) {
          if (chunk.content) {
            const content = chunk.content.toString();
            fullDeepReading += content;
            onToken({ content });
          }
        }
      }

      // 如果提供了filename和clientId，将精读分析保存到数据库
      if (filename && clientId && fullDeepReading) {
        await this.pdfFileService.saveDeepReading(
          filename,
          clientId,
          fullDeepReading,
        );
        this.logger.log(`已将精读分析保存到数据库`);
      }

      this.logger.log(`成功完成文件 ${filePath} 的逐页精读分析生成`);
    } catch (error) {
      this.logger.error(`生成精读分析失败:`, error);
      throw error;
    }
  }

  // 生成文章脑图的流式处理
  async streamMindMap(
    filePath: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
    filename: string = '',
    clientId: string = '',
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filePath} 生成脑图`);

      // 如果提供了filename和clientId，先检查数据库中是否已有脑图
      if (filename && clientId) {
        const existingMindMap = await this.pdfFileService.getMindMap(
          filename,
          clientId,
        );
        if (existingMindMap) {
          this.logger.log(`使用数据库中已有的脑图内容`);
          onToken({ content: existingMindMap });
          return;
        }
      }

      // 提取PDF文本
      const text = await this.extractTextFromPDF(filePath);

      // 获取模型实例
      const model = this.getModel(modelId);

      // 构建提示词
      const prompt = `
你是一个专业的脑图生成专家。请将以下文章内容转换为结构化的脑图格式。

要求：
1. 使用markdown标题语法(#)来表示层级结构
2. 从中心主题开始，向外延伸各级分支
3. 每个分支应该简洁明了，使用关键词或短语
4. 保持层级结构清晰，一般不超过4级
5. 不要使用列表符号(- *)，只使用标题语法(#)
6. 每个标题都应该是简短的关键词或短语，避免长句
7. 确保生成的内容是纯粹的markdown标题格式，不要包含其他markdown语法

示例格式：
# 中心主题
## 一级主题1
### 二级主题1.1
#### 三级主题1.1.1
#### 三级主题1.1.2
### 二级主题1.2
#### 三级主题1.2.1
## 一级主题2
### 二级主题2.1
### 二级主题2.2

请基于以下文章内容生成脑图：

${text}

注意：请严格按照示例格式输出，只使用markdown标题语法(#)，不要使用其他任何markdown语法。每个标题都应该是简短的关键词或短语。`;

      // 用于收集完整的脑图内容
      let fullMindMap = '';

      // 调用模型生成脑图
      const stream = await model.stream(prompt);

      // 处理流式响应
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = chunk.content.toString();
          fullMindMap += content;
          onToken({ content });
        }
      }

      // 如果提供了filename和clientId，将脑图保存到数据库
      if (filename && clientId && fullMindMap) {
        await this.pdfFileService.saveMindMap(filename, clientId, fullMindMap);
        this.logger.log(`已将脑图保存到数据库`);
      }

      this.logger.log(`成功完成文件 ${filePath} 的脑图生成`);
    } catch (error) {
      this.logger.error(`生成脑图失败:`, error);
      throw error;
    }
  }
}
