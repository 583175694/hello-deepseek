import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

export interface ProcessedDocument {
  docs: Document[];
  totalChunks: number;
}

@Injectable()
export class FileLoaderService {
  private readonly logger = new Logger(FileLoaderService.name);
  /**
   * 根据文件类型和路径加载文档
   * @param filePath 文件路径
   * @param mimeType 文件MIME类型
   * @param metadata 额外的元数据
   */
  async loadAndProcessFile(
    filePath: string,
    mimeType: string,
    metadata: Record<string, any>,
    chunkSize: number = 1000,
  ): Promise<ProcessedDocument> {
    try {
      let docs: Document[] = [];

      // 根据文件类型选择合适的加载器
      switch (mimeType) {
        case 'application/pdf':
          this.logger.log(`正在使用PDF加载器处理文件: ${filePath}`);
          const pdfLoader = new PDFLoader(filePath);
          docs = await pdfLoader.load();
          break;

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
          this.logger.log(`正在使用Word加载器处理文件: ${filePath}`);
          const docxLoader = new DocxLoader(filePath);
          docs = await docxLoader.load();
          break;

        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'application/vnd.ms-excel':
          this.logger.log(`正在使用Excel加载器处理文件: ${filePath}`);
          const workbook = XLSX.readFile(filePath);
          const excelContent = workbook.SheetNames.map((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            return `Sheet: ${sheetName}\n${XLSX.utils.sheet_to_csv(sheet)}`;
          }).join('\n\n');
          docs = [new Document({ pageContent: excelContent })];
          break;

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.ms-powerpoint':
          throw new HttpException(
            '暂不支持PPT文件格式',
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          );

        case 'text/markdown':
          this.logger.log(`正在使用Markdown加载器处理文件: ${filePath}`);
          const markdownLoader = new TextLoader(filePath);
          docs = await markdownLoader.load();
          break;

        default:
          this.logger.log(`正在使用文本加载器处理文件: ${filePath}`);
          const textLoader = new TextLoader(filePath);
          docs = await textLoader.load();
      }

      // 文本分割
      this.logger.log(`正在将文档分割成块`);
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap: Math.min(200, chunkSize * 0.1), // 重叠部分设为块大小的10%，但不超过200
        separators: ['\n\n', '\n', ' ', '', '。', '？', '！', '；', '：', '，'],
      });

      const splitDocs = await splitter.splitDocuments(docs);

      // 如果分块太多，增加块大小重新分割
      if (splitDocs.length > 1000) {
        this.logger.log(`文档块数过多 (${splitDocs.length})，正在重新分割...`);
        const newChunkSize = Math.ceil(chunkSize * (splitDocs.length / 1000));
        const newSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: newChunkSize,
          chunkOverlap: Math.min(200, newChunkSize * 0.1),
          separators: [
            '\n\n',
            '\n',
            ' ',
            '',
            '。',
            '？',
            '！',
            '；',
            '：',
            '，',
          ],
        });
        const newSplitDocs = await newSplitter.splitDocuments(docs);
        this.logger.log(`重新分割后的块数: ${newSplitDocs.length}`);
        docs = newSplitDocs;
      } else {
        docs = splitDocs;
      }

      // 为每个文档片段添加元数据
      this.logger.log(`正在处理 ${docs.length} 个块`);
      const processedDocs = docs.map((doc) => {
        return new Document({
          pageContent: doc.pageContent,
          metadata: {
            ...doc.metadata,
            ...metadata,
          },
        });
      });

      return {
        docs: processedDocs,
        totalChunks: processedDocs.length,
      };
    } catch (error) {
      this.logger.error(`处理文件失败 ${filePath}:`, error);
      throw error;
    }
  }
}
