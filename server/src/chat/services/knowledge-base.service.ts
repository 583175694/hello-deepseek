import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KnowledgeBase } from '../entities/knowledge-base.entity';
import { KnowledgeDocument } from '../entities/knowledge-document.entity';
import { FileLoaderService } from './file-loader.service';
import { DocumentService } from './document.service';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';

@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);
  private readonly uploadBaseDir = path.join(process.cwd(), 'uploads');

  constructor(
    @InjectRepository(KnowledgeBase)
    private knowledgeBaseRepository: Repository<KnowledgeBase>,
    @InjectRepository(KnowledgeDocument)
    private knowledgeDocumentRepository: Repository<KnowledgeDocument>,
    private fileLoaderService: FileLoaderService,
    private documentService: DocumentService,
  ) {
    // 确保上传基础目录存在
    if (!fs.existsSync(this.uploadBaseDir)) {
      fs.mkdirSync(this.uploadBaseDir, { recursive: true });
    }
  }

  /**
   * 获取客户端的知识库上传目录路径
   */
  private getClientUploadDir(
    clientId: string,
    knowledgeBaseId: string,
  ): string {
    const clientDir = path.join(this.uploadBaseDir, clientId, knowledgeBaseId);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    return clientDir;
  }

  /**
   * 处理文件名，确保文件名的唯一性和安全性
   */
  private sanitizeFileName(fileName: string): string {
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    return `${nameWithoutExt}_${Date.now()}${ext}`;
  }

  /**
   * 创建新的知识库
   */
  async createKnowledgeBase(
    name: string,
    clientId: string,
  ): Promise<KnowledgeBase> {
    const knowledgeBase = this.knowledgeBaseRepository.create({
      name,
      clientId,
    });
    return await this.knowledgeBaseRepository.save(knowledgeBase);
  }

  /**
   * 获取客户端的所有知识库
   */
  async getKnowledgeBases(clientId: string): Promise<KnowledgeBase[]> {
    return await this.knowledgeBaseRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 上传文档到知识库
   */
  async uploadDocument(
    file: Express.Multer.File,
    knowledgeBaseId: string,
    clientId: string,
    chunkSize: number = 1000,
  ): Promise<KnowledgeDocument> {
    // 检查知识库是否存在
    const knowledgeBase = await this.knowledgeBaseRepository.findOne({
      where: { id: knowledgeBaseId, clientId },
    });

    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }

    // 检查文档数量是否超过限制
    if (knowledgeBase.documentsCount >= 8) {
      throw new Error('Maximum document limit reached (8)');
    }

    let finalFilePath: string;
    let finalFileName: string;

    try {
      // 确保文件名是 UTF-8 编码
      const originalName = Buffer.from(file.originalname, 'binary').toString(
        'utf8',
      );

      // 处理文件名
      const sanitizedFileName = this.sanitizeFileName(originalName);
      const uploadDir = this.getClientUploadDir(clientId, knowledgeBaseId);
      const filePath = path.join(uploadDir, sanitizedFileName);

      finalFileName = sanitizedFileName;
      finalFilePath = filePath;

      // 保存文件
      this.logger.log(
        `正在为知识库 ${knowledgeBaseId} 保存文件 ${finalFileName} 到 ${finalFilePath}`,
      );
      fs.writeFileSync(finalFilePath, file.buffer);

      // 创建文档记录
      const document = this.knowledgeDocumentRepository.create({
        filename: finalFileName,
        originalFilename: originalName,
        mimeType: file.mimetype,
        size: file.size,
        path: finalFilePath,
        clientId,
        knowledgeBaseId,
      });

      // 保存到数据库
      const savedDocument =
        await this.knowledgeDocumentRepository.save(document);

      // 更新知识库文档数量
      knowledgeBase.documentsCount += 1;
      await this.knowledgeBaseRepository.save(knowledgeBase);

      // 处理文档内容并添加到向量存储
      const { docs: processedDocs } =
        await this.fileLoaderService.loadAndProcessFile(
          finalFilePath,
          file.mimetype,
          {
            filename: finalFileName,
            originalFilename: originalName,
            uploadedAt: new Date().toISOString(),
            mimeType: file.mimetype,
            clientId,
            knowledgeBaseId,
          },
          chunkSize,
        );

      // 将文档添加到向量存储
      await this.documentService.addDocuments(clientId, processedDocs);

      return savedDocument;
    } catch (error) {
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
      throw error;
    }
  }

  /**
   * 获取知识库中的所有文档
   */
  async getDocuments(
    knowledgeBaseId: string,
    clientId: string,
  ): Promise<KnowledgeDocument[]> {
    return await this.knowledgeDocumentRepository.find({
      where: { knowledgeBaseId, clientId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 删除知识库中的文档
   */
  async deleteDocument(
    documentId: string,
    knowledgeBaseId: string,
    clientId: string,
  ): Promise<void> {
    const document = await this.knowledgeDocumentRepository.findOne({
      where: { id: documentId, knowledgeBaseId, clientId },
      relations: ['knowledgeBase'],
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // 删除物理文件
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    // 删除数据库记录
    await this.knowledgeDocumentRepository.remove(document);

    // 更新知识库文档数量
    document.knowledgeBase.documentsCount -= 1;
    await this.knowledgeBaseRepository.save(document.knowledgeBase);

    // 重建知识库的向量索引
    await this.rebuildKnowledgeBaseIndex(knowledgeBaseId, clientId);
  }

  /**
   * 重建知识库的向量索引
   */
  private async rebuildKnowledgeBaseIndex(
    knowledgeBaseId: string,
    clientId: string,
  ): Promise<void> {
    // 获取知识库中的所有文档
    const documents = await this.knowledgeDocumentRepository.find({
      where: { knowledgeBaseId, clientId },
    });

    // 清除现有的向量存储
    await this.documentService.clearDocuments(clientId);

    // 重新处理所有文档
    for (const document of documents) {
      const { docs: processedDocs } =
        await this.fileLoaderService.loadAndProcessFile(
          document.path,
          document.mimeType,
          {
            filename: document.filename,
            originalFilename: document.originalFilename,
            uploadedAt: document.createdAt.toISOString(),
            mimeType: document.mimeType,
            clientId,
            knowledgeBaseId,
          },
        );

      // 将文档添加到向量存储
      await this.documentService.addDocuments(clientId, processedDocs);
    }
  }

  /**
   * 删除知识库
   */
  async deleteKnowledgeBase(
    knowledgeBaseId: string,
    clientId: string,
  ): Promise<void> {
    const knowledgeBase = await this.knowledgeBaseRepository.findOne({
      where: { id: knowledgeBaseId, clientId },
      relations: ['documents'],
    });

    if (!knowledgeBase) {
      throw new Error('Knowledge base not found');
    }

    // 删除所有相关文档的物理文件
    for (const document of knowledgeBase.documents) {
      if (fs.existsSync(document.path)) {
        fs.unlinkSync(document.path);
      }
    }

    // 删除知识库目录
    const baseDir = path.join(this.uploadBaseDir, clientId, knowledgeBaseId);
    if (fs.existsSync(baseDir)) {
      fs.rmSync(baseDir, { recursive: true, force: true });
    }

    // 删除知识库及其所有文档的数据库记录
    await this.knowledgeBaseRepository.remove(knowledgeBase);

    // 重建向量索引
    await this.documentService.clearDocuments(clientId);
  }
}
