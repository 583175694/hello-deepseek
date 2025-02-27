import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ChatController } from './chat.controller';
import { Session } from './entities/session.entity';
import { Message } from './entities/message.entity';
import { SessionFile } from './entities/session-file.entity';
import { SessionDocument } from './entities/session-document.entity';
import { SessionTempFile } from './entities/session-temp-file.entity';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './services/ai-chat.service';
import { FileService } from './services/file.service';
import { SessionFileService } from './services/session-file.service';
import { TempDocumentService } from './services/temp-document.service';
import { ClientIdInterceptor } from './interceptors/client-id.interceptor';
import { FileLoaderService } from './services/file-loader.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
      Message,
      SessionFile,
      SessionDocument,
      SessionTempFile,
    ]),
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
    FileLoaderService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientIdInterceptor,
    },
  ],
  exports: [AIChatService],
})
export class ChatModule {}
