import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPTController } from './ppt.controller';
import { PPTService } from './ppt.service';
import { PPTOperation } from './entities/ppt-operation.entity';
import { PPTOperationService } from './services/ppt-operation.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([PPTOperation]), ChatModule],
  controllers: [PPTController],
  providers: [PPTService, PPTOperationService],
})
export class PPTModule {}
