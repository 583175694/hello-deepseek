import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';
import { Message } from '../entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { SessionTempFile } from '../entities/session-temp-file.entity';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(SessionTempFile)
    private sessionTempFileRepository: Repository<SessionTempFile>,
  ) {}

  async createSession(
    clientId: string,
    roleName?: string,
    systemPrompt?: string,
  ): Promise<Session> {
    this.logger.log('正在创建新会话');
    const session = this.sessionRepository.create({
      sessionId: uuidv4(),
      clientId,
      roleName,
      systemPrompt,
    });
    const savedSession = await this.sessionRepository.save(session);
    this.logger.log(`会话已创建，ID为: ${savedSession.sessionId}`);
    return savedSession;
  }

  async getSessions(clientId: string) {
    try {
      this.logger.log(`正在获取客户端 ${clientId} 的所有会话`);
      const sessions = await this.sessionRepository.find({
        where: { clientId },
        order: {
          createdAt: 'DESC',
        },
        relations: ['messages'],
        select: [
          'id',
          'sessionId',
          'createdAt',
          'updatedAt',
          'roleName',
          'systemPrompt',
          'clientId',
        ],
      });

      this.logger.log(`为客户端 ${clientId} 找到 ${sessions.length} 个会话`);
      return sessions.map((session) => ({
        id: session.id,
        sessionId: session.sessionId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        roleName: session.roleName,
        systemPrompt: session.systemPrompt,
        firstMessage:
          session.messages.length > 0 ? session.messages[0].content : null,
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

  async getSessionMessages(
    sessionId: string,
    clientId: string,
    page: number = 1,
    pageSize: number = 20,
  ) {
    try {
      this.logger.log(
        `正在获取会话 ${sessionId} 的消息，页码: ${page}, 每页数量: ${pageSize}`,
      );
      const session = await this.sessionRepository.findOne({
        where: { sessionId, clientId },
      });

      if (!session) {
        this.logger.warn(`Session not found: ${sessionId}`);
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // 获取消息总数
      const totalCount = await this.messageRepository.count({
        where: { sessionId, clientId },
      });

      // 计算跳过的消息数量
      const skip = (page - 1) * pageSize;

      const messages = await this.messageRepository.find({
        where: { sessionId, clientId },
        order: { createdAt: 'DESC' }, // 按时间降序排列，最新的消息在前面
        skip: skip,
        take: pageSize,
        select: [
          'id',
          'role',
          'content',
          'reasoning',
          'searchContext',
          'sources',
          'tempFiles',
          'createdAt',
        ],
      });

      // 将结果按时间升序排列，以便前端显示
      const sortedMessages = [...messages].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      this.logger.log(
        `为会话 ${sessionId} 找到 ${messages.length} 条消息，总数: ${totalCount}`,
      );
      return {
        session: {
          id: session.id,
          sessionId: session.sessionId,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          roleName: session.roleName,
          systemPrompt: session.systemPrompt,
        },
        messages: sortedMessages,
        pagination: {
          total: totalCount,
          page,
          pageSize,
          hasMore: skip + messages.length < totalCount,
        },
      };
    } catch (error) {
      this.logger.error('Get session messages error:', error);
      throw error;
    }
  }

  async deleteSession(sessionId: string, clientId: string) {
    try {
      this.logger.log(`正在尝试删除会话: ${sessionId}`);
      const session = await this.sessionRepository.findOne({
        where: { sessionId, clientId },
      });

      if (!session) {
        this.logger.warn(`Session not found for deletion: ${sessionId}`);
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // 1. 软删除临时文件记录
      await this.sessionTempFileRepository.softDelete({ sessionId, clientId });

      // 2. 删除消息记录
      await this.messageRepository.delete({ sessionId, clientId });

      // 3. 删除会话
      await this.sessionRepository.delete({ sessionId, clientId });

      this.logger.log(`成功删除会话: ${sessionId}`);
      return { message: 'Session deleted successfully' };
    } catch (error) {
      this.logger.error(`删除会话失败: ${sessionId}`, error);
      throw new HttpException(
        'Failed to delete session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSession(
    sessionId: string,
    clientId: string,
    updates: Partial<Session>,
  ) {
    try {
      this.logger.log(`正在更新会话: ${sessionId}`);
      const session = await this.sessionRepository.findOne({
        where: { sessionId, clientId },
      });

      if (!session) {
        this.logger.warn(`Session not found for update: ${sessionId}`);
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // 只允许更新特定字段
      const allowedUpdates = ['roleName', 'systemPrompt'];
      const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
        if (allowedUpdates.includes(key)) {
          acc[key] = updates[key];
        }
        return acc;
      }, {});

      // 更新会话
      await this.sessionRepository.update(
        { sessionId, clientId },
        filteredUpdates,
      );

      const updatedSession = await this.sessionRepository.findOne({
        where: { sessionId, clientId },
      });

      this.logger.log(`成功更新会话: ${sessionId}`);
      return updatedSession;
    } catch (error) {
      this.logger.error('Update session error:', error);
      throw error;
    }
  }
}
