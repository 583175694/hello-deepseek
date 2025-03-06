import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PDFFile } from '../entities/pdf-file.entity';
import * as path from 'path';

@Injectable()
export class PDFFileService {
  private readonly logger = new Logger(PDFFileService.name);

  constructor(
    @InjectRepository(PDFFile)
    private readonly pdfFileRepository: Repository<PDFFile>,
  ) {}

  // 保存PDF文件记录
  async savePDFFile(
    filename: string,
    size: number,
    clientId: string,
  ): Promise<PDFFile> {
    try {
      const filePath = path.join(process.cwd(), 'reader-uploads', filename);

      const pdfFile = this.pdfFileRepository.create({
        filename,
        size,
        path: filePath,
        clientId,
      });

      return await this.pdfFileRepository.save(pdfFile);
    } catch (error) {
      this.logger.error('保存PDF文件记录失败:', error);
      throw error;
    }
  }

  // 获取客户端的PDF文件列表
  async getPDFFiles(clientId: string): Promise<PDFFile[]> {
    try {
      return await this.pdfFileRepository.find({
        where: { clientId },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('获取PDF文件列表失败:', error);
      throw error;
    }
  }

  // 根据文件名获取PDF文件
  async getPDFFileByFilename(filename: string): Promise<PDFFile | null> {
    try {
      return await this.pdfFileRepository.findOne({
        where: { filename },
      });
    } catch (error) {
      this.logger.error('根据文件名获取PDF文件失败:', error);
      throw error;
    }
  }

  // 删除PDF文件记录
  async deletePDFFile(filename: string, clientId: string): Promise<void> {
    try {
      await this.pdfFileRepository.softDelete({
        filename,
        clientId,
      });
    } catch (error) {
      this.logger.error('删除PDF文件记录失败:', error);
      throw error;
    }
  }

  // 检查文件是否存在且属于指定客户端
  async checkFileExists(filename: string, clientId: string): Promise<boolean> {
    try {
      console.log(filename, clientId);
      const file = await this.pdfFileRepository.findOne({
        where: { filename, clientId },
      });
      return !!file;
    } catch (error) {
      this.logger.error('检查文件存在性失败:', error);
      throw error;
    }
  }

  // 保存文件摘要
  async saveSummary(
    filename: string,
    clientId: string,
    summary: string,
  ): Promise<void> {
    try {
      this.logger.log(`保存文件 ${filename} 的摘要`);
      await this.pdfFileRepository.update({ filename, clientId }, { summary });
    } catch (error) {
      this.logger.error('保存文件摘要失败:', error);
      throw error;
    }
  }

  // 保存文件精读分析
  async saveDeepReading(
    filename: string,
    clientId: string,
    deepReading: string,
  ): Promise<void> {
    try {
      this.logger.log(`保存文件 ${filename} 的精读分析`);
      await this.pdfFileRepository.update(
        { filename, clientId },
        { deepReading },
      );
    } catch (error) {
      this.logger.error('保存文件精读分析失败:', error);
      throw error;
    }
  }

  // 保存文件脑图
  async saveMindMap(
    filename: string,
    clientId: string,
    mindMap: string,
  ): Promise<void> {
    try {
      this.logger.log(`保存文件 ${filename} 的脑图`);
      await this.pdfFileRepository.update({ filename, clientId }, { mindMap });
    } catch (error) {
      this.logger.error('保存文件脑图失败:', error);
      throw error;
    }
  }

  // 获取文件摘要
  async getSummary(filename: string, clientId: string): Promise<string | null> {
    try {
      const file = await this.pdfFileRepository.findOne({
        where: { filename, clientId },
        select: ['summary'],
      });
      return file?.summary || null;
    } catch (error) {
      this.logger.error('获取文件摘要失败:', error);
      throw error;
    }
  }

  // 获取文件精读分析
  async getDeepReading(
    filename: string,
    clientId: string,
  ): Promise<string | null> {
    try {
      const file = await this.pdfFileRepository.findOne({
        where: { filename, clientId },
        select: ['deepReading'],
      });
      return file?.deepReading || null;
    } catch (error) {
      this.logger.error('获取文件精读分析失败:', error);
      throw error;
    }
  }

  // 获取文件脑图
  async getMindMap(filename: string, clientId: string): Promise<string | null> {
    try {
      const file = await this.pdfFileRepository.findOne({
        where: { filename, clientId },
        select: ['mindMap'],
      });
      return file?.mindMap || null;
    } catch (error) {
      this.logger.error('获取文件脑图失败:', error);
      throw error;
    }
  }
}
