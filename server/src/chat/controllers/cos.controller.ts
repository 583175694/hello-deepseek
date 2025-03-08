import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CosService } from '../services/cos.service';

@Controller('cos')
export class CosController {
  constructor(private readonly cosService: CosService) {}

  @Post('upload-credentials')
  async getUploadCredentials(
    @Headers('x-client-id') clientId: string,
    @Body() body: { filename: string; fileType: string },
  ) {
    if (!clientId) {
      throw new HttpException('Client ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const { filename, fileType } = body;

      if (!filename || !fileType) {
        throw new HttpException(
          'Filename and fileType are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      // 验证文件类型，只允许图片
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
      ];
      if (!allowedTypes.includes(fileType)) {
        throw new HttpException(
          'Only image files are allowed',
          HttpStatus.BAD_REQUEST,
        );
      }

      const credentials = await this.cosService.getUploadCredentials(
        filename,
        fileType,
      );

      return {
        success: true,
        data: credentials,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get upload credentials',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
