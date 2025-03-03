import { Module } from '@nestjs/common';
import { ReaderController } from './reader.controller';
import { ReaderService } from './reader.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(process.cwd(), 'reader-uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = path.extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // 只允许上传PDF文件
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('只允许上传PDF文件'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [ReaderController],
  providers: [ReaderService],
  exports: [ReaderService],
})
export class ReaderModule {}
