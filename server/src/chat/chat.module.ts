import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatController } from './chat.controller';
import { Message } from './entities/message.entity';
import { Session } from './entities/session.entity';
import { SessionTempFile } from './entities/session-temp-file.entity';
import { AIChatService } from './services/ai-chat.service';
import { SessionService } from './services/session.service';
import { TempDocumentService } from './services/temp-document.service';
import { ClientIdInterceptor } from './interceptors/client-id.interceptor';
import { MessageService } from './services/message.service';
import { DocumentService } from './services/document.service';
import { FileService } from './services/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Session, SessionTempFile])],
  controllers: [ChatController],
  providers: [
    AIChatService,
    SessionService,
    TempDocumentService,
    MessageService,
    DocumentService,
    FileService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientIdInterceptor,
    },
  ],
  exports: [AIChatService],
})
export class ChatModule {}
