/**
 * 导入所需的依赖
 */
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import { SessionTempFile } from '../entities/session-temp-file.entity';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 临时文档服务
 * 用于处理会话中的临时文件和向量存储
 */
@Injectable()
export class TempDocumentService {
  private readonly logger = new Logger(TempDocumentService.name);
  private embeddings: ByteDanceDoubaoEmbeddings;

  // 临时文件和向量存储的基础路径
  private readonly tempBasePath = path.join(process.cwd(), 'temp');
  private readonly vectorStoreTempPath = path.join(
    process.cwd(),
    'vector_store',
    'temp',
  );

  // 会话向量存储的内存映射
  private sessionVectorStores: Map<string, FaissStore> = new Map();

  /**
   * 构造函数
   * @param sessionTempFileRepository 临时文件仓库
   */
  constructor(
    @InjectRepository(SessionTempFile)
    private sessionTempFileRepository: Repository<SessionTempFile>,
  ) {
    // 初始化字节跳动的嵌入模型
    this.embeddings = new ByteDanceDoubaoEmbeddings({
      apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      model: 'ep-20250215013011-6nd8j',
      verbose: true,
    });

    // 确保临时目录存在
    if (!fs.existsSync(this.tempBasePath)) {
      fs.mkdirSync(this.tempBasePath, { recursive: true });
    }
    if (!fs.existsSync(this.vectorStoreTempPath)) {
      fs.mkdirSync(this.vectorStoreTempPath, { recursive: true });
    }
  }

  /**
   * 获取会话的临时文件路径
   */
  private getSessionPath(sessionId: string, clientId: string): string {
    const sessionPath = path.join(this.tempBasePath, clientId, sessionId);
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true });
    }
    return sessionPath;
  }

  /**
   * 获取会话的向量存储路径
   */
  private getSessionVectorStorePath(
    sessionId: string,
    clientId: string,
  ): string {
    const vectorStorePath = path.join(
      this.vectorStoreTempPath,
      clientId,
      sessionId,
    );
    if (!fs.existsSync(vectorStorePath)) {
      fs.mkdirSync(vectorStorePath, { recursive: true });
    }
    return vectorStorePath;
  }

  /**
   * 获取存储键
   */
  private getStoreKey(sessionId: string, clientId: string): string {
    return `${clientId}:${sessionId}`;
  }

  /**
   * 处理文件名编码
   * @param fileName 原始文件名
   * @returns 处理后的文件名
   */
  private sanitizeFileName(fileName: string): string {
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    return `${nameWithoutExt}${ext}`;
  }

  /**
   * 保存上传的文件
   * @param file 上传的文件
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   * @returns 文件路径
   */
  async uploadAndProcessFile(
    file: Express.Multer.File,
    sessionId: string,
    clientId: string,
    chunkSize: number = 1000,
  ): Promise<{
    filePath: string;
    tempFiles: {
      filename: string;
      type: string;
      size: number;
      createdAt: Date;
    }[];
    fullContent?: string;
    isShortDocument?: boolean;
  }> {
    let finalFilePath: string;
    let finalFileName: string;

    // 设置文档长度阈值（字符数）
    const SHORT_DOCUMENT_THRESHOLD = 12000; // 可以根据需要调整这个值

    try {
      const sessionPath = this.getSessionPath(sessionId, clientId);

      // 检查是否已存在文件，如果存在则删除
      const existingFiles = fs.readdirSync(sessionPath);
      if (existingFiles.length > 0) {
        // 删除现有文件
        existingFiles.forEach((filename) => {
          const filePath = path.join(sessionPath, filename);
          fs.unlinkSync(filePath);
        });

        // 清理向量存储
        const vectorStorePath = this.getSessionVectorStorePath(
          sessionId,
          clientId,
        );
        if (fs.existsSync(vectorStorePath)) {
          fs.rmSync(vectorStorePath, { recursive: true, force: true });
        }

        // 清理内存中的向量存储
        const storeKey = this.getStoreKey(sessionId, clientId);
        this.sessionVectorStores.delete(storeKey);

        // 硬删除现有的临时文件记录
        await this.sessionTempFileRepository.delete({ sessionId, clientId });
      }

      // 确保文件名是 UTF-8 编码
      const originalName = Buffer.from(file.originalname, 'binary').toString(
        'utf8',
      );

      // 处理文件名
      const sanitizedFileName = this.sanitizeFileName(originalName);
      finalFileName = sanitizedFileName;
      finalFilePath = path.join(sessionPath, finalFileName);

      // 检查文件是否已存在，如果存在则添加时间戳
      if (fs.existsSync(finalFilePath)) {
        const baseName = path.basename(
          sanitizedFileName,
          path.extname(sanitizedFileName),
        );
        const ext = path.extname(sanitizedFileName);
        finalFileName = `${baseName}_${Date.now()}${ext}`;
        finalFilePath = path.join(sessionPath, finalFileName);
      }

      // 保存文件
      this.logger.log(
        `正在为会话 ${sessionId} 客户端 ${clientId} 保存文件 ${finalFileName} 到 ${finalFilePath}`,
      );
      fs.writeFileSync(finalFilePath, file.buffer);

      // 根据文件类型选择合适的加载器
      let loader;
      if (file.mimetype === 'application/pdf') {
        this.logger.log(`正在为文件 ${finalFileName} 使用PDF加载器`);
        loader = new PDFLoader(finalFilePath);
      } else {
        this.logger.log(`正在为文件 ${finalFileName} 使用文本加载器`);
        loader = new TextLoader(finalFilePath);
      }

      // 加载文档
      this.logger.log(`正在从 ${finalFileName} 加载文档内容`);
      const docs = await loader.load();

      // 计算总文档长度
      const totalLength = docs.reduce(
        (sum, doc) => sum + doc.pageContent.length,
        0,
      );

      // 如果是短文档，直接返回完整内容
      if (totalLength <= SHORT_DOCUMENT_THRESHOLD) {
        this.logger.log(
          `文档长度（${totalLength}字符）小于阈值（${SHORT_DOCUMENT_THRESHOLD}字符），跳过向量处理`,
        );
        const fullContent = docs.map((doc) => doc.pageContent).join('\n\n');

        // 创建新的临时文件记录
        const tempFile = this.sessionTempFileRepository.create({
          filename: finalFileName,
          originalFilename: originalName,
          mimeType: file.mimetype,
          size: file.size,
          path: finalFilePath,
          sessionId,
          clientId,
          isShortDocument: true,
          fullContent: fullContent,
        });

        // 保存到数据库
        await this.sessionTempFileRepository.save(tempFile);

        // 获取更新后的文件信息
        const tempFiles = await this.getSessionDocuments(sessionId, clientId);

        return {
          filePath: finalFilePath,
          tempFiles,
          fullContent,
          isShortDocument: true,
        };
      }

      // 如果是长文档，继续进行向量处理
      this.logger.log(`文档长度（${totalLength}字符）超过阈值，进行向量处理`);

      // 文本分割
      this.logger.log(`正在将文档 ${finalFileName} 分割成块`);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap: 200,
      });

      const splitDocs = await splitter.splitDocuments(docs);

      // 为每个文档片段添加元数据
      this.logger.log(`正在处理 ${finalFileName} 的 ${splitDocs.length} 个块`);
      const processedDocs = splitDocs.map((doc) => {
        return new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            filename: finalFileName,
            originalFilename: originalName,
            uploadedAt: new Date().toISOString(),
            mimeType: file.mimetype,
            sessionId,
            clientId,
          },
        });
      });

      // 将文档添加到向量存储
      this.logger.log(`正在添加 ${processedDocs.length} 个块到向量存储`);
      await this.addDocuments(processedDocs, sessionId, clientId);

      // 创建新的临时文件记录
      const tempFile = this.sessionTempFileRepository.create({
        filename: finalFileName,
        originalFilename: originalName,
        mimeType: file.mimetype,
        size: file.size,
        path: finalFilePath,
        sessionId,
        clientId,
        isShortDocument: false,
        fullContent: null,
      });

      // 保存到数据库
      await this.sessionTempFileRepository.save(tempFile);

      // 获取更新后的文件信息
      const tempFiles = await this.getSessionDocuments(sessionId, clientId);

      return {
        filePath: finalFilePath,
        tempFiles,
        isShortDocument: false,
      };
    } catch (error) {
      this.logger.error(
        `Failed to process uploaded file for session ${sessionId} and client ${clientId}:`,
        error,
      );
      // 如果文件已经保存但处理失败，删除文件
      if (finalFilePath && fs.existsSync(finalFilePath)) {
        try {
          fs.unlinkSync(finalFilePath);
          this.logger.log(`已清理失败上传的文件: ${finalFilePath}`);
        } catch (cleanupError) {
          this.logger.error(
            `Failed to clean up file ${finalFilePath}:`,
            cleanupError,
          );
        }
      }
      throw new HttpException(
        'Failed to process uploaded file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 初始化会话向量存储
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   * @returns 向量存储实例
   */
  private async initSessionVectorStore(
    sessionId: string,
    clientId: string,
  ): Promise<FaissStore> {
    const vectorStorePath = this.getSessionVectorStorePath(sessionId, clientId);
    const indexPath = path.join(vectorStorePath, 'faiss.index');
    const docStorePath = path.join(vectorStorePath, 'docstore.json');
    const storeKey = this.getStoreKey(sessionId, clientId);

    try {
      if (!fs.existsSync(vectorStorePath)) {
        fs.mkdirSync(vectorStorePath, { recursive: true });
      }

      let vectorStore: FaissStore;
      if (fs.existsSync(indexPath) && fs.existsSync(docStorePath)) {
        vectorStore = await FaissStore.load(vectorStorePath, this.embeddings);
      } else {
        const initialDocument = new Document({
          pageContent: 'Initial document to initialize vector store',
          metadata: { source: 'initialization', sessionId, clientId },
        });

        vectorStore = await FaissStore.fromDocuments(
          [initialDocument],
          this.embeddings,
        );
        await vectorStore.save(vectorStorePath);
      }

      this.sessionVectorStores.set(storeKey, vectorStore);
      return vectorStore;
    } catch (error) {
      this.logger.error(
        `Failed to initialize vector store for session ${sessionId} and client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to initialize session vector store',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取会话向量存储
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   * @returns 向量存储实例
   */
  async getSessionVectorStore(
    sessionId: string,
    clientId: string,
  ): Promise<FaissStore> {
    const storeKey = this.getStoreKey(sessionId, clientId);
    if (!this.sessionVectorStores.has(storeKey)) {
      await this.initSessionVectorStore(sessionId, clientId);
    }
    return this.sessionVectorStores.get(storeKey);
  }

  /**
   * 添加文档到向量存储
   * @param documents 文档列表
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   */
  async addDocuments(
    documents: Document[],
    sessionId: string,
    clientId: string,
  ): Promise<void> {
    try {
      const vectorStore = await this.getSessionVectorStore(sessionId, clientId);
      const documentsWithClientId = documents.map((doc) => ({
        ...doc,
        metadata: { ...doc.metadata, clientId },
      }));
      await vectorStore.addDocuments(documentsWithClientId);
      await vectorStore.save(
        this.getSessionVectorStorePath(sessionId, clientId),
      );
    } catch (error) {
      this.logger.error(
        `Failed to add documents for session ${sessionId} and client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to add documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 搜索相似文档
   * @param query 查询文本
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   * @param limit 返回结果数量限制
   * @returns 相似文档列表
   */
  async searchSimilarDocuments(
    query: string,
    sessionId: string,
    clientId: string,
    limit: number = 5,
  ): Promise<Document[]> {
    try {
      const vectorStore = await this.getSessionVectorStore(sessionId, clientId);
      const results = await vectorStore.similaritySearch(query, limit);
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to search documents for session ${sessionId} and client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to search similar documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 清理会话相关资源
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   */
  async cleanupSession(sessionId: string, clientId: string): Promise<void> {
    try {
      // 硬删除数据库记录
      await this.sessionTempFileRepository.delete({ sessionId, clientId });

      // 清理临时文件
      const sessionPath = this.getSessionPath(sessionId, clientId);
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }

      // 清理向量存储
      const vectorStorePath = this.getSessionVectorStorePath(
        sessionId,
        clientId,
      );
      if (fs.existsSync(vectorStorePath)) {
        fs.rmSync(vectorStorePath, { recursive: true, force: true });
      }

      // 清理内存中的向量存储
      const storeKey = this.getStoreKey(sessionId, clientId);
      this.sessionVectorStores.delete(storeKey);
    } catch (error) {
      this.logger.error(
        `Failed to cleanup session ${sessionId} and client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to cleanup session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取会话文档列表
   * @param sessionId 会话ID
   * @param clientId 客户端ID
   * @returns 文档信息列表
   */
  async getSessionDocuments(
    sessionId: string,
    clientId: string,
  ): Promise<
    { filename: string; type: string; size: number; createdAt: Date }[]
  > {
    try {
      // 从数据库获取未删除的临时文件记录
      const tempFiles = await this.sessionTempFileRepository.find({
        where: { sessionId, clientId },
        withDeleted: false,
      });

      return tempFiles.map((file) => ({
        filename: file.originalFilename,
        type: path.extname(file.originalFilename).slice(1) || 'unknown',
        size: file.size,
        createdAt: file.createdAt,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to get session documents for session ${sessionId} and client ${clientId}:`,
        error,
      );
      return [];
    }
  }
}
