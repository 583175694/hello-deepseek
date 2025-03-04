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
  Get,
  Inject,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Observable } from 'rxjs';
import { ReaderService } from './reader.service';
import { PDFFileService } from './services/pdf-file.service';
import { FileStorageService } from './services/file-storage.service';
import * as path from 'path';

@Controller('reader')
export class ReaderController {
  constructor(
    private readonly readerService: ReaderService,
    private readonly pdfFileService: PDFFileService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  // 上传PDF文件
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      // 这里直接使用FileStorageService的配置
      storage: undefined, // 将在下面的方法中手动处理
      fileFilter: (req, file, cb) => {
        // 只允许上传PDF文件
        if (file.mimetype !== 'application/pdf') {
          return cb(new Error('只允许上传PDF文件'), false);
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 限制文件大小为10MB
      },
    }),
  )
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

    // 手动处理文件存储
    const originalName = Buffer.from(file.originalname, 'binary').toString(
      'utf8',
    );
    const filename = `${Date.now()}-${originalName}`;
    const filePath = this.fileStorageService.getFilePath(filename);

    // 创建文件流并保存
    const fs = require('fs');
    fs.writeFileSync(filePath, file.buffer);

    // 更新文件信息
    file.filename = filename;
    file.path = filePath;

    // 保存文件记录到数据库
    await this.pdfFileService.savePDFFile(
      file.filename,
      file.originalname,
      file.size,
      clientId,
    );

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

    const filePath = this.fileStorageService.getFilePath(filename);

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
    // 从数据库中删除记录
    await this.pdfFileService.deletePDFFile(filename, clientId);

    // 删除物理文件
    await this.fileStorageService.deleteFile(filename);

    return { success: true };
  }

  // 获取上传的PDF文件列表
  @Get('files')
  async getUploadedFiles(@Headers('x-client-id') clientId: string) {
    // 从数据库获取文件列表
    const files = await this.pdfFileService.getPDFFiles(clientId);

    return {
      files: files.map((file) => ({
        filename: file.filename,
        size: file.size,
        uploadedAt: file.createdAt,
      })),
    };
  }

  // 获取PDF文件内容
  @Get('file/:filename')
  async getFile(
    @Headers('x-client-id') clientId: string,
    @Param('filename') filename: string,
    @Res() res,
  ) {
    try {
      // 检查文件是否存在于数据库中
      const fileExists = await this.pdfFileService.checkFileExists(
        filename,
        clientId,
      );
      if (!fileExists) {
        throw new HttpException('文件不存在或无权访问', HttpStatus.NOT_FOUND);
      }

      // 获取文件路径
      const filePath = this.fileStorageService.getFilePath(filename);

      // 检查文件是否存在于文件系统中
      const fs = require('fs');
      if (!fs.existsSync(filePath)) {
        throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
      }

      // 设置强缓存响应头
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 缓存一年
      res.setHeader(
        'Expires',
        new Date(Date.now() + 31536000000).toUTCString(),
      );

      // 设置响应头并发送文件
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${encodeURIComponent(filename)}"`,
      );

      // 创建文件流并发送
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('获取文件失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 生成PDF精读的流式接口
  @Sse('deep-reading')
  async streamDeepReading(
    @Headers('x-client-id') clientId: string,
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | Object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    const filePath = this.fileStorageService.getFilePath(filename);

    return new Observable<{ data: string | Object }>((subscriber) => {
      this.readerService
        .streamDeepReading(
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

  // 生成PDF脑图的流式接口
  @Sse('mind-map')
  async streamMindMap(
    @Headers('x-client-id') clientId: string,
    @Query('filename') filename: string,
    @Query('modelId') modelId: string = 'bytedance_deepseek_v3',
  ): Promise<Observable<{ data: string | Object }>> {
    if (!filename) {
      throw new HttpException('文件名是必需的', HttpStatus.BAD_REQUEST);
    }

    const filePath = this.fileStorageService.getFilePath(filename);

    return new Observable<{ data: string | Object }>((subscriber) => {
      this.readerService
        .streamMindMap(
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
}
