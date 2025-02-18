import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  private vectorStores: Map<string, FaissStore> = new Map();
  private embeddings: ByteDanceDoubaoEmbeddings;
  private readonly vectorStoreBasePath = path.join(
    process.cwd(),
    'vector_store',
  );

  constructor() {
    this.embeddings = new ByteDanceDoubaoEmbeddings({
      apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      model: 'ep-20250215013011-6nd8j',
      verbose: true,
    });
  }

  private getClientVectorStorePath(clientId: string): string {
    return path.join(this.vectorStoreBasePath, clientId);
  }

  private async getVectorStore(clientId: string): Promise<FaissStore> {
    if (this.vectorStores.has(clientId)) {
      return this.vectorStores.get(clientId);
    }

    const vectorStorePath = this.getClientVectorStorePath(clientId);
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
          metadata: { source: 'initialization', clientId },
        });

        vectorStore = await FaissStore.fromDocuments(
          [initialDocument],
          this.embeddings,
        );

        await vectorStore.save(vectorStorePath);
      }

      this.vectorStores.set(clientId, vectorStore);
      return vectorStore;
    } catch (error) {
      this.logger.error('Failed to initialize vector store:', error);
      throw new HttpException(
        `Failed to initialize vector store: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addDocuments(clientId: string, documents: Document[]): Promise<void> {
    try {
      const vectorStore = await this.getVectorStore(clientId);
      const documentsWithClientId = documents.map((doc) => ({
        ...doc,
        metadata: { ...doc.metadata, clientId },
      }));

      await vectorStore.addDocuments(documentsWithClientId);
      await vectorStore.save(this.getClientVectorStorePath(clientId));
    } catch (error) {
      this.logger.error('Failed to add documents:', error);
      throw new HttpException(
        `Failed to add documents: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async searchSimilarDocuments(
    clientId: string,
    query: string,
    limit: number = 5,
  ): Promise<Document[]> {
    try {
      const vectorStore = await this.getVectorStore(clientId);
      const results = await vectorStore.similaritySearch(query, limit);
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
