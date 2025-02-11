import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { Message } from '../entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createSession(): Promise<Session> {
    const session = this.sessionRepository.create({
      sessionId: uuidv4(),
    });
    return await this.sessionRepository.save(session);
  }

  async getSessions() {
    try {
      const sessions = await this.sessionRepository.find({
        order: {
          createdAt: 'DESC',
        },
        relations: ['messages'],
        select: ['id', 'sessionId', 'createdAt', 'updatedAt'],
      });

      return sessions.map((session) => ({
        id: session.id,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        lastMessage:
          session.messages.length > 0
            ? session.messages[session.messages.length - 1].content
            : null,
        messageCount: session.messages.length,
      }));
    } catch (error) {
      this.logger.error('Get sessions error:', error);
      throw error;
    }
  }

  async getSessionMessages(sessionId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      const messages = await this.messageRepository.find({
        where: { sessionId },
        order: { createdAt: 'ASC' },
        select: ['id', 'role', 'content', 'createdAt'],
      });

      return {
        session: {
          id: session.id,
          sessionId: session.sessionId,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        },
        messages: messages,
      };
    } catch (error) {
      this.logger.error('Get session messages error:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      await this.messageRepository.delete({ sessionId });
      await this.sessionRepository.delete({ sessionId });

      return { message: 'Session deleted successfully' };
    } catch (error) {
      this.logger.error('Delete session error:', error);
      throw error;
    }
  }
}
