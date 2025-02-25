import { Module } from '@nestjs/common';
import { AipptController } from './aippt.controller';
import { AipptService } from './aippt.service';

@Module({
  controllers: [AipptController],
  providers: [AipptService],
})
export class AipptModule {}
