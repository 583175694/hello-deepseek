import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private vectorStore: FaissStore;
  private embeddings: ByteDanceDoubaoEmbeddings;
  private readonly vectorStorePath = path.join(process.cwd(), 'vector_store');
  private readonly indexPath = path.join(this.vectorStorePath, 'faiss.index');
  private readonly docStorePath = path.join(
    this.vectorStorePath,
    'docstore.json',
  );

  constructor() {
    this.embeddings = new ByteDanceDoubaoEmbeddings({
      apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      model: 'ep-20250211181607-xhts2',
      verbose: true,
    });

    this.initVectorStore();
  }

  private async initVectorStore() {
    try {
      if (!fs.existsSync(this.vectorStorePath)) {
        fs.mkdirSync(this.vectorStorePath, { recursive: true });
      }

      if (fs.existsSync(this.indexPath) && fs.existsSync(this.docStorePath)) {
        this.vectorStore = await FaissStore.load(
          this.vectorStorePath,
          this.embeddings,
        );
      } else {
        const initialDocument = new Document({
          pageContent: 'Initial document to initialize vector store',
          metadata: { source: 'initialization' },
        });

        this.vectorStore = await FaissStore.fromDocuments(
          [initialDocument],
          this.embeddings,
        );

        await this.vectorStore.save(this.vectorStorePath);
      }
    } catch (error) {
      this.logger.error('Failed to initialize vector store:', error);
      throw new HttpException(
        `Failed to initialize vector store: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addDocuments(documents: Document[]): Promise<void> {
    try {
      if (!this.vectorStore) {
        throw new Error('Vector store not initialized');
      }

      await this.vectorStore.addDocuments(documents);
      await this.vectorStore.save(this.vectorStorePath);
    } catch (error) {
      this.logger.error('Failed to add documents:', error);
      throw new HttpException(
        `Failed to add documents: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchSimilarDocuments(
    query: string,
    limit: number = 5,
  ): Promise<Document[]> {
    try {
      const results = await this.vectorStore.similaritySearch(query, limit);
      return results;
    } catch (error) {
      this.logger.error('Failed to search documents:', error);
      throw new HttpException(
        'Failed to search similar documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
