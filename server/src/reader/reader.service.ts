import { Injectable, Logger } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { models } from 'src/configs/models';

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

请以清晰、简洁的方式组织摘要，包括适当的标题、列表和强调。确保摘要全面涵盖文章的重要内容，但长度控制在原文的20%以内。

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

  // 生成文章精读的流式处理
  async streamDeepReading(
    filePath: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filePath} 生成逐页精读分析`);

      // 加载PDF文档，获取所有页面
      const loader = new PDFLoader(filePath);
      const docs = await loader.load();

      // 获取模型实例
      const model = this.getModel(modelId);

      // 逐页处理
      for (let i = 0; i < docs.length; i++) {
        const pageContent = docs[i].pageContent;
        const pageNum = i + 1;

        this.logger.log(`正在分析第 ${pageNum} 页`);

        // 为每页内容构建提示词
        const prompt = `
你是一个专业的文章精读分析专家。这是一篇PDF文档的第${pageNum}页内容。

首先，请判断本页的内容类型（封面、目录、正文、参考文献、附录等）。

如果本页是封面、目录、参考文献列表、附录等辅助性内容：
- 简要说明本页的类型和内容即可，不需要进行总结，不需要进行深入分析

如果本页是正文内容，请进行深入分析，包括：
1. 本页主要内容概述
   - 本页的核心主题
   - 在文章整体中的作用和地位

2. 重要内容解析
   - 关键论点和观点
   - 重要概念和术语解释
   - 论据和例证分析

3. 逻辑结构分析
   - 段落之间的逻辑关系
   - 论证方式和思路

4. 重点和难点
   - 本页最重要的信息
   - 需要特别关注的内容
   - 可能需要补充理解的部分

5. 与上下文的关联
   - 与前文的衔接点
   - 对后文的铺垫

请根据页面类型选择合适的分析深度，以结构化的方式组织内容。对于正文部分，确保分析深入且有见地；对于辅助性内容，保持简明扼要。

以下是第${pageNum}页的内容：

${pageContent}
`;

        // 添加页面分隔标记
        if (i > 0) {
          onToken({ content: '\n\n-------------------\n' });
        }
        onToken({ content: `\n## 第 ${pageNum} 页分析\n\n` });

        // 调用模型生成当前页的精读分析
        const stream = await model.stream(prompt);

        // 处理流式响应
        for await (const chunk of stream) {
          if (chunk.content) {
            onToken({ content: chunk.content.toString() });
          }
        }
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
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filePath} 生成脑图`);

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

      // 调用模型生成脑图
      const stream = await model.stream(prompt);

      // 处理流式响应
      for await (const chunk of stream) {
        if (chunk.content) {
          onToken({ content: chunk.content.toString() });
        }
      }

      this.logger.log(`成功完成文件 ${filePath} 的脑图生成`);
    } catch (error) {
      this.logger.error(`生成脑图失败:`, error);
      throw error;
    }
  }
}
