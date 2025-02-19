import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import { SessionTempFile } from '../entities/session-temp-file.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TempDocumentService {
  private readonly logger = new Logger(TempDocumentService.name);
  private embeddings: ByteDanceDoubaoEmbeddings;
  private readonly tempBasePath = path.join(process.cwd(), 'temp');
  private readonly vectorStoreTempPath = path.join(
    process.cwd(),
    'vector_store',
    'temp',
  );
  private sessionVectorStores: Map<string, FaissStore> = new Map();

  constructor(
    @InjectRepository(SessionTempFile)
    private sessionTempFileRepository: Repository<SessionTempFile>,
  ) {
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

  private getSessionPath(sessionId: string, clientId: string): string {
    return path.join(this.tempBasePath, clientId, sessionId);
  }

  private getSessionVectorStorePath(
    sessionId: string,
    clientId: string,
  ): string {
    return path.join(this.vectorStoreTempPath, clientId, sessionId);
  }

  private getStoreKey(sessionId: string, clientId: string): string {
    return `${clientId}:${sessionId}`;
  }

  async saveUploadedFile(
    file: Express.Multer.File,
    sessionId: string,
    clientId: string,
  ): Promise<string> {
    try {
      const sessionPath = this.getSessionPath(sessionId, clientId);
      if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
      }

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

        // 软删除现有的临时文件记录
        await this.sessionTempFileRepository.softDelete({
          sessionId,
          clientId,
        });
      }

      const filePath = path.join(sessionPath, file.originalname);
      fs.writeFileSync(filePath, file.buffer);

      // 创建新的临时文件记录
      const tempFile = this.sessionTempFileRepository.create({
        filename: file.originalname,
        originalFilename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        sessionId,
        clientId,
      });

      // 保存到数据库
      await this.sessionTempFileRepository.save(tempFile);

      return filePath;
    } catch (error) {
      this.logger.error(
        `Failed to save uploaded file for session ${sessionId} and client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to save uploaded file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  async cleanupSession(sessionId: string, clientId: string): Promise<void> {
    try {
      // 软删除数据库记录
      await this.sessionTempFileRepository.softDelete({ sessionId, clientId });

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
        filename: file.filename,
        type: path.extname(file.filename).slice(1) || 'unknown',
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
