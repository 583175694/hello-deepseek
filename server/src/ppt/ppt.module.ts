import { Module } from '@nestjs/common';
import { PPTController } from './ppt.controller';
import { PPTService } from './ppt.service';
import { ChatModule } from '../chat/chat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ChatModule, ConfigModule],
  controllers: [PPTController],
  providers: [PPTService],
  exports: [PPTService],
})
export class PPTModule {}
