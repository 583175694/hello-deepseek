import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 文档服务类
 * 用于管理和处理文档的向量存储、搜索等功能
 */
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  // 存储每个客户端的向量存储实例
  private vectorStores: Map<string, Chroma> = new Map();
  // 字节跳动的文本嵌入模型实例
  private embeddings: ByteDanceDoubaoEmbeddings;
  // 向量存储的基础路径
  private readonly vectorStoreBasePath = path.join(
    process.cwd(),
    'vector_store',
  );

  /**
   * 构造函数
   * 初始化字节跳动的文本嵌入模型
   */
  constructor() {
    this.embeddings = new ByteDanceDoubaoEmbeddings({
      apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      model: 'ep-20250215013011-6nd8j',
      verbose: true,
      maxRetries: 3,
      maxConcurrency: 1,
    });
  }

  /**
   * 获取客户端向量存储路径
   * @param clientId 客户端ID
   * @returns 向量存储路径
   */
  private getClientVectorStorePath(clientId: string): string {
    return path.join(this.vectorStoreBasePath, clientId);
  }

  /**
   * 获取或创建客户端的向量存储实例
   * @param clientId 客户端ID
   * @returns Promise<Chroma> 向量存储实例
   */
  private async getVectorStore(clientId: string): Promise<Chroma> {
    // 如果已存在，直接返回缓存的实例
    if (this.vectorStores.has(clientId)) {
      return this.vectorStores.get(clientId);
    }

    const vectorStorePath = this.getClientVectorStorePath(clientId);

    try {
      // 确保向量存储目录存在
      if (!fs.existsSync(vectorStorePath)) {
        fs.mkdirSync(vectorStorePath, { recursive: true });
      }

      // 创建或加载 Chroma 实例
      const vectorStore = await Chroma.fromExistingCollection(this.embeddings, {
        collectionName: `client_${clientId}`,
        url: process.env.CHROMA_SERVER_URL || 'http://localhost:8000',
        collectionMetadata: {
          'hnsw:space': 'cosine',
        },
      });

      // 缓存向量存储实例
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

  /**
   * 添加文档到向量存储
   * @param clientId 客户端ID
   * @param documents 要添加的文档数组
   */
  async addDocuments(clientId: string, documents: Document[]): Promise<void> {
    try {
      this.logger.log(`Starting to add documents for client ${clientId}`);
      this.logger.log(`Number of documents to add: ${documents.length}`);

      // 为每个文档添加客户端ID和唯一ID
      const documentsWithClientId = documents.map((doc) => ({
        ...doc,
        metadata: {
          ...doc.metadata,
          clientId,
          id:
            doc.metadata?.id ||
            `${clientId}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
      }));

      this.logger.log(
        `Attempting to create Chroma collection: client_${clientId}`,
      );

      // 创建新的 Chroma 集合
      const vectorStore = await Chroma.fromDocuments(
        documentsWithClientId,
        this.embeddings,
        {
          collectionName: `client_${clientId}`,
          url: process.env.CHROMA_SERVER_URL || 'http://localhost:8000',
          collectionMetadata: {
            'hnsw:space': 'cosine',
          },
        },
      );

      this.logger.log(
        `Successfully created Chroma collection and added documents`,
      );

      // 更新缓存
      this.vectorStores.set(clientId, vectorStore);
      this.logger.log(`Updated vector store cache for client ${clientId}`);
    } catch (error) {
      this.logger.error('Failed to add documents:', error);
      if (error.response?.data) {
        this.logger.error('API Error details:', error.response.data);
      }
      this.logger.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      throw new HttpException(
        `Failed to add documents: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 搜索相似文档
   * @param clientId 客户端ID
   * @param query 查询文本
   * @param limit 返回结果数量限制
   * @returns Promise<Document[]> 相似文档数组
   */
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

  /**
   * 清理客户端的向量存储
   * @param clientId 客户端ID
   */
  async clearVectorStore(clientId: string): Promise<void> {
    try {
      this.logger.log(
        `Attempting to clear vector store for client ${clientId}`,
      );

      // 获取或创建向量存储实例
      const vectorStore = await this.getVectorStore(clientId);

      try {
        // 删除所有文档
        await vectorStore.delete({
          ids: undefined, // 不指定 ids 会删除所有文档
        });
        this.logger.log(
          `Successfully deleted all documents for client ${clientId}`,
        );
      } catch (error) {
        this.logger.warn(
          `Failed to delete documents for client ${clientId}, error: ${error.message}`,
        );
      }

      // 从缓存中移除向量存储实例
      this.vectorStores.delete(clientId);

      this.logger.log(
        `Successfully cleared vector store for client ${clientId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to clear vector store for client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to clear vector store',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 删除特定文档
   * @param clientId 客户端ID
   * @param documentId 文档ID
   */
  async deleteDocument(clientId: string, documentId: string): Promise<void> {
    try {
      this.logger.log(
        `Attempting to delete document ${documentId} for client ${clientId}`,
      );
      const vectorStore = await this.getVectorStore(clientId);

      try {
        // 删除指定 ID 的文档
        await vectorStore.delete({
          ids: [documentId],
        });
        this.logger.log(
          `Successfully deleted document ${documentId} for client ${clientId}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to delete document ${documentId}, error: ${error.message}`,
        );
        throw error;
      }
    } catch (error) {
      this.logger.error(
        `Failed to delete document ${documentId} for client ${clientId}:`,
        error,
      );
      throw new HttpException(
        'Failed to delete document',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
