import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { Session } from './entities/session.entity';
import { Message } from './entities/message.entity';
import { SessionService } from './services/session.service';
import { MessageService } from './services/message.service';
import { DocumentService } from './services/document.service';
import { AIChatService } from './services/ai-chat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Session, Message])],
  controllers: [ChatController],
  providers: [SessionService, MessageService, DocumentService, AIChatService],
})
export class ChatModule {}
