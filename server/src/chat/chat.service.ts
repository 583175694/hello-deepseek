import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Message } from './entities/message.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  private model: ChatOpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    this.model = new ChatOpenAI({
      modelName: 'deepseek-chat',
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      },
    });
  }

  async createSession(): Promise<Session> {
    const session = this.sessionRepository.create({
      sessionId: uuidv4(),
    });
    return await this.sessionRepository.save(session);
  }

  private async getSessionHistory(
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

  async streamChat(
    message: string,
    sessionId: string,
    onToken: (token: string) => void,
  ) {
    try {
      let session = await this.sessionRepository.findOne({
        where: { sessionId },
      });
      if (!session) {
        session = await this.createSession();
      }

      const history = await this.getSessionHistory(session.sessionId);
      const messages = history.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

      messages.push(new HumanMessage(message));

      // 创建用户消息
      const userMessage = this.messageRepository.create({
        role: 'user',
        content: message.toString(),
        sessionId: session.sessionId,
      });
      await this.messageRepository.save(userMessage);

      const stream = await this.model.stream(messages);
      let fullResponse = '';

      for await (const chunk of stream) {
        if (chunk.content) {
          const token = chunk.content.toString();
          fullResponse += token;
          onToken(token);
        }
      }

      // 创建 AI 响应消息
      const aiMessage = this.messageRepository.create({
        role: 'assistant',
        content: fullResponse.toString(),
        sessionId: session.sessionId,
      });
      await this.messageRepository.save(aiMessage);
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      throw error;
    }
  }

  // 获取所有会话列表
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

  // 获取指定会话的历史消息
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

  // 删除指定会话
  async deleteSession(sessionId: string) {
    try {
      console.log('sessionId', sessionId);
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // 直接使用 sessionId 删除相关消息
      await this.messageRepository.delete({ sessionId });

      // 删除会话
      await this.sessionRepository.delete({ sessionId });

      return { message: 'Session deleted successfully' };
    } catch (error) {
      this.logger.error('Delete session error:', error);
      throw error;
    }
  }
}
