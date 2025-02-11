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
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';
import { Document } from '@langchain/core/documents';

// 定义聊天控制器
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 创建新会话的接口
  @Post('session')
  async createSession() {
    try {
      const session = await this.chatService.createSession();
      return {
        id: session.id,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
      const session = await this.chatService.createSession();
      sessionId = session.sessionId;
    }

    return new Observable<MessageEvent>((subscriber) => {
      this.chatService
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
    try {
      const sessions = await this.chatService.getSessions();
      return { sessions };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get sessions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取指定会话的历史消息
  @Get('sessions/:sessionId/messages')
  async getSessionMessages(@Param('sessionId') sessionId: string) {
    try {
      return await this.chatService.getSessionMessages(sessionId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get session messages',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 删除指定会话
  @Post('sessions/:sessionId/delete')
  async deleteSession(@Param('sessionId') sessionId: string) {
    try {
      return await this.chatService.deleteSession(sessionId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 上传文档的接口
  @Post('documents')
  async uploadDocument(@Body() data: { content: string; metadata?: any }) {
    try {
      const document = new Document({
        pageContent: data.content,
        metadata: data.metadata || {},
      });
      await this.chatService.addDocuments([document]);
      return { message: 'Document added successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to process document',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 搜索文档的接口
  @Get('documents/search')
  async searchDocuments(
    @Query('query') query: string,
    @Query('limit') limit?: number,
  ) {
    try {
      return await this.chatService.searchSimilarDocuments(query, limit);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to search documents',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
