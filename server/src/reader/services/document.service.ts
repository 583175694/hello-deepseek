import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { Document } from '@langchain/core/documents';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import * as WordExtractor from 'word-extractor';
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

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
      case '.txt':
      case '.md':
        return this.loadText(filePath);
      case '.csv':
        return this.loadCSV(filePath);
      case '.xlsx':
      case '.xls':
        return this.loadExcel(filePath);
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

  private async loadText(filePath: string): Promise<Document[]> {
    const loader = new TextLoader(filePath);
    return loader.load();
  }

  private async loadCSV(filePath: string): Promise<Document[]> {
    const loader = new CSVLoader(filePath);
    return loader.load();
  }

  private async loadExcel(filePath: string): Promise<Document[]> {
    const buffer = await fs.promises.readFile(filePath);
    const workbook = XLSX.read(buffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
      cellText: false,
    });

    return workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(sheet, {
        raw: false,
        defval: '',
        header: 1,
        blankrows: false,
      });

      const headers = (jsonData[0] || []) as string[];
      const dataRows = jsonData.slice(1) as string[][];

      const textContent = dataRows
        .map((row: any[]) => {
          return row
            .map((cell, index) => {
              const header = headers[index] || `Column${index + 1}`;
              const value =
                cell === null || cell === undefined ? '' : String(cell).trim();
              return `${header}: ${value}`;
            })
            .filter((item) => !item.endsWith(': '))
            .join(' | ');
        })
        .filter((line) => line.length > 0)
        .join('\n');

      return new Document({
        pageContent: textContent || '空白表格',
        metadata: {
          source: filePath,
          sheet: sheetName,
          format: path.extname(filePath).slice(1),
          rowCount: dataRows.length,
          columnCount: headers.length,
        },
      });
    });
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
      case '.txt':
        return 'txt';
      case '.md':
        return 'md';
      case '.csv':
        return 'csv';
      case '.xlsx':
      case '.xls':
        return 'excel';
      default:
        return null;
    }
  }

  async getFileContent(filePath: string): Promise<Buffer> {
    return fs.promises.readFile(filePath);
  }
}
