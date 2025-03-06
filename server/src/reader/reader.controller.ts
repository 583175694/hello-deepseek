import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Sse,
  Query,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { Observable } from 'rxjs';
import { ReaderService } from './reader.service';
import * as path from 'path';

@Controller('reader')
export class ReaderController {
  constructor(private readonly readerService: ReaderService) {}

  // 上传PDF文件
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      throw new HttpException(
        'Only PDF, DOC and DOCX files are allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.readerService.uploadFile(file);
      return result;
    } catch (error) {
      throw new HttpException(
        'Error uploading file: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 生成PDF摘要的流式接口
  @Sse('summary')
  async streamSummary(
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    return new Observable<{ data: string | object }>((subscriber) => {
      this.readerService
        .streamSummary(
          filename,
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
  async deleteFile(@Param('filename') filename: string) {
    try {
      await this.readerService.deleteFile(filename);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Error deleting file: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取上传的PDF文件列表
  @Get('files')
  async getUploadedFiles() {
    try {
      const files = await this.readerService.getUploadedFiles();
      return { files };
    } catch (error) {
      throw new HttpException(
        'Error getting files: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 获取PDF文件内容
  @Get('file/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const file = await this.readerService.getFile(filename);
      const fileExt = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      };

      res.setHeader(
        'Content-Type',
        mimeTypes[fileExt] || 'application/octet-stream',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${encodeURIComponent(filename)}"`,
      );
      res.send(file);
    } catch (error) {
      throw new HttpException(
        'Error getting file: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 生成PDF精读的流式接口
  @Sse('deep-reading')
  async streamDeepReading(
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | Object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    return new Observable<{ data: string | Object }>((subscriber) => {
      this.readerService
        .streamDeepReading(
          filename,
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

  // 生成PDF脑图的流式接口
  @Sse('mind-map')
  async streamMindMap(
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | Object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    return new Observable<{ data: string | Object }>((subscriber) => {
      this.readerService
        .streamMindMap(
          filename,
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
}
