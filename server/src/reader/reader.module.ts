import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentService } from './services/document.service';

@Module({
  imports: [MulterModule.register({}), ConfigModule],
  controllers: [ReaderController],
  providers: [ReaderService, DocumentService],
  exports: [ReaderService],
})
export class ReaderModule {}
