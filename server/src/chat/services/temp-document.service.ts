import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
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

  constructor() {
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

  private getSessionPath(sessionId: string): string {
    return path.join(this.tempBasePath, sessionId);
  }

  private getSessionVectorStorePath(sessionId: string): string {
    return path.join(this.vectorStoreTempPath, sessionId);
  }

  async saveUploadedFile(
    file: Express.Multer.File,
    sessionId: string,
  ): Promise<string> {
    try {
      const sessionPath = this.getSessionPath(sessionId);
      if (!fs.existsSync(sessionPath)) {
        fs.mkdirSync(sessionPath, { recursive: true });
      }

      const filePath = path.join(sessionPath, file.originalname);
      fs.writeFileSync(filePath, file.buffer);
      return filePath;
    } catch (error) {
      this.logger.error(
        `Failed to save uploaded file for session ${sessionId}:`,
        error,
      );
      throw new HttpException(
        'Failed to save uploaded file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async initSessionVectorStore(sessionId: string): Promise<FaissStore> {
    const vectorStorePath = this.getSessionVectorStorePath(sessionId);
    const indexPath = path.join(vectorStorePath, 'faiss.index');
    const docStorePath = path.join(vectorStorePath, 'docstore.json');

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
          metadata: { source: 'initialization', sessionId },
        });

        vectorStore = await FaissStore.fromDocuments(
          [initialDocument],
          this.embeddings,
        );
        await vectorStore.save(vectorStorePath);
      }

      this.sessionVectorStores.set(sessionId, vectorStore);
      return vectorStore;
    } catch (error) {
      this.logger.error(
        `Failed to initialize vector store for session ${sessionId}:`,
        error,
      );
      throw new HttpException(
        'Failed to initialize session vector store',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSessionVectorStore(sessionId: string): Promise<FaissStore> {
    if (!this.sessionVectorStores.has(sessionId)) {
      await this.initSessionVectorStore(sessionId);
    }
    return this.sessionVectorStores.get(sessionId);
  }

  async addDocuments(documents: Document[], sessionId: string): Promise<void> {
    try {
      const vectorStore = await this.getSessionVectorStore(sessionId);
      await vectorStore.addDocuments(documents);
      await vectorStore.save(this.getSessionVectorStorePath(sessionId));
    } catch (error) {
      this.logger.error(
        `Failed to add documents for session ${sessionId}:`,
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
    limit: number = 5,
  ): Promise<Document[]> {
    try {
      const vectorStore = await this.getSessionVectorStore(sessionId);
      const results = await vectorStore.similaritySearch(query, limit);
      return results;
    } catch (error) {
      this.logger.error(
        `Failed to search documents for session ${sessionId}:`,
        error,
      );
      throw new HttpException(
        'Failed to search similar documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async cleanupSession(sessionId: string): Promise<void> {
    try {
      // 清理临时文件
      const sessionPath = this.getSessionPath(sessionId);
      if (fs.existsSync(sessionPath)) {
        fs.rmSync(sessionPath, { recursive: true, force: true });
      }

      // 清理向量存储
      const vectorStorePath = this.getSessionVectorStorePath(sessionId);
      if (fs.existsSync(vectorStorePath)) {
        fs.rmSync(vectorStorePath, { recursive: true, force: true });
      }

      // 清理内存中的向量存储
      this.sessionVectorStores.delete(sessionId);
    } catch (error) {
      this.logger.error(`Failed to cleanup session ${sessionId}:`, error);
      throw new HttpException(
        'Failed to cleanup session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
