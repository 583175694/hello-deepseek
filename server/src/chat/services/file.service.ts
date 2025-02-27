import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentService } from './document.service';
import { FileLoaderService } from './file-loader.service';
import { Buffer } from 'buffer';

export interface FileInfo {
  filename: string;
  path: string;
  size: number;
  createdAt: Date;
  type: string;
}

/**
 * 文件服务类
 * 用于处理文件的上传、存储、列表和删除等操作
 */
@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadBaseDir = path.join(process.cwd(), 'uploads');
  private init = false;

  constructor(
    private documentService: DocumentService,
    private fileLoaderService: FileLoaderService,
  ) {
    // 确保上传基础目录存在
    if (!fs.existsSync(this.uploadBaseDir)) {
      fs.mkdirSync(this.uploadBaseDir, { recursive: true });
    }

    // 初始化时处理已有文件
    if (this.init) {
      this.processExistingFiles();
    }
  }

  /**
   * 获取客户端的上传目录路径
   * @param clientId 客户端ID
   * @returns 客户端专属的上传目录路径
   */
  private getClientUploadDir(clientId: string): string {
    const clientDir = path.join(this.uploadBaseDir, clientId);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    return clientDir;
  }

  /**
   * 处理已存在的文件
   * 在服务启动时扫描并处理所有客户端目录中的文件
   */
  private async processExistingFiles() {
    try {
      const clientDirs = fs.readdirSync(this.uploadBaseDir);
      for (const clientId of clientDirs) {
        const clientDir = path.join(this.uploadBaseDir, clientId);
        if (!fs.statSync(clientDir).isDirectory()) continue;

        const files = fs.readdirSync(clientDir);
        for (const filename of files) {
          const filePath = path.join(clientDir, filename);
          const stats = fs.statSync(filePath);

          if (stats.isFile()) {
            this.logger.log(
              `正在处理客户端 ${clientId} 的现有文件: ${filename}`,
            );

            try {
              // 使用 FileLoaderService 处理文件
              const mimeType = filename.toLowerCase().endsWith('.pdf')
                ? 'application/pdf'
                : 'text/plain';

              const { docs: processedDocs } =
                await this.fileLoaderService.loadAndProcessFile(
                  filePath,
                  mimeType,
                  {
                    filename: filename,
                    originalFilename: filename,
                    uploadedAt: stats.birthtime.toISOString(),
                    mimeType,
                    clientId,
                  },
                );

              // 将文档添加到向量存储
              await this.documentService.addDocuments(clientId, processedDocs);
              this.logger.log(
                `成功将客户端 ${clientId} 的现有文件 ${filename} 处理为 ${processedDocs.length} 个块`,
              );
            } catch (error) {
              this.logger.error(
                `Error processing existing file ${filename} for client ${clientId}:`,
                error,
              );
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error processing existing files:', error);
    }
  }

  /**
   * 处理文件名，确保文件名的唯一性和安全性
   * @param fileName 原始文件名
   * @returns 处理后的安全文件名
   */
  private sanitizeFileName(fileName: string): string {
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    return `${nameWithoutExt}_${Date.now()}${ext}`;
  }

  /**
   * 上传并处理文件
   * @param file 上传的文件对象
   * @param clientId 客户端ID
   * @param chunkSize 文档分块大小，默认为1000
   */
  async uploadAndProcessFile(
    file: Express.Multer.File,
    clientId: string,
    chunkSize: number = 1000,
  ): Promise<void> {
    let finalFilePath: string;
    let finalFileName: string;

    try {
      // 确保文件名是 UTF-8 编码
      const originalName = Buffer.from(file.originalname, 'binary').toString(
        'utf8',
      );

      // 处理文件名
      const sanitizedFileName = this.sanitizeFileName(originalName);
      const uploadDir = this.getClientUploadDir(clientId);
      const filePath = path.join(uploadDir, sanitizedFileName);

      // 检查文件是否已存在，如果存在则添加时间戳
      finalFileName = sanitizedFileName;
      finalFilePath = filePath;
      if (fs.existsSync(filePath)) {
        const baseName = path.basename(
          sanitizedFileName,
          path.extname(sanitizedFileName),
        );
        const ext = path.extname(sanitizedFileName);
        finalFileName = `${baseName}_${Date.now()}${ext}`;
        finalFilePath = path.join(uploadDir, finalFileName);
      }

      // 保存文件
      this.logger.log(
        `正在为客户端 ${clientId} 保存文件 ${finalFileName} 到 ${finalFilePath}`,
      );
      fs.writeFileSync(finalFilePath, file.buffer);

      // 使用 FileLoaderService 处理文件
      const { docs: processedDocs } =
        await this.fileLoaderService.loadAndProcessFile(
          finalFilePath,
          file.mimetype,
          {
            filename: finalFileName,
            originalFilename: originalName,
            uploadedAt: new Date().toISOString(),
            mimeType: file.mimetype,
            clientId,
          },
          chunkSize,
        );

      // 将文档添加到向量存储
      this.logger.log(
        `正在为 ${finalFileName} 添加 ${processedDocs.length} 个块到向量存储`,
      );
      await this.documentService.addDocuments(clientId, processedDocs);

      this.logger.log(
        `成功将客户端 ${clientId} 的文件 ${finalFileName}（原始名: ${originalName}）处理为 ${processedDocs.length} 个块`,
      );
    } catch (error) {
      this.logger.error(`Error processing file ${file.originalname}:`, error);
      // 如果文件已经保存但处理失败，删除文件
      if (finalFilePath && fs.existsSync(finalFilePath)) {
        try {
          fs.unlinkSync(finalFilePath);
          this.logger.log(`已清理失败上传的文件: ${finalFilePath}`);
        } catch (cleanupError) {
          this.logger.error(
            `Failed to clean up file ${finalFilePath}:`,
            cleanupError,
          );
        }
      }
      throw error;
    }
  }

  /**
   * 列出指定客户端的所有文件
   * @param clientId 客户端ID
   * @returns 文件信息数组
   */
  async listFiles(clientId: string): Promise<FileInfo[]> {
    try {
      const uploadDir = this.getClientUploadDir(clientId);
      const files = fs.readdirSync(uploadDir);
      return files.map((filename) => {
        const filePath = path.join(uploadDir, filename);
        const stats = fs.statSync(filePath);
        return {
          filename,
          path: filePath,
          size: stats.size,
          createdAt: stats.birthtime,
          type: path.extname(filename).slice(1),
        };
      });
    } catch (error) {
      this.logger.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * 删除指定客户端的文件
   * @param filename 文件名
   * @param clientId 客户端ID
   */
  async deleteFile(filename: string, clientId: string): Promise<void> {
    try {
      const uploadDir = this.getClientUploadDir(clientId);
      const filePath = path.join(uploadDir, filename);
      if (!fs.existsSync(filePath)) {
        throw new Error('File not found');
      }

      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        // 如果是目录，使用 rmSync 递归删除
        fs.rmSync(filePath, { recursive: true, force: true });
        this.logger.log(`成功删除客户端 ${clientId} 的目录 ${filename}`);
      } else {
        // 如果是文件，使用 unlinkSync 删除
        fs.unlinkSync(filePath);
        this.logger.log(`成功删除客户端 ${clientId} 的文件 ${filename}`);
      }
    } catch (error) {
      this.logger.error(`Error deleting file ${filename}:`, error);
      throw error;
    }
  }
}
