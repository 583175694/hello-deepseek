import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatDeepSeek } from '@langchain/deepseek';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentService } from './services/document.service';
import { Document } from '@langchain/core/documents';
import { models } from 'src/configs/models';
import { PDFFileService } from './services/pdf-file.service';

@Injectable()
export class ReaderService {
  private readonly logger = new Logger(ReaderService.name);
  private readonly uploadDir: string;
  private readonly documentService: DocumentService;
  private modelInstances: Record<string, ChatDeepSeek> = {}; // 存储所有模型实例

  constructor(
    private configService: ConfigService,
    private pdfFileService: PDFFileService,
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    this.documentService = new DocumentService(this.uploadDir);
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

  async uploadFile(
    file: Express.Multer.File,
    clientId: string,
  ): Promise<{ filename: string; fileType: string }> {
    try {
      // 确保文件名是 UTF-8 编码
      const originalName = Buffer.from(file.originalname, 'binary').toString(
        'utf8',
      );
      const fileExt = path.extname(originalName).toLowerCase();
      const timestamp = Date.now();
      const originalNameWithoutExt = path.basename(originalName, fileExt);
      const filename = `${originalNameWithoutExt}-${timestamp}${fileExt}`;
      const filePath = path.join(this.uploadDir, filename);

      // 写入文件
      await fs.promises.writeFile(filePath, file.buffer);

      // 获取文件类型
      const fileType = this.documentService.getFileType(filename);

      // 保存到数据库
      await this.pdfFileService.savePDFFile(filename, file.size, clientId);

      return { filename, fileType };
    } catch (error) {
      this.logger.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFile(filename: string, clientId: string): Promise<Buffer> {
    try {
      // 验证文件是否属于该客户端
      const exists = await this.pdfFileService.checkFileExists(
        filename,
        clientId,
      );
      if (!exists) {
        throw new Error('File not found or access denied');
      }

      const filePath = path.join(this.uploadDir, filename);
      return this.documentService.getFileContent(filePath);
    } catch (error) {
      this.logger.error(`Error getting file ${filename}:`, error);
      throw error;
    }
  }

  async getUploadedFiles(clientId: string): Promise<
    Array<{
      filename: string;
      originalName?: string;
      size: number;
      uploadedAt: string;
      fileType: string;
    }>
  > {
    try {
      // 从数据库获取该客户端的文件列表
      const dbFiles = await this.pdfFileService.getPDFFiles(clientId);
      return dbFiles.map((file) => ({
        filename: file.filename,
        size: file.size,
        uploadedAt: file.createdAt.toISOString(),
        fileType: this.documentService.getFileType(file.filename) || 'unknown',
      }));
    } catch (error) {
      this.logger.error('Error getting uploaded files:', error);
      throw error;
    }
  }

  async deleteFile(filename: string, clientId: string): Promise<void> {
    try {
      // 验证文件是否属于该客户端
      const exists = await this.pdfFileService.checkFileExists(
        filename,
        clientId,
      );
      if (!exists) {
        throw new Error('File not found or access denied');
      }

      // 删除物理文件
      const filePath = path.join(this.uploadDir, filename);
      await fs.promises.unlink(filePath);

      // 删除数据库记录
      await this.pdfFileService.deletePDFFile(filename, clientId);
    } catch (error) {
      this.logger.error(`Error deleting file ${filename}:`, error);
      throw error;
    }
  }

  async loadDocument(filename: string): Promise<Document[]> {
    try {
      const filePath = path.join(this.uploadDir, filename);
      return this.documentService.loadDocument(filePath);
    } catch (error) {
      this.logger.error(`Error loading document ${filename}:`, error);
      throw error;
    }
  }

  // 生成文章摘要的流式处理
  async streamSummary(
    filename: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
    clientId: string,
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filename} 生成摘要`);

      // 验证文件是否属于该客户端
      const exists = await this.pdfFileService.checkFileExists(
        filename,
        clientId,
      );
      if (!exists) {
        throw new Error('File not found or access denied');
      }

      // 先检查数据库中是否已存在摘要
      const existingSummary = await this.pdfFileService.getSummary(
        filename,
        clientId,
      );
      if (existingSummary) {
        this.logger.log(`找到文件 ${filename} 的已有摘要，直接返回`);
        onToken({ content: existingSummary });
        onToken({ content: '[DONE]' });
        return;
      }

      // 如果不存在，则生成新的摘要
      const docs = await this.loadDocument(filename);
      const text = docs.map((doc) => doc.pageContent).join('\n\n');

      // 获取模型实例
      const model = this.getModel(modelId);

      // 用于收集完整的摘要内容
      let fullSummary = '';

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
          const content = chunk.content.toString();
          fullSummary += content;
          onToken({ content });
        }
      }

      // 保存摘要到数据库
      await this.pdfFileService.saveSummary(filename, clientId, fullSummary);

      this.logger.log(`成功完成文件 ${filename} 的摘要生成`);
    } catch (error) {
      this.logger.error(`生成摘要失败:`, error);
      throw error;
    }
  }

  // 生成文章精读的流式处理
  async streamDeepReading(
    filename: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
    clientId: string,
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filename} 生成逐页精读分析`);

      // 验证文件是否属于该客户端
      const exists = await this.pdfFileService.checkFileExists(
        filename,
        clientId,
      );
      if (!exists) {
        throw new Error('File not found or access denied');
      }

      // 先检查数据库中是否已存在精读分析
      const existingDeepReading = await this.pdfFileService.getDeepReading(
        filename,
        clientId,
      );
      if (existingDeepReading) {
        this.logger.log(`找到文件 ${filename} 的已有精读分析，直接返回`);
        onToken({ content: existingDeepReading });
        onToken({ content: '[DONE]' });
        return;
      }

      // 如果不存在，则生成新的精读分析
      const docs = await this.loadDocument(filename);
      let fullDeepReading = '';

      // 获取模型实例
      const model = this.getModel(modelId);

      // 逐页处理
      for (let i = 0; i < docs.length; i++) {
        const pageContent = docs[i].pageContent;
        const pageNum = i + 1;

        this.logger.log(`正在分析第 ${pageNum} 页`);

        // 为每页内容构建提示词
        const prompt = `
你是一个专业的文章精读分析专家。这是一篇文档的第${pageNum}页内容。

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

      // 保存精读分析到数据库
      await this.pdfFileService.saveDeepReading(
        filename,
        clientId,
        fullDeepReading,
      );

      this.logger.log(`成功完成文件 ${filename} 的逐页精读分析生成`);
    } catch (error) {
      this.logger.error(`生成精读分析失败:`, error);
      throw error;
    }
  }

  // 生成文章脑图的流式处理
  async streamMindMap(
    filename: string,
    onToken: (response: { content: string }) => void,
    modelId: string = 'bytedance_deepseek_v3',
    clientId: string,
  ): Promise<void> {
    try {
      this.logger.log(`开始为文件 ${filename} 生成脑图`);

      // 验证文件是否属于该客户端
      const exists = await this.pdfFileService.checkFileExists(
        filename,
        clientId,
      );
      if (!exists) {
        throw new Error('File not found or access denied');
      }

      // 先检查数据库中是否已存在脑图
      const existingMindMap = await this.pdfFileService.getMindMap(
        filename,
        clientId,
      );
      if (existingMindMap) {
        this.logger.log(`找到文件 ${filename} 的已有脑图，直接返回`);
        onToken({ content: existingMindMap });
        onToken({ content: '[DONE]' });
        return;
      }

      // 如果不存在，则生成新的脑图
      const docs = await this.loadDocument(filename);
      const text = docs.map((doc) => doc.pageContent).join('\n\n');
      let fullMindMap = '';

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
          const content = chunk.content.toString();
          fullMindMap += content;
          onToken({ content });
        }
      }

      // 保存脑图到数据库
      await this.pdfFileService.saveMindMap(filename, clientId, fullMindMap);

      this.logger.log(`成功完成文件 ${filename} 的脑图生成`);
    } catch (error) {
      this.logger.error(`生成脑图失败:`, error);
      throw error;
    }
  }
}
