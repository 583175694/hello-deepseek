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
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Document } from '@langchain/core/documents';
import { SessionService } from './services/session.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './services/ai-chat.service';

// 定义聊天控制器
@Controller('chat')
export class ChatController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly documentService: DocumentService,
    private readonly aiChatService: AIChatService,
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
}
