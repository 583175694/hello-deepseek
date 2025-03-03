import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Headers,
  Sse,
  Query,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Observable } from 'rxjs';
import { ReaderService } from './reader.service';
import * as path from 'path';

@Controller('reader')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

  // 上传PDF文件
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPDF(
    @Headers('x-client-id') clientId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('未提供文件', HttpStatus.BAD_REQUEST);
    }

    if (file.mimetype !== 'application/pdf') {
      throw new HttpException('只接受PDF文件', HttpStatus.BAD_REQUEST);
    }

    return {
      success: true,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
    };
  }

  // 生成PDF摘要的流式接口
  @Sse('summary')
  async streamSummary(
    @Headers('x-client-id') clientId: string,
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | Object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    const filePath = path.join(process.cwd(), 'reader-uploads', filename);

    return new Observable<{ data: string | Object }>((subscriber) => {
      this.readerService
        .streamSummary(
          filePath,
          (response) => subscriber.next({ data: response }),
          modelId,
        )
        .then(() => {
          subscriber.next({ data: '[DONE]' });
          subscriber.complete();
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  // 删除上传的PDF文件
  @Delete('file/:filename')
  async deleteFile(
    @Headers('x-client-id') clientId: string,
    @Param('filename') filename: string,
  ) {
    await this.readerService.deleteFile(filename);
    return { success: true };
  }
}
