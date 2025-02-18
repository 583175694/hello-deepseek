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
  private readonly uploadBaseDir = path.join(process.cwd(), 'session-uploads');

  constructor(
    @InjectRepository(SessionFile)
    private sessionFileRepository: Repository<SessionFile>,
  ) {
    // 确保上传基础目录存在
    if (!fs.existsSync(this.uploadBaseDir)) {
      fs.mkdirSync(this.uploadBaseDir, { recursive: true });
    }
  }

  private getClientUploadDir(clientId: string): string {
    const clientDir = path.join(this.uploadBaseDir, clientId);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    return clientDir;
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
    clientId: string,
  ): Promise<SessionFile> {
    try {
      // 确保文件名是 UTF-8 编码
      const originalName = Buffer.from(file.originalname, 'binary').toString(
        'utf8',
      );

      // 处理文件名
      const sanitizedFileName = this.sanitizeFileName(originalName);
      const uploadDir = this.getClientUploadDir(clientId);
      const filePath = path.join(uploadDir, sanitizedFileName);

      // 保存文件
      this.logger.log(
        `Saving file ${sanitizedFileName} to ${filePath} for client: ${clientId}`,
      );
      fs.writeFileSync(filePath, file.buffer);

      // 创建文件记录
      const sessionFile = this.sessionFileRepository.create({
        filename: sanitizedFileName,
        originalFilename: originalName,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        sessionId,
        clientId,
      });

      // 保存到数据库
      await this.sessionFileRepository.save(sessionFile);

      return sessionFile;
    } catch (error) {
      this.logger.error(`Error uploading file ${file.originalname}:`, error);
      throw error;
    }
  }

  async getSessionFiles(
    sessionId: string,
    clientId: string,
  ): Promise<SessionFile[]> {
    return this.sessionFileRepository.find({
      where: { sessionId, clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteFile(
    id: number,
    sessionId: string,
    clientId: string,
  ): Promise<void> {
    const file = await this.sessionFileRepository.findOne({
      where: { id, sessionId, clientId },
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
