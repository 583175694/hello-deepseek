import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionFile } from '../entities/session-file.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'buffer';

@Injectable()
export class SessionFileService {
  private readonly logger = new Logger(SessionFileService.name);
  private readonly uploadDir = path.join(process.cwd(), 'session-uploads');

  constructor(
    @InjectRepository(SessionFile)
    private sessionFileRepository: Repository<SessionFile>,
  ) {
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // 添加文件名处理方法
  private sanitizeFileName(fileName: string): string {
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    return `${nameWithoutExt}_${Date.now()}${ext}`;
  }

  async uploadFile(
    file: Express.Multer.File,
    sessionId: string,
  ): Promise<SessionFile> {
    try {
      // 确保文件名是 UTF-8 编码
      const originalName = Buffer.from(file.originalname, 'binary').toString(
        'utf8',
      );

      // 处理文件名
      const sanitizedFileName = this.sanitizeFileName(originalName);
      const filePath = path.join(this.uploadDir, sanitizedFileName);

      // 保存文件
      this.logger.log(`Saving file ${sanitizedFileName} to ${filePath}`);
      fs.writeFileSync(filePath, file.buffer);

      // 创建文件记录
      const sessionFile = this.sessionFileRepository.create({
        filename: sanitizedFileName,
        originalFilename: originalName,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        sessionId,
      });

      // 保存到数据库
      await this.sessionFileRepository.save(sessionFile);

      return sessionFile;
    } catch (error) {
      this.logger.error(`Error uploading file ${file.originalname}:`, error);
      throw error;
    }
  }

  async getSessionFiles(sessionId: string): Promise<SessionFile[]> {
    return this.sessionFileRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteFile(id: number, sessionId: string): Promise<void> {
    const file = await this.sessionFileRepository.findOne({
      where: { id, sessionId },
    });

    if (!file) {
      throw new Error('File not found');
    }

    // 删除物理文件
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // 删除数据库记录
    await this.sessionFileRepository.remove(file);
  }
}
