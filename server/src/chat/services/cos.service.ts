import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as COS from 'cos-nodejs-sdk-v5';
import { cosConfig } from '../../configs/cos.config';

@Injectable()
export class CosService {
  private readonly logger = new Logger(CosService.name);
  private cos: any; // 使用 any 类型避免 TypeScript 错误

  constructor(private configService: ConfigService) {
    // 从环境变量中直接获取配置，避免使用 cosConfig
    const SecretId = this.configService.get<string>('COS_SECRET_ID');
    const SecretKey = this.configService.get<string>('COS_SECRET_KEY');

    this.cos = new COS({
      SecretId,
      SecretKey,
    });

    this.logger.log('COS Service initialized');
    // 记录配置信息，但不包含敏感信息
    this.logger.log(
      `COS Region: ${this.configService.get<string>('COS_REGION')}`,
    );
    this.logger.log(
      `COS Bucket: ${this.configService.get<string>('COS_BUCKET')}`,
    );
  }

  /**
   * 获取临时上传凭证
   * @param filename 文件名
   * @param fileType 文件类型
   * @returns 临时上传凭证
   */
  async getUploadCredentials(filename: string, fileType: string) {
    try {
      // 从环境变量中直接获取配置
      const Bucket = this.configService.get<string>('COS_BUCKET');
      const Region = this.configService.get<string>('COS_REGION');

      if (!Bucket || !Region) {
        throw new Error('COS_BUCKET or COS_REGION not configured');
      }

      // 生成唯一的文件路径，可以按照日期或用户ID等组织
      const key = `images/${Date.now()}-${filename}`;

      // 获取预签名URL
      const url = await this.getPresignedUrl('PUT', key, Bucket, Region);

      // 返回上传所需的信息
      return {
        url,
        key,
        cosHost: `${Bucket}.cos.${Region}.myqcloud.com`,
        fileUrl: `https://${Bucket}.cos.${Region}.myqcloud.com/${key}`,
      };
    } catch (error) {
      this.logger.error('Failed to get upload credentials:', error);
      throw error;
    }
  }

  /**
   * 获取预签名URL
   * @param method HTTP方法
   * @param key 对象键
   * @param bucket 存储桶名称
   * @param region 地域
   * @returns 预签名URL
   */
  private getPresignedUrl(
    method: string,
    key: string,
    bucket: string,
    region: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.cos.getObjectUrl(
        {
          Bucket: bucket,
          Region: region,
          Key: key,
          Method: method,
          Sign: true,
          Expires: 1800, // 30分钟有效期
        },
        (err: any, data: any) => {
          if (err) {
            this.logger.error('Failed to get presigned URL:', err);
            reject(err);
            return;
          }
          resolve(data.Url);
        },
      );
    });
  }
}
