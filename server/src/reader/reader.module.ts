import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { DocumentService } from './services/document.service';
import { PDFFileService } from './services/pdf-file.service';
import { PDFFile } from './entities/pdf-file.entity';

@Module({
  imports: [
    MulterModule.register({}),
    ConfigModule,
    TypeOrmModule.forFeature([PDFFile]),
  ],
  controllers: [ReaderController],
  providers: [ReaderService, DocumentService, PDFFileService],
  exports: [ReaderService],
})
export class ReaderModule {}
