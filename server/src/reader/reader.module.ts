import { Module } from '@nestjs/common';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { PDFFile } from './entities/pdf-file.entity';
import { PDFFileService } from './services/pdf-file.service';
import { FileStorageService } from './services/file-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([PDFFile]), MulterModule.register({})],
  controllers: [ReaderController],
  providers: [ReaderService, PDFFileService, FileStorageService],
  exports: [ReaderService, PDFFileService, FileStorageService],
})
export class ReaderModule {}
