import { Injectable, Logger } from '@nestjs/common';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Document } from '@langchain/core/documents';
import * as XLSX from 'xlsx';

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
            return XLSX.utils.sheet_to_csv(sheet);
          }).join('\n\n');
          docs = [new Document({ pageContent: excelContent })];
          break;

        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        case 'application/vnd.ms-powerpoint':
          this.logger.log(`正在使用PowerPoint加载器处理文件: ${filePath}`);
          const pptLoader = new TextLoader(filePath);
          docs = await pptLoader.load();
          break;

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
        chunkOverlap: 200,
        separators: ['\n\n', '\n', ' ', '', '。', '？', '！', '；', '：', '，'],
      });

      const splitDocs = await splitter.splitDocuments(docs);

      // 为每个文档片段添加元数据
      this.logger.log(`正在处理 ${splitDocs.length} 个块`);
      const processedDocs = splitDocs.map((doc) => {
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
