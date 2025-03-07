import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';
import { BufferWindowMemory } from 'langchain/memory';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);
  private memory: BufferWindowMemory;

  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    this.memory = new BufferWindowMemory({
      k: 20,
      returnMessages: true,
      memoryKey: 'history',
      inputKey: 'input',
      outputKey: 'output',
    });
  }

  async saveMessage(
    role: string,
    content: string,
    reasoning: string | null,
    sessionId: string,
    clientId: string,
    additionalData?: {
      searchContext?: string;
      sources?: string;
      tempFiles?: string;
    },
  ): Promise<Message> {
    const message = this.messageRepository.create({
      role,
      content,
      reasoning,
      sessionId,
      clientId,
      ...additionalData,
    });
    return await this.messageRepository.save(message);
  }

  async getSessionHistory(
    sessionId: string,
    clientId: string,
  ): Promise<
    {
      role: string;
      content: string;
      reasoning?: string;
      searchContext?: string;
      sources?: string;
      tempFiles?: string;
    }[]
  > {
    const messages = await this.messageRepository.find({
      where: { sessionId, clientId },
      order: { createdAt: 'ASC' },
    });
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      reasoning: msg.reasoning,
      searchContext: msg.searchContext,
      sources: msg.sources,
      tempFiles: msg.tempFiles,
    }));
  }

  async loadMemoryFromDatabase(sessionId: string, clientId: string) {
    const messages = await this.getSessionHistory(sessionId, clientId);
    await this.memory.clear();

    for (let i = 0; i < messages.length; i += 2) {
      const userMsg = messages[i];
      const aiMsg = messages[i + 1];
      if (userMsg && aiMsg) {
        const userContent = userMsg.searchContext
          ? `${userMsg.content}\n\n相关上下文：\n${userMsg.searchContext}`
          : userMsg.content;

        await this.memory.saveContext(
          { input: userContent },
          { output: aiMsg.content },
        );
      }
    }
    return this.memory;
  }

  async deleteMessage(messageId: string): Promise<void> {
    this.logger.log(`正在删除ID为 ${messageId} 的消息`);
    try {
      const result = await this.messageRepository.delete(messageId);
      if (result.affected === 0) {
        this.logger.warn(`未找到ID为 ${messageId} 的消息`);
        throw new Error('Message not found');
      }
      this.logger.log(`成功删除ID为 ${messageId} 的消息`);
    } catch (error) {
      this.logger.error('Delete message error:', error);
      throw error;
    }
  }
}
