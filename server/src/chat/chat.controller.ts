import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Sse,
  MessageEvent,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Observable } from 'rxjs';

interface ChatRequest {
  message: string;
  history?: { role: string; content: string }[];
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequest) {
    try {
      if (!body.message) {
        throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
      }

      const content = await this.chatService.chat(body.message, body.history);
      return { content };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Sse('stream')
  async streamChat(
    @Query('message') message: string,
    @Query('history') historyStr?: string,
  ): Promise<Observable<MessageEvent>> {
    if (!message) {
      throw new HttpException('Message is required', HttpStatus.BAD_REQUEST);
    }

    let history: { role: string; content: string }[] = [];
    if (historyStr) {
      try {
        history = JSON.parse(historyStr);
      } catch (e) {
        throw new HttpException(
          'Invalid history format',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return new Observable<MessageEvent>((subscriber) => {
      this.chatService
        .streamChat(message, history, (token: string) => {
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
}
