import { Injectable, Logger } from '@nestjs/common';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import * as fs from 'fs';
import * as path from 'path';
import { DocumentService } from './document.service';
import { Buffer } from 'buffer';
import * as XLSX from 'xlsx';

export interface FileInfo {
  filename: string;
  path: string;
  size: number;
  createdAt: Date;
  type: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadBaseDir = path.join(process.cwd(), 'uploads');
  private init = false;

  constructor(private documentService: DocumentService) {
    // 确保上传基础目录存在
    if (!fs.existsSync(this.uploadBaseDir)) {
      fs.mkdirSync(this.uploadBaseDir, { recursive: true });
    }

    // 初始化时处理已有文件
    if (this.init) {
      this.processExistingFiles();
    }
  }

  private getClientUploadDir(clientId: string): string {
    const clientDir = path.join(this.uploadBaseDir, clientId);
    if (!fs.existsSync(clientDir)) {
      fs.mkdirSync(clientDir, { recursive: true });
    }
    return clientDir;
  }

  // 处理已有文件的方法
  private async processExistingFiles(targetClientId?: string) {
    try {
      // 如果指定了clientId，只处理该客户端的文件
      const clientDirs = targetClientId
        ? [targetClientId]
        : fs.readdirSync(this.uploadBaseDir);

      for (const clientId of clientDirs) {
        const clientDir = path.join(this.uploadBaseDir, clientId);
        if (!fs.statSync(clientDir).isDirectory()) continue;

        // 如果是重新处理特定客户端的文件，先清理其向量存储
        if (targetClientId) {
          await this.documentService.clearVectorStore(clientId);
        }

        const files = fs.readdirSync(clientDir);
        for (const filename of files) {
          const filePath = path.join(clientDir, filename);
          const stats = fs.statSync(filePath);

          if (stats.isFile()) {
            this.logger.log(
              `正在处理客户端 ${clientId} 的现有文件: ${filename}`,
            );

            // 根据文件类型选择合适的加载器
            let loader;
            if (filename.toLowerCase().endsWith('.pdf')) {
              loader = new PDFLoader(filePath);
            } else {
              loader = new TextLoader(filePath);
            }

            try {
              // 加载文档
              const docs = await loader.load();

              // 文本分割
              const splitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
              });

              const splitDocs = await splitter.splitDocuments(docs);

              // 为每个文档片段添加元数据
              const processedDocs = splitDocs.map((doc) => {
                return new Document({
                  pageContent: doc.pageContent,
                  metadata: {
                    ...doc.metadata,
                    filename: filename,
                    originalFilename: filename,
                    uploadedAt: stats.birthtime.toISOString(),
                    mimeType: filename.toLowerCase().endsWith('.pdf')
                      ? 'application/pdf'
                      : 'text/plain',
                    clientId,
                  },
                });
              });

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
      if (targetClientId) {
        throw error; // 如果是处理特定客户端的文件，需要抛出错误
      }
    }
  }

  // 添加文件名处理方法
  private sanitizeFileName(fileName: string): string {
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    return `${nameWithoutExt}_${Date.now()}${ext}`;
  }

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

      // 根据文件类型选择合适的加载器
      let loader;
      let docs;

      const fileExt = path.extname(finalFileName).toLowerCase();

      if (file.mimetype === 'application/pdf') {
        this.logger.log(`正在为文件 ${finalFileName} 使用PDF加载器`);
        loader = new PDFLoader(finalFilePath);
        docs = await loader.load();
      } else if (fileExt === '.md' || file.mimetype === 'text/markdown') {
        this.logger.log(`正在为文件 ${finalFileName} 使用Markdown加载器`);
        loader = new TextLoader(finalFilePath);
        docs = await loader.load();
      } else if (
        fileExt === '.xlsx' ||
        fileExt === '.xls' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel'
      ) {
        this.logger.log(`正在为文件 ${finalFileName} 使用Excel加载器`);
        // 直接从buffer读取Excel文件
        const workbook = XLSX.read(file.buffer, {
          type: 'buffer',
          cellDates: true, // 将日期转换为JS日期对象
          cellNF: false, // 不保留数字格式
          cellText: false, // 不保留文本格式
        });
        const sheets = workbook.SheetNames;

        // 将所有sheet的内容合并成文档
        docs = sheets.map((sheetName) => {
          const sheet = workbook.Sheets[sheetName];

          // 将sheet转换为JSON对象数组，并处理格式
          const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, {
            raw: false, // 返回格式化的字符串
            defval: '', // 空单元格的默认值
            header: 1, // 使用数组格式，避免中文列名可能的编码问题
            blankrows: false, // 跳过空行
          });

          // 获取列名（第一行）
          const headers = (jsonData[0] || []) as string[];
          // 获取数据行（剩余行）
          const dataRows = jsonData.slice(1) as string[][];

          // 将数据转换为易读的文本格式
          const textContent = dataRows
            .map((row: any[]) => {
              return row
                .map((cell, index) => {
                  const header = headers[index] || `Column${index + 1}`;
                  // 处理单元格的值，确保是字符串
                  const value =
                    cell === null || cell === undefined
                      ? ''
                      : String(cell).trim();
                  return `${header}: ${value}`;
                })
                .filter((item) => item.endsWith(': ') === false)
                .join(' | ');
            })
            .filter((line) => line.length > 0)
            .join('\n');

          return new Document({
            pageContent: textContent || '空白表格',
            metadata: {
              source: finalFileName,
              sheet: sheetName,
              rowCount: dataRows.length,
              columnCount: headers.length,
            },
          });
        });
      } else if (fileExt === '.csv' || file.mimetype === 'text/csv') {
        this.logger.log(`正在为文件 ${finalFileName} 使用CSV加载器`);
        loader = new CSVLoader(finalFilePath);
        docs = await loader.load();
      } else {
        this.logger.log(`正在为文件 ${finalFileName} 使用文本加载器`);
        loader = new TextLoader(finalFilePath);
        docs = await loader.load();
      }

      // 文本分割
      this.logger.log(`正在将文档 ${finalFileName} 分割成块`);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap: 200,
      });

      const splitDocs = await splitter.splitDocuments(docs);

      // 为每个文档片段添加元数据
      this.logger.log(`正在处理 ${finalFileName} 的 ${splitDocs.length} 个块`);
      const processedDocs = splitDocs.map((doc) => {
        return new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            filename: finalFileName,
            originalFilename: originalName,
            uploadedAt: new Date().toISOString(),
            mimeType: file.mimetype,
            clientId,
          },
        });
      });

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

      // 重新处理该客户端的所有文件以更新向量库
      await this.processExistingFiles(clientId);
    } catch (error) {
      this.logger.error(`Error deleting file ${filename}:`, error);
      throw error;
    }
  }
}
