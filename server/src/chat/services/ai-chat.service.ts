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
    this.initializeServices();
  }

  // 初始化各项服务
  private initializeServices() {
    // 初始化DeepSeek模型
    this.model = new ChatDeepSeek({
      modelName: 'ep-20250210103851-zjdln',
      temperature: 0.7,
      streaming: true,
      configuration: {
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
        apiKey: process.env.DEEPSEEK_API_KEY,
      },
    });

    // 初始化Exa客户端和检索器
    this.exa = new Exa(process.env.EXA_API_KEY);
    this.retriever = new ExaRetriever({
      client: this.exa,
    });

    // 设置聊天提示模板
    this.prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        '请你扮演一个内向话少的女孩。以下是一些相关的搜索结果，可以参考：\n\n{searchContext}\n\n',
      ],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);
  }

  // 优化搜索查询
  private async optimizeSearchQuery(query: string): Promise<string> {
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

      return response.content.toString();
    } catch (error) {
      this.logger.error('Query optimization error:', error);
      return query; // 如果优化失败，返回原始查询
    }
  }

  // 执行Exa搜索
  private async performExaSearch(query: string): Promise<string> {
    try {
      // 优化搜索查询
      const optimizedQuery = await this.optimizeSearchQuery(query);
      this.logger.log(`Original query: ${query}`);
      this.logger.log(`Optimized query: ${optimizedQuery}`);

      const searchResults =
        await this.retriever.getRelevantDocuments(optimizedQuery);
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
    onToken: (token: string) => void,
  ) {
    try {
      // 创建会话并加载历史记录
      const session = await this.sessionService.createSession();
      const memory = await this.messageService.loadMemoryFromDatabase(
        session.sessionId,
      );
      const memoryVariables = await memory.loadMemoryVariables({});

      // 构建搜索上下文
      let searchContext = '';

      // 执行网络搜索
      if (useWebSearch) {
        this.logger.log('Performing web search...');
        const webSearchResults = await this.performExaSearch(message);
        if (webSearchResults) {
          searchContext += '网络搜索结果：\n' + webSearchResults + '\n\n';
        }
      }

      // 执行向量数据库搜索
      if (useVectorSearch) {
        this.logger.log('Performing vector database search...');
        const vectorSearchResults =
          await this.documentService.searchSimilarDocuments(message, 3);
        if (vectorSearchResults && vectorSearchResults.length > 0) {
          searchContext +=
            '本地文档搜索结果：\n' +
            vectorSearchResults
              .map(
                (doc) =>
                  `来源: ${doc.metadata.filename}\n内容: ${doc.pageContent}`,
              )
              .join('\n\n') +
            '\n\n';
        }
      }

      // 保存用户消息
      await this.messageService.saveMessage('user', message, sessionId);

      // 创建并执行聊天链
      const chain = this.prompt.pipe(this.model);
      const stream = await chain.stream({
        history: memoryVariables.history || [],
        input: message,
        searchContext: searchContext || '没有找到相关的搜索结果',
      });

      // 处理流式响应
      let fullResponse = '';
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

      // 保存AI助手的回复
      await this.messageService.saveMessage(
        'assistant',
        fullResponse.startsWith('\n\n') ? fullResponse.slice(2) : fullResponse,
        sessionId,
      );
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      throw error;
    }
  }
}
