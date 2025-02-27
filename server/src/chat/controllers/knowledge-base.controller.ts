import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { KnowledgeBaseService } from '../services/knowledge-base.service';
import { KnowledgeBase } from '../entities/knowledge-base.entity';
import { KnowledgeDocument } from '../entities/knowledge-document.entity';

/**
 * 知识库相关的控制器
 * 处理知识库的创建、查询、文档上传、删除等操作
 */
@Controller('knowledge-bases')
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

  /**
   * 创建新的知识库
   * @param clientId 客户端ID
   * @param data 包含知识库名称的数据对象
   * @returns 创建的知识库实体
   */
  @Post()
  async createKnowledgeBase(
    @Headers('x-client-id') clientId: string,
    @Body() data: { name: string },
  ): Promise<KnowledgeBase> {
    return await this.knowledgeBaseService.createKnowledgeBase(
      data.name,
      clientId,
    );
  }

  /**
   * 获取指定客户端的所有知识库列表
   * @param clientId 客户端ID
   * @returns 知识库实体数组
   */
  @Get()
  async getKnowledgeBases(
    @Headers('x-client-id') clientId: string,
  ): Promise<KnowledgeBase[]> {
    return await this.knowledgeBaseService.getKnowledgeBases(clientId);
  }

  /**
   * 上传文档到指定的知识库
   * @param clientId 客户端ID
   * @param knowledgeBaseId 知识库ID
   * @param file 上传的文件
   * @param chunkSize 文档分块大小
   * @returns 创建的知识库文档实体
   */
  @Post(':id/documents')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadDocument(
    @Headers('x-client-id') clientId: string,
    @Param('id') knowledgeBaseId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('chunkSize') chunkSize?: number,
  ): Promise<KnowledgeDocument> {
    return await this.knowledgeBaseService.uploadDocument(
      file,
      knowledgeBaseId,
      clientId,
      chunkSize,
    );
  }

  /**
   * 获取指定知识库中的所有文档
   * @param clientId 客户端ID
   * @param knowledgeBaseId 知识库ID
   * @returns 知识库文档实体数组
   */
  @Get(':id/documents')
  async getDocuments(
    @Headers('x-client-id') clientId: string,
    @Param('id') knowledgeBaseId: string,
  ): Promise<KnowledgeDocument[]> {
    return await this.knowledgeBaseService.getDocuments(
      knowledgeBaseId,
      clientId,
    );
  }

  /**
   * 从知识库中删除指定文档
   * @param clientId 客户端ID
   * @param knowledgeBaseId 知识库ID
   * @param documentId 文档ID
   */
  @Delete(':baseId/documents/:docId')
  async deleteDocument(
    @Headers('x-client-id') clientId: string,
    @Param('baseId') knowledgeBaseId: string,
    @Param('docId') documentId: string,
  ): Promise<void> {
    await this.knowledgeBaseService.deleteDocument(
      documentId,
      knowledgeBaseId,
      clientId,
    );
  }

  /**
   * 删除指定的知识库
   * @param clientId 客户端ID
   * @param knowledgeBaseId 知识库ID
   */
  @Delete(':id')
  async deleteKnowledgeBase(
    @Headers('x-client-id') clientId: string,
    @Param('id') knowledgeBaseId: string,
  ): Promise<void> {
    await this.knowledgeBaseService.deleteKnowledgeBase(
      knowledgeBaseId,
      clientId,
    );
  }
}
