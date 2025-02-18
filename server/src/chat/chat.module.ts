import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatController } from './chat.controller';
import { Session } from './entities/session.entity';
import { Message } from './entities/message.entity';
import { SessionFile } from './entities/session-file.entity';
import { SessionDocument } from './entities/session-document.entity';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './services/ai-chat.service';
import { FileService } from './services/file.service';
import { SessionFileService } from './services/session-file.service';
import { TempDocumentService } from './services/temp-document.service';
import { ClientIdInterceptor } from './interceptors/client-id.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, Message, SessionFile, SessionDocument]),
  ],
  controllers: [ChatController],
  providers: [
    SessionService,
    MessageService,
    DocumentService,
    AIChatService,
    FileService,
    SessionFileService,
    TempDocumentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientIdInterceptor,
    },
  ],
})
export class ChatModule {}
