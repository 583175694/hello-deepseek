import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PPTOperation,
  PPTOperationType,
} from '../entities/ppt-operation.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PPTOperationService {
  constructor(
    @InjectRepository(PPTOperation)
    private readonly pptOperationRepository: Repository<PPTOperation>,
  ) {}

  async createOperation(
    clientId: string,
    type: PPTOperationType,
    data?: {
      title?: string;
      outline?: string;
      content?: string;
      authCode?: string;
      pptId?: string;
    },
  ): Promise<PPTOperation> {
    const pptId = data?.pptId || uuidv4();

    const operation = this.pptOperationRepository.create({
      clientId,
      type,
      pptId,
      ...(data || {}),
    });
    return await this.pptOperationRepository.save(operation);
  }

  async updateOperation(
    id: number,
    data: Partial<PPTOperation>,
  ): Promise<PPTOperation> {
    await this.pptOperationRepository.update(id, {
      ...data,
      isCompleted: true,
    });
    return await this.pptOperationRepository.findOne({ where: { id } });
  }

  async getOperationById(id: number): Promise<PPTOperation> {
    return await this.pptOperationRepository.findOne({ where: { id } });
  }

  async getOperationsByPptId(pptId: string): Promise<PPTOperation[]> {
    return await this.pptOperationRepository.find({
      where: { pptId },
      order: { createdAt: 'ASC' },
    });
  }

  async getOperationsByClientId(clientId: string): Promise<PPTOperation[]> {
    return await this.pptOperationRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async getLatestOperationByClientIdAndType(
    clientId: string,
    type: PPTOperationType,
  ): Promise<PPTOperation> {
    const operations = await this.pptOperationRepository.find({
      where: { clientId, type },
      order: { createdAt: 'DESC' },
      take: 1,
    });
    return operations.length > 0 ? operations[0] : null;
  }

  async markOperationAsError(id: number, error: string): Promise<PPTOperation> {
    await this.pptOperationRepository.update(id, {
      error,
      isCompleted: true,
    });
    return await this.pptOperationRepository.findOne({ where: { id } });
  }
}
