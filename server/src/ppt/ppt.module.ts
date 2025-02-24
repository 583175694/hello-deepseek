import { Module } from '@nestjs/common';
import { PPTController } from './ppt.controller';
import { PPTService } from './ppt.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [PPTController],
  providers: [PPTService],
})
export class PPTModule {}
