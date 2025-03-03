import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly uploadDir = path.join(process.cwd(), 'reader-uploads');

  constructor() {
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // 获取文件路径
  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  // 删除文件
  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = this.getFilePath(filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`成功删除文件: ${filename}`);
      } else {
        this.logger.warn(`文件不存在，无法删除: ${filename}`);
      }
    } catch (error) {
      this.logger.error(`删除文件失败:`, error);
      throw error;
    }
  }
}
