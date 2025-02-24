import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class AipptService {
  private readonly logger = new Logger(AipptService.name);
  private readonly baseUrl = 'https://co.aippt.cn';

  constructor(private readonly configService: ConfigService) {}

  private generateSignature(
    method: string,
    uri: string,
    timestamp: number,
  ): string {
    const secretKey = this.configService.get<string>('AIPPT_SECRET_KEY');

    // 按照文档要求构造待签字符串
    const stringToSign = `${method}@${uri}@${timestamp}`;

    // 使用 HMAC-SHA1 算法生成签名
    const hmac = crypto.createHmac('sha1', secretKey);
    return hmac.update(stringToSign).digest('base64');
  }

  async getAuthCode(): Promise<string> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const uri = '/api/grant/code/';
      const signature = this.generateSignature('GET', uri, timestamp);
      const accessKey = this.configService.get<string>('AIPPT_ACCESS_KEY');

      const response = await axios.get(`${this.baseUrl}${uri}`, {
        headers: {
          'x-api-key': accessKey,
          'x-timestamp': timestamp.toString(),
          'x-signature': signature,
        },
        params: {
          uid: '1',
          channel: 'test',
        },
      });

      if (response.data.code === 0) {
        return response.data.data.code;
      } else {
        throw new Error(response.data.msg || 'Failed to get auth code');
      }
    } catch (error) {
      this.logger.error('Failed to get auth code:', error);
      throw error;
    }
  }
}
