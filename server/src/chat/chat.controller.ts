// 导入所需的NestJS装饰器和类型
import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Sse,
  MessageEvent,
  Query,
  Get,
  Param,
  Body,
  Delete,
  UseInterceptors,
  UploadedFile,
  Headers,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Document } from '@langchain/core/documents';
import { SessionService } from './services/session.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './chat.service';
import { FileService, FileInfo } from './services/file.service';
import { TempDocumentService } from './services/temp-document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { models } from 'src/configs/models';
import { MessageService } from './services/message.service';

// 定义聊天控制器
@Controller('chat')
export class ChatController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly documentService: DocumentService,
    private readonly aiChatService: AIChatService,
    private readonly fileService: FileService,
    private readonly tempDocumentService: TempDocumentService,
    private readonly messageService: MessageService,
  ) {}

  // 创建新会话的接口
  @Post('session')
  async createSession(
    @Headers('x-client-id') clientId: string,
    @Body() data: { roleName?: string; systemPrompt?: string },
  ) {
    return await this.sessionService.createSession(
      clientId,
      data.roleName,
      data.systemPrompt,
    );
  }

  // 处理流式聊天请求
  @Sse('stream')
  async streamChat(
    @Headers('x-client-id') clientId: string,
    @Query('message') message: string,
    @Query('sessionId') sessionId?: string,
    @Query('useWebSearch') useWebSearch?: string,
    @Query('useVectorSearch') useVectorSearch?: string,
    @Query('useTempDocSearch') useTempDocSearch?: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_r1',
  ): Promise<Observable<MessageEvent>> {
    if (!message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    const shouldUseWebSearch =
      useWebSearch === undefined
        ? false
        : useWebSearch.toLowerCase() === 'true';
    const shouldUseVectorSearch =
      useVectorSearch === undefined
        ? false
        : useVectorSearch.toLowerCase() === 'true';
    const shouldUseTempDocSearch =
      useTempDocSearch === undefined
        ? false
        : useTempDocSearch.toLowerCase() === 'true';

    return new Observable<MessageEvent>((subscriber) => {
      this.aiChatService
        .streamChat(
          message,
          clientId,
          sessionId,
          (response) => subscriber.next({ data: response }),
          shouldUseWebSearch,
          shouldUseVectorSearch,
          shouldUseTempDocSearch,
          modelId,
        )
        .then(() => {
          subscriber.next({ data: '[DONE]' });
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  // 获取所有会话列表的接口
  @Get('sessions')
  async getSessions(@Headers('x-client-id') clientId: string) {
    return { sessions: await this.sessionService.getSessions(clientId) };
  }

  // 获取指定会话的历史消息
  @Get('sessions/:sessionId/messages')
  async getSessionMessages(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const sessionData = await this.sessionService.getSessionMessages(
      sessionId,
      clientId,
      page ? Number(page) : 1,
      pageSize ? Number(pageSize) : 20,
    );
    const tempFiles = await this.tempDocumentService.getSessionDocuments(
      sessionId,
      clientId,
    );

    return {
      ...sessionData,
      tempFiles,
    };
  }

  // 删除指定会话
  @Post('sessions/:sessionId/delete')
  async deleteSession(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return await this.sessionService.deleteSession(sessionId, clientId);
  }

  // 更新会话
  @Post('sessions/:sessionId/update')
  async updateSession(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
    @Body() updates: any,
  ) {
    return await this.sessionService.updateSession(
      sessionId,
      clientId,
      updates,
    );
  }

  // 上传文档的接口
  @Post('documents')
  async uploadDocument(
    @Headers('x-client-id') clientId: string,
    @Body() data: { content: string; metadata?: any },
  ) {
    const document = new Document({
      pageContent: data.content,
      metadata: { ...data.metadata, clientId },
    });
    await this.documentService.addDocuments(clientId, [document]);
    return { message: 'Document added successfully' };
  }

  // 搜索文档的接口
  @Get('documents/search')
  async searchDocuments(
    @Headers('x-client-id') clientId: string,
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ) {
    return await this.documentService.searchSimilarDocuments(
      clientId,
      query,
      limit,
    );
  }

  // 上传文件端点
  @Post('files/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async uploadFile(
    @Headers('x-client-id') clientId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('chunkSize') chunkSize?: number,
  ) {
    await this.fileService.uploadAndProcessFile(file, clientId, chunkSize);
    return { message: 'File uploaded and processed successfully' };
  }

  // 获取文件列表端点
  @Get('files')
  async listFiles(@Headers('x-client-id') clientId: string): Promise<{
    files: FileInfo[];
  }> {
    const files = await this.fileService.listFiles(clientId);
    return { files };
  }

  // 删除文件端点
  @Delete('files/:filename')
  async deleteFile(
    @Headers('x-client-id') clientId: string,
    @Param('filename') filename: string,
  ) {
    await this.fileService.deleteFile(filename, clientId);
    return { message: 'File deleted successfully' };
  }

  // 上传临时文件端点
  @Post('sessions/:sessionId/temp-files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempDocument(
    @UploadedFile() file: Express.Multer.File,
    @Param('sessionId') sessionId: string,
    @Headers('x-client-id') clientId: string,
  ) {
    const { filePath, tempFiles } =
      await this.tempDocumentService.uploadAndProcessFile(
        file,
        sessionId,
        clientId,
      );

    return {
      message: 'File uploaded and processed successfully',
      filePath,
      files: tempFiles,
    };
  }

  // 清理会话临时文件端点
  @Delete('sessions/:sessionId/temp-files')
  async cleanupTempFiles(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
  ) {
    await this.tempDocumentService.cleanupSession(sessionId, clientId);
    return { message: 'Temporary files cleaned up successfully' };
  }

  // 获取可用的模型列表
  @Get('models')
  async getAvailableModels() {
    return Object.entries(models).map(([id, model]) => ({
      id,
      ...model,
    }));
  }

  // 生成系统提示词
  @Post('generate-prompt')
  async generatePrompt(
    @Headers('x-client-id') clientId: string,
    @Body('roleName') roleName: string,
    @Body('modelId') modelId?: string,
  ) {
    if (!roleName) {
      throw new HttpException('Role name is required', HttpStatus.BAD_REQUEST);
    }

    const systemPrompt = await this.aiChatService.generateSystemPrompt(
      roleName,
      modelId,
    );

    return { systemPrompt };
  }

  // 删除消息
  @Post('messages/:messageId/delete')
  async deleteMessage(
    @Headers('x-client-id') clientId: string,
    @Param('messageId') messageId: string,
  ) {
    try {
      await this.messageService.deleteMessage(messageId);
      return { message: 'Message deleted successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
