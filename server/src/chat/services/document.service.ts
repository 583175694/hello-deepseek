import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import * as fs from 'fs';
import * as path from 'path';
import { embeddingModels } from 'src/configs/models';

/**
 * 文档服务类
 * 用于管理和处理文档的向量存储、搜索等功能
 */
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  // 存储每个客户端的向量存储实例
  private vectorStores: Map<string, FaissStore> = new Map();
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
      model: embeddingModels.doubao_embedding.modelName,
      verbose: true,
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
   * @returns Promise<FaissStore> 向量存储实例
   */
  private async getVectorStore(clientId: string): Promise<FaissStore> {
    // 如果已存在，直接返回缓存的实例
    if (this.vectorStores.has(clientId)) {
      return this.vectorStores.get(clientId);
    }

    const vectorStorePath = this.getClientVectorStorePath(clientId);
    const indexPath = path.join(vectorStorePath, 'faiss.index');
    const docStorePath = path.join(vectorStorePath, 'docstore.json');

    try {
      // 确保向量存储目录存在
      if (!fs.existsSync(vectorStorePath)) {
        fs.mkdirSync(vectorStorePath, { recursive: true });
      }

      let vectorStore: FaissStore;
      // 如果存在现有的向量存储文件，则加载它
      if (fs.existsSync(indexPath) && fs.existsSync(docStorePath)) {
        vectorStore = await FaissStore.load(vectorStorePath, this.embeddings);
      } else {
        // 否则创建新的向量存储
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
      const vectorStore = await this.getVectorStore(clientId);
      // 为每个文档添加客户端ID
      const documentsWithClientId = documents.map((doc) => ({
        ...doc,
        metadata: { ...doc.metadata, clientId },
      }));

      // 添加文档并保存向量存储
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
   * 清除客户端的所有文档向量存储
   */
  async clearDocuments(clientId: string): Promise<void> {
    try {
      // 删除向量存储实例
      this.vectorStores.delete(clientId);

      // 删除向量存储文件
      const vectorStorePath = path.join(this.vectorStoreBasePath, clientId);
      if (fs.existsSync(vectorStorePath)) {
        fs.rmSync(vectorStorePath, { recursive: true, force: true });
      }

      this.logger.log(`已清除客户端 ${clientId} 的向量存储`);
    } catch (error) {
      this.logger.error(
        `Error clearing documents for client ${clientId}:`,
        error,
      );
      throw error;
    }
  }
}
