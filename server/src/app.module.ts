import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { PPTModule } from './ppt/ppt.module';
import { Session } from './chat/entities/session.entity';
import { Message } from './chat/entities/message.entity';
import { SessionFile } from './chat/entities/session-file.entity';
import { SessionDocument } from './chat/entities/session-document.entity';
import { SessionTempFile } from './chat/entities/session-temp-file.entity';
import { PPTOperation } from './ppt/entities/ppt-operation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'chat',
      entities: [
        Session,
        Message,
        SessionFile,
        SessionDocument,
        SessionTempFile,
        PPTOperation,
      ],
      synchronize: true, // 仅在开发环境使用
    }),
    ChatModule,
    PPTModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
