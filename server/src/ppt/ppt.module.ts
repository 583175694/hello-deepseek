import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PPTController } from './ppt.controller';
import { PPTService } from './ppt.service';
import { PPTOperation } from './entities/ppt-operation.entity';
import { PPTOperationService } from './services/ppt-operation.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([PPTOperation]), ConfigModule],
  controllers: [PPTController],
  providers: [PPTService, PPTOperationService],
})
export class PPTModule {}
