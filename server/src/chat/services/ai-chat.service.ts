// 导入必要的依赖
import { Injectable, Logger } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ExaRetriever } from '@langchain/exa';
import Exa from 'exa-js';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { MessageService } from './message.service';
import { SessionService } from './session.service';
import { DocumentService } from './document.service';
import { models } from 'src/configs/models';

// AI聊天服务类
@Injectable()
export class AIChatService {
  private readonly logger = new Logger(AIChatService.name);
  private model: ChatDeepSeek; // DeepSeek聊天模型实例
  private prompt: ChatPromptTemplate; // 聊天提示模板
  private retriever: ExaRetriever; // Exa检索器实例
  private exa: Exa; // Exa客户端实例

  constructor(
    private messageService: MessageService,
    private sessionService: SessionService,
    private documentService: DocumentService,
  ) {
    this.logger.log('Initializing AIChatService...');
    this.initializeServices();
  }

  // 初始化各项服务
  private initializeServices() {
    this.logger.log('Initializing DeepSeek model...');
    // 初始化DeepSeek模型
    this.model = new ChatDeepSeek({
      modelName: models.bytedance.modelName,
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL: models.bytedance.baseURL,
        apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
      },
    });
    this.logger.log('DeepSeek model initialized successfully');

    this.logger.log('Initializing Exa client and retriever...');
    // 初始化Exa客户端和检索器
    this.exa = new Exa(process.env.EXA_API_KEY);
    this.retriever = new ExaRetriever({
      client: this.exa,
    });
    this.logger.log('Exa client and retriever initialized successfully');

    this.logger.log('Setting up chat prompt template...');
    // 设置聊天提示模板
    this.prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        '请你扮演一个人工智障。以下是一些相关的搜索结果，可以参考：\n\n{searchContext}\n\n',
      ],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);
    this.logger.log('Chat prompt template setup completed');
    this.logger.log('Service initialization completed');
  }

  // 优化搜索查询
  private async optimizeSearchQuery(query: string): Promise<string> {
    this.logger.log(`Optimizing search query: ${query}`);
    try {
      const chain = ChatPromptTemplate.fromMessages([
        [
          'system',
          '你是一个搜索优化专家。你的任务是将用户的问题重新组织成更适合搜索的形式。保持核心含义不变，但要使其更加清晰、准确和易于检索。只返回优化后的问题，不要有任何解释。',
        ],
        ['human', '{input}'],
      ]).pipe(this.model);

      const response = await chain.invoke({
        input: query,
      });

      const optimizedQuery = response.content.toString();
      this.logger.log(`Query optimized to: ${optimizedQuery}`);
      return optimizedQuery;
    } catch (error) {
      this.logger.error('Query optimization error:', error);
      return query; // 如果优化失败，返回原始查询
    }
  }

  // 执行Exa搜索
  private async performExaSearch(query: string): Promise<string> {
    this.logger.log(`Performing Exa search with query: ${query}`);
    try {
      // 优化搜索查询（暂时不使用）
      // const optimizedQuery = await this.optimizeSearchQuery(query);
      // this.logger.log(`Original query: ${query}`);
      // this.logger.log(`Optimized query: ${optimizedQuery}`);

      const searchResults = await this.retriever.getRelevantDocuments(query);
      this.logger.log(`Found ${searchResults.length} search results`);
      return searchResults
        .map((doc) => `来源: ${doc.metadata.url}\n内容: ${doc.pageContent}`)
        .join('\n\n');
    } catch (error) {
      this.logger.error('Exa search error:', error);
      return '';
    }
  }

  // 流式聊天处理
  async streamChat(
    message: string,
    sessionId: string,
    useWebSearch: boolean = false,
    useVectorSearch: boolean = false,
    onToken: (response: {
      type: 'content' | 'reasoning' | 'sources';
      content: string;
    }) => void,
  ) {
    this.logger.log(`Starting stream chat for session ${sessionId}`);
    try {
      // 获取或创建会话
      let session;
      if (!sessionId) {
        this.logger.log('No sessionId provided, creating new session...');
        session = await this.sessionService.createSession();
        sessionId = session.sessionId;
        this.logger.log(`New session created with ID: ${sessionId}`);
      }

      this.logger.log('Loading chat history...');
      const memory =
        await this.messageService.loadMemoryFromDatabase(sessionId);
      const memoryVariables = await memory.loadMemoryVariables({});
      this.logger.log('Chat history loaded successfully');

      // 构建搜索上下文
      let searchContext = '';
      const sources: Array<{ type: 'web' | 'vector'; url: string }> = [];

      // 执行网络搜索
      if (useWebSearch) {
        this.logger.log('Performing web search...');
        const webSearchResults = await this.performExaSearch(message);
        if (webSearchResults) {
          // 提取URL并存储
          const urls =
            webSearchResults
              .match(/来源: (.*?)\n/g)
              ?.map((match) => match.replace('来源: ', '').trim()) || [];
          this.logger.log(`Found ${urls.length} web sources`);
          urls.forEach((url) => {
            sources.push({ type: 'web', url });
          });
          searchContext += '网络搜索结果：\n' + webSearchResults + '\n\n';
          this.logger.log('Web search results added to context');
        }
      }

      // 执行向量数据库搜索
      if (useVectorSearch) {
        this.logger.log('Performing vector database search...');
        const vectorSearchResults =
          await this.documentService.searchSimilarDocuments(message, 3);
        if (vectorSearchResults && vectorSearchResults.length > 0) {
          this.logger.log(
            `Found ${vectorSearchResults.length} vector search results`,
          );
          // 存储文档来源
          vectorSearchResults.forEach((doc) => {
            console.log(doc);
            sources.push({
              type: 'vector',
              url: doc.metadata.filename,
            });
          });
          searchContext +=
            '本地文档搜索结果：\n' +
            vectorSearchResults
              .map(
                (doc) =>
                  `来源: ${doc.metadata.filename}\n内容: ${doc.pageContent}`,
              )
              .join('\n\n') +
            '\n\n';
          this.logger.log('Vector search results added to context');
        }
      }

      // 保存用户消息
      this.logger.log('Saving user message...');
      await this.messageService.saveMessage('user', message, sessionId);
      this.logger.log('User message saved successfully');

      // 创建并执行聊天链
      this.logger.log('Creating chat chain and starting stream...');
      const chain = this.prompt.pipe(this.model);
      const stream = await chain.stream({
        history: memoryVariables.history || [],
        input: message,
        searchContext: searchContext || '没有找到相关的搜索结果',
      });
      this.logger.log('Chat stream created successfully');

      // 处理流式响应
      let fullResponse = '';
      this.logger.log('Processing stream response...');
      for await (const chunk of stream) {
        if (chunk.content) {
          const content = chunk.content.toString();
          fullResponse += content;
          onToken({
            type: 'content',
            content,
          });
        }

        if (chunk.additional_kwargs.reasoning_content) {
          const reasoning =
            chunk.additional_kwargs.reasoning_content.toString();
          onToken({
            type: 'reasoning',
            content: reasoning,
          });
        }
      }
      this.logger.log('Stream response processing completed');

      // 在所有内容传输完成后，发送来源信息
      if (sources.length > 0) {
        this.logger.log(`Sending ${sources.length} sources...`);
        onToken({
          type: 'sources',
          content: JSON.stringify(sources),
        });
        this.logger.log('Sources sent successfully');
      }

      // 保存AI助手的回复
      this.logger.log('Saving assistant response...');
      await this.messageService.saveMessage(
        'assistant',
        fullResponse.startsWith('\n\n') ? fullResponse.slice(2) : fullResponse,
        sessionId,
      );
      this.logger.log('Assistant response saved successfully');
      this.logger.log('Stream chat completed successfully');
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      throw error;
    }
  }
}
