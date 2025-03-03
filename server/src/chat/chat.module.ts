import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatController } from './chat.controller';
import { Session } from './entities/session.entity';
import { Message } from './entities/message.entity';
import { SessionTempFile } from './entities/session-temp-file.entity';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './chat.service';
import { FileService } from './services/file.service';
import { TempDocumentService } from './services/temp-document.service';
import { ClientIdInterceptor } from './interceptors/client-id.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Message, SessionTempFile])],
  controllers: [ChatController],
  providers: [
    SessionService,
    MessageService,
    DocumentService,
    AIChatService,
    FileService,
    TempDocumentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientIdInterceptor,
    },
  ],
  exports: [AIChatService],
})
export class ChatModule {}
