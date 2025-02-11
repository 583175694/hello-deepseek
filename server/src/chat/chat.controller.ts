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
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Document } from '@langchain/core/documents';
import { SessionService } from './services/session.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './services/ai-chat.service';
import { FileService, FileInfo } from './services/file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// 定义聊天控制器
@Controller('chat')
export class ChatController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly documentService: DocumentService,
    private readonly aiChatService: AIChatService,
    private readonly fileService: FileService,
  ) {}

  // 创建新会话的接口
  @Post('session')
  async createSession() {
    return await this.sessionService.createSession();
  }

  // 处理流式聊天请求
  @Sse('stream')
  async streamChat(
    @Query('message') message: string,
    @Query('sessionId') sessionId?: string,
  ): Promise<Observable<MessageEvent>> {
    if (!message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    if (!sessionId) {
      const session = await this.sessionService.createSession();
      sessionId = session.sessionId;
    }

    return new Observable<MessageEvent>((subscriber) => {
      this.aiChatService
        .streamChat(message, sessionId, (token: string) => {
          subscriber.next({ data: token });
        })
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
  async getSessions() {
    return { sessions: await this.sessionService.getSessions() };
  }

  // 获取指定会话的历史消息
  @Get('sessions/:sessionId/messages')
  async getSessionMessages(@Param('sessionId') sessionId: string) {
    return await this.sessionService.getSessionMessages(sessionId);
  }

  // 删除指定会话
  @Post('sessions/:sessionId/delete')
  async deleteSession(@Param('sessionId') sessionId: string) {
    return await this.sessionService.deleteSession(sessionId);
  }

  // 上传文档的接口
  @Post('documents')
  async uploadDocument(@Body() data: { content: string; metadata?: any }) {
    const document = new Document({
      pageContent: data.content,
      metadata: data.metadata || {},
    });
    await this.documentService.addDocuments([document]);
    return { message: 'Document added successfully' };
  }

  // 搜索文档的接口
  @Get('documents/search')
  async searchDocuments(
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ) {
    return await this.documentService.searchSimilarDocuments(query, limit);
  }

  // 上传文件端点
  @Post('files/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('chunkSize') chunkSize?: number,
  ) {
    await this.fileService.uploadAndProcessFile(file, chunkSize);
    return { message: 'File uploaded and processed successfully' };
  }

  // 获取文件列表端点
  @Get('files')
  async listFiles(): Promise<{ files: FileInfo[] }> {
    const files = await this.fileService.listFiles();
    return { files };
  }

  // 删除文件端点
  @Delete('files/:filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.fileService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
}
