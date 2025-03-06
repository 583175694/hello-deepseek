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
  Headers,
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Headers('x-client-id') clientId: string,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    const allowedExtensions = [
      '.pdf',
      '.doc',
      '.docx',
      '.txt',
      '.md',
      '.csv',
      '.xlsx',
      '.xls',
    ];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExt)) {
      throw new HttpException(
        'Only PDF, DOC, DOCX, TXT, MD, CSV, XLSX and XLS files are allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const result = await this.readerService.uploadFile(file, clientId);
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
    @Headers('x-client-id') clientId: string,
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    return new Observable<{ data: string | object }>((subscriber) => {
      this.readerService
        .streamSummary(
          filename,
          (response) => subscriber.next({ data: response }),
          modelId,
          clientId,
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
    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.readerService.deleteFile(filename, clientId);
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
  async getUploadedFiles(@Headers('x-client-id') clientId: string) {
    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const files = await this.readerService.getUploadedFiles(clientId);
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
  async getFile(
    @Headers('x-client-id') clientId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const file = await this.readerService.getFile(filename, clientId);
      const fileExt = path.extname(filename).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.txt': 'text/plain',
        '.md': 'text/markdown',
        '.csv': 'text/csv',
        '.xlsx':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xls': 'application/vnd.ms-excel',
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
    @Headers('x-client-id') clientId: string,
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    return new Observable<{ data: string | object }>((subscriber) => {
      this.readerService
        .streamDeepReading(
          filename,
          (response) => subscriber.next({ data: response }),
          modelId,
          clientId,
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
    @Headers('x-client-id') clientId: string,
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    if (!clientId) {
      throw new HttpException('clientId is required', HttpStatus.BAD_REQUEST);
    }

    return new Observable<{ data: string | object }>((subscriber) => {
      this.readerService
        .streamMindMap(
          filename,
          (response) => subscriber.next({ data: response }),
          modelId,
          clientId,
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
