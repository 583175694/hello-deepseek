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
import { AIChatService } from './services/ai-chat.service';
import { FileService, FileInfo } from './services/file.service';
import { SessionFileService } from './services/session-file.service';
import { TempDocumentService } from './services/temp-document.service';
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
    private readonly sessionFileService: SessionFileService,
    private readonly tempDocumentService: TempDocumentService,
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
  ) {
    return await this.sessionService.getSessionMessages(sessionId, clientId);
  }

  // 删除指定会话
  @Post('sessions/:sessionId/delete')
  async deleteSession(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
  ) {
    return await this.sessionService.deleteSession(sessionId, clientId);
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
      limits: { fileSize: 5 * 1024 * 1024 },
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

  // 上传会话文件端点
  @Post('sessions/:sessionId/files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSessionFile(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const sessionFile = await this.sessionFileService.uploadFile(
      file,
      sessionId,
      clientId,
    );
    return { message: 'File uploaded successfully', file: sessionFile };
  }

  // 获取会话文件列表端点
  @Get('sessions/:sessionId/files')
  async getSessionFiles(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
  ) {
    const files = await this.sessionFileService.getSessionFiles(
      sessionId,
      clientId,
    );
    return { files };
  }

  // 删除会话文件端点
  @Delete('sessions/:sessionId/files/:fileId')
  async deleteSessionFile(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
    @Param('fileId') fileId: string,
  ) {
    await this.sessionFileService.deleteFile(
      parseInt(fileId),
      sessionId,
      clientId,
    );
    return { message: 'File deleted successfully' };
  }

  // 上传临时文件端点
  @Post('sessions/:sessionId/temp-files')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTempFile(
    @Headers('x-client-id') clientId: string,
    @Param('sessionId') sessionId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = await this.tempDocumentService.saveUploadedFile(
      file,
      sessionId,
      clientId,
    );
    const documents = [
      new Document({
        pageContent: file.buffer.toString(),
        metadata: {
          filename: file.originalname,
          mimeType: file.mimetype,
          sessionId: sessionId,
          clientId: clientId,
        },
      }),
    ];
    await this.tempDocumentService.addDocuments(documents, sessionId, clientId);
    return {
      message: 'Temporary file uploaded and processed successfully',
      filePath,
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
}
