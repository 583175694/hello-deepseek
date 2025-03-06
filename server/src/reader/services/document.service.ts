import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';
import * as WordExtractor from 'word-extractor';
import * as fs from 'fs';
import * as path from 'path';

export class DocumentService {
  private readonly uploadDir: string;
  private readonly wordExtractor: any;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
    this.wordExtractor = new WordExtractor();
  }

  async loadDocument(filePath: string): Promise<Document[]> {
    const ext = path.extname(filePath).toLowerCase();

    switch (ext) {
      case '.pdf':
        return this.loadPDF(filePath);
      case '.docx':
        return this.loadDOCX(filePath);
      case '.doc':
        return this.loadDOC(filePath);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  private async loadPDF(filePath: string): Promise<Document[]> {
    const loader = new PDFLoader(filePath);
    return loader.load();
  }

  private async loadDOCX(filePath: string): Promise<Document[]> {
    const loader = new DocxLoader(filePath);
    return loader.load();
  }

  private async loadDOC(filePath: string): Promise<Document[]> {
    // 使用 word-extractor 处理 .doc 文件
    const buffer = await fs.promises.readFile(filePath);
    const extracted = await this.wordExtractor.extract(buffer);
    const text = extracted.getBody();

    // 创建一个 Document 对象
    return [
      new Document({
        pageContent: text,
        metadata: {
          source: filePath,
          format: 'doc',
        },
      }),
    ];
  }

  getFileType(filename: string): string | null {
    // 忽略以点开头的隐藏文件
    if (filename.startsWith('.')) {
      return null;
    }

    const ext = path.extname(filename).toLowerCase();
    if (!ext) {
      return null;
    }

    switch (ext) {
      case '.pdf':
        return 'pdf';
      case '.docx':
        return 'docx';
      case '.doc':
        return 'doc';
      default:
        return null;
    }
  }

  async getFileContent(filePath: string): Promise<Buffer> {
    return fs.promises.readFile(filePath);
  }
}
