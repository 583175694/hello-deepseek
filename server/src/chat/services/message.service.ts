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
      k: 2,
      returnMessages: true,
      memoryKey: 'history',
      inputKey: 'input',
      outputKey: 'output',
    });
  }

  async saveMessage(
    role: string,
    content: string,
    sessionId: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      role,
      content,
      sessionId,
    });
    return await this.messageRepository.save(message);
  }

  async getSessionHistory(
    sessionId: string,
  ): Promise<{ role: string; content: string }[]> {
    const messages = await this.messageRepository.find({
      where: { session: { sessionId } },
      order: { createdAt: 'ASC' },
    });
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
  }

  async loadMemoryFromDatabase(sessionId: string) {
    const messages = await this.getSessionHistory(sessionId);
    await this.memory.clear();

    for (let i = 0; i < messages.length; i += 2) {
      const userMsg = messages[i];
      const aiMsg = messages[i + 1];
      if (userMsg && aiMsg) {
        await this.memory.saveContext(
          { input: userMsg.content },
          { output: aiMsg.content },
        );
      }
    }
    return this.memory;
  }
}
