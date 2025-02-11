// 导入所需的依赖
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Message } from './entities/message.entity';
import { v4 as uuidv4 } from 'uuid';
import { AIMessageChunk } from '@langchain/core/messages';
import { IterableReadableStream } from '@langchain/core/dist/utils/stream';
import { BufferWindowMemory } from 'langchain/memory';
import { ExaRetriever } from '@langchain/exa';
import Exa from 'exa-js';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ByteDanceDoubaoEmbeddings } from '@langchain/community/embeddings/bytedance_doubao';
import { Document } from '@langchain/core/documents';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import * as fs from 'fs';
import * as path from 'path';

// 聊天服务类
@Injectable()
export class ChatService {
  // 声明私有成员变量
  private model: ChatDeepSeek;
  private prompt: ChatPromptTemplate;
  private memory: BufferWindowMemory;
  private retriever: ExaRetriever;
  private readonly logger = new Logger(ChatService.name);
  private exa: Exa;
  private embeddings: ByteDanceDoubaoEmbeddings;
  private vectorStore: FaissStore;
  private readonly vectorStorePath = path.join(process.cwd(), 'vector_store');
  private readonly indexPath = path.join(this.vectorStorePath, 'faiss.index');
  private readonly docStorePath = path.join(
    this.vectorStorePath,
    'docstore.json',
  );

  // 构造函数，注入依赖
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {
    // 初始化 ChatOpenAI 模型
    this.model = new ChatDeepSeek({
      modelName: 'ep-20250210103851-zjdln',
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        apiKey: process.env.DEEPSEEK_API_KEY,
      },
    });

    // 初始化记忆缓存
    this.memory = new BufferWindowMemory({
      k: 2, // 保留最近2轮对话
      returnMessages: true,
      memoryKey: 'history',
      inputKey: 'input',
      outputKey: 'output',
    });

    // 初始化 Exa 客户端
    this.exa = new Exa(process.env.EXA_API_KEY);

    // 初始化 Exa 检索器
    this.retriever = new ExaRetriever({
      client: this.exa,
    });

    // 设置对话模板
    this.prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        '请你扮演一个内向话少的女孩。以下是一些相关的搜索结果，可以参考：\n\n{searchContext}\n\n',
      ],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);

    // 初始化 Cohere Embeddings
    this.embeddings = new ByteDanceDoubaoEmbeddings({
      apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      model: 'ep-20250211181607-xhts2',
      verbose: true,
    });

    // 确保向量存储目录存在
    if (!fs.existsSync(this.vectorStorePath)) {
      fs.mkdirSync(this.vectorStorePath, { recursive: true });
    }

    // 初始化或加载向量存储
    this.initVectorStore();
  }

  private async initVectorStore() {
    try {
      // 确保目录存在
      if (!fs.existsSync(this.vectorStorePath)) {
        fs.mkdirSync(this.vectorStorePath, { recursive: true });
      }

      if (fs.existsSync(this.indexPath) && fs.existsSync(this.docStorePath)) {
        this.logger.log('Loading existing vector store...');
        this.vectorStore = await FaissStore.load(
          this.vectorStorePath,
          this.embeddings,
        );
        this.logger.log('Vector store loaded successfully');
      } else {
        this.logger.log('Creating new vector store...');
        // 创建一个初始文档，以便初始化向量存储
        const initialDocument = new Document({
          pageContent: 'Initial document to initialize vector store',
          metadata: { source: 'initialization' },
        });

        // 使用 fromDocuments 初始化
        this.vectorStore = await FaissStore.fromDocuments(
          [initialDocument], // 使用一个初始文档而不是空数组
          this.embeddings,
        );

        // 保存到指定路径
        await this.vectorStore.save(this.vectorStorePath);
        this.logger.log('New vector store created successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize vector store:', error);
      throw new HttpException(
        `Failed to initialize vector store: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 修改添加文档的方法
  async addDocuments(documents: Document[]): Promise<void> {
    try {
      if (!this.vectorStore) {
        this.logger.error('Vector store not initialized');
        throw new Error('Vector store not initialized');
      }

      this.logger.log(
        `Adding ${documents.length} documents to vector store...`,
      );

      // 直接使用 addDocuments 方法
      await this.vectorStore.addDocuments(documents);

      // 保存到磁盘
      await this.vectorStore.save(this.vectorStorePath);

      this.logger.log('Documents added and saved successfully');
    } catch (error) {
      this.logger.error('Failed to add documents:', error);
      throw new HttpException(
        `Failed to add documents: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 相似度搜索
  async searchSimilarDocuments(
    query: string,
    limit: number = 5,
  ): Promise<Document[]> {
    try {
      const results = await this.vectorStore.similaritySearch(query, limit);
      this.logger.log(
        `Found ${results.length} similar documents for query: ${query}`,
      );
      return results;
    } catch (error) {
      this.logger.error('Failed to search documents:', error);
      throw new HttpException(
        'Failed to search similar documents',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 创建新的会话
  async createSession(): Promise<Session> {
    const session = this.sessionRepository.create({
      sessionId: uuidv4(),
    });
    return await this.sessionRepository.save(session);
  }

  // 获取会话历史记录
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

  // 从数据库加载历史记录到内存
  private async loadMemoryFromDatabase(sessionId: string) {
    const messages = await this.getSessionHistory(sessionId);
    // 清空当前 memory
    await this.memory.clear();

    // 将数据库中的消息加载到 memory 中
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
  }

  private async performExaSearch(query: string): Promise<string> {
    try {
      const searchResults = await this.retriever.getRelevantDocuments(query);
      return searchResults
        .map((doc) => `来源: ${doc.metadata.url}\n内容: ${doc.pageContent}`)
        .join('\n\n');
    } catch (error) {
      this.logger.error('Exa search error:', error);
      return ''; // 如果搜索失败，返回空字符串
    }
  }

  // 处理流式聊天请求
  async streamChat(
    message: string,
    sessionId: string,
    onToken: (token: string) => void,
  ) {
    try {
      // 查找或创建会话
      let session = await this.sessionRepository.findOne({
        where: { sessionId },
      });
      if (!session) {
        session = await this.createSession();
      }

      // 从数据库加载历史记录到 memory
      await this.loadMemoryFromDatabase(session.sessionId);

      // 获取 memory 中的消息
      const memoryVariables = await this.memory.loadMemoryVariables({});

      // 执行 Exa 搜索
      const searchContext = await this.performExaSearch(message);
      console.log('searchContext', searchContext);

      // 创建对话链并获取响应流
      const chain = this.prompt.pipe(this.model);
      const stream: IterableReadableStream<AIMessageChunk> = await chain.stream(
        {
          history: memoryVariables.history || [],
          input: message,
          searchContext: searchContext || '没有找到相关的搜索结果',
        },
      );

      // 保存用户消息
      const userMessage = this.messageRepository.create({
        role: 'user',
        content: message.toString(),
        sessionId: session.sessionId,
      });
      await this.messageRepository.save(userMessage);

      let fullResponse = '';

      // 处理响应流
      for await (const chunk of stream) {
        let token = '';
        if (chunk.content) {
          token = chunk.content.toString();
          fullResponse += token;
        }
        if (chunk.additional_kwargs.reasoning_content) {
          token = chunk.additional_kwargs.reasoning_content.toString();
        }

        onToken(token);
      }

      // 保存 AI 响应消息
      const aiMessage = this.messageRepository.create({
        role: 'assistant',
        content: fullResponse.startsWith('\n\n')
          ? fullResponse.slice(2)
          : fullResponse,
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

      // 格式化返回数据
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
      // 查找会话
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // 获取会话消息
      const messages = await this.messageRepository.find({
        where: { sessionId },
        order: { createdAt: 'ASC' },
        select: ['id', 'role', 'content', 'createdAt'],
      });

      // 返回会话和消息信息
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

      // 删除会话相关的所有消息
      await this.messageRepository.delete({ sessionId });

      // 删除会话本身
      await this.sessionRepository.delete({ sessionId });

      return { message: 'Session deleted successfully' };
    } catch (error) {
      this.logger.error('Delete session error:', error);
      throw error;
    }
  }
}
