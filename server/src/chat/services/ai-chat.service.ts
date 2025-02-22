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
import { TempDocumentService } from './temp-document.service';
import { models } from 'src/configs/models';

// AI聊天服务类
@Injectable()
export class AIChatService {
  private readonly logger = new Logger(AIChatService.name);
  private modelInstances: Record<string, ChatDeepSeek> = {}; // 存储所有模型实例
  private prompt: ChatPromptTemplate; // 聊天提示模板
  private retriever: ExaRetriever; // Exa检索器实例
  private exa: Exa; // Exa客户端实例
  private readonly DEFAULT_SYSTEM_PROMPT =
    '你是一个智能AI助手，可以帮助用户解决各种问题。';

  constructor(
    private messageService: MessageService,
    private sessionService: SessionService,
    private documentService: DocumentService,
    private tempDocumentService: TempDocumentService,
  ) {
    this.logger.log('Initializing AIChatService...');
    this.initializeServices();
  }

  // 初始化各项服务
  private initializeServices() {
    this.logger.log('Initializing DeepSeek models...');
    // 初始化所有可用的模型实例
    this.initializeAllModels();
    this.logger.log('DeepSeek models initialized successfully');

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
        '{systemPrompt}\n\n以下是一些相关的搜索结果，可以参考：\n\n{searchContext}\n\n',
      ],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);
    this.logger.log('Chat prompt template setup completed');
    this.logger.log('Service initialization completed');
  }

  private initializeAllModels() {
    // 初始化所有配置中的模型
    Object.entries(models).forEach(([modelId, modelConfig]) => {
      this.modelInstances[modelId] = new ChatDeepSeek({
        modelName: modelConfig.modelName,
        temperature: 0.7,
        streaming: true,
        configuration: {
          baseURL: modelConfig.baseURL,
          apiKey: process.env.BYTEDANCE_DOUBAO_API_KEY,
        },
      });
      this.logger.log(`Initialized model: ${modelId}`);
    });
  }

  // 获取指定模型实例
  private getModel(modelId: string): ChatDeepSeek {
    const model = this.modelInstances[modelId];
    if (!model) {
      throw new Error(`Model ${modelId} not found in configuration`);
    }
    return model;
  }

  // 优化搜索查询
  private async optimizeSearchQuery(
    query: string,
    modelId: string,
  ): Promise<string> {
    this.logger.log(`Optimizing search query: ${query}`);
    try {
      const chain = ChatPromptTemplate.fromMessages([
        [
          'system',
          '你是一个搜索优化专家。你的任务是将用户的问题重新组织成更适合搜索的形式。保持核心含义不变，但要使其更加清晰、准确和易于检索。只返回优化后的问题，不要有任何解释。',
        ],
        ['human', '{input}'],
      ]).pipe(this.getModel(modelId));

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

  // 执行临时文档搜索
  private async performTempDocSearch(
    message: string,
    sessionId: string,
    clientId: string,
    onToken: (response: { type: string; content: string }) => void,
  ): Promise<{
    searchContext: string;
    sources: Array<{ type: 'temp'; url: string }>;
  }> {
    this.logger.log('Performing temp document search...');
    onToken({ type: 'status', content: 'Searching temporary documents...' });

    let searchContext = '';
    const sources: Array<{ type: 'temp'; url: string }> = [];

    const tempDocuments = await this.tempDocumentService.searchSimilarDocuments(
      message,
      sessionId,
      clientId,
    );

    if (
      Array.isArray(tempDocuments) &&
      tempDocuments.length > 0 &&
      tempDocuments[0]?.pageContent
    ) {
      this.logger.log(
        `Found ${tempDocuments.length} temp documents with content`,
      );
      onToken({
        type: 'status',
        content: `Found ${tempDocuments.length} temporary documents`,
      });

      searchContext +=
        '会话临时文档搜索结果：\n' +
        tempDocuments.map((doc) => doc.pageContent).join('\n') +
        '\n\n';

      // 从每个文档的元数据中获取文件名
      tempDocuments.forEach((doc) => {
        if (doc.metadata?.filename) {
          sources.push({
            type: 'temp',
            url: doc.metadata.filename,
          });
        }
      });

      this.logger.log('Temp document search results added to context');
    } else {
      this.logger.log('No valid temp documents found');
      onToken({ type: 'status', content: 'No temporary documents found' });
    }

    return { searchContext, sources };
  }

  // 执行网络搜索
  private async performWebSearch(
    message: string,
    onToken: (response: { type: string; content: string }) => void,
  ): Promise<{
    searchContext: string;
    sources: Array<{ type: 'web'; url: string }>;
  }> {
    this.logger.log('Performing web search...');
    onToken({ type: 'status', content: 'Searching web resources...' });

    let searchContext = '';
    const sources: Array<{ type: 'web'; url: string }> = [];

    const webSearchResults = await this.performExaSearch(message);
    if (webSearchResults) {
      // 提取URL并存储
      const urls =
        webSearchResults
          .match(/来源: (.*?)\n/g)
          ?.map((match) => match.replace('来源: ', '').trim()) || [];
      this.logger.log(`Found ${urls.length} web sources`);
      onToken({
        type: 'status',
        content: `Found ${urls.length} web resources`,
      });

      urls.forEach((url) => {
        sources.push({ type: 'web', url });
      });
      searchContext += '网络搜索结果：\n' + webSearchResults + '\n\n';
      this.logger.log('Web search results added to context');
    } else {
      onToken({ type: 'status', content: 'No web resources found' });
    }

    return { searchContext, sources };
  }

  // 执行向量数据库搜索
  private async performVectorSearch(
    message: string,
    clientId: string,
    onToken: (response: { type: string; content: string }) => void,
  ): Promise<{
    searchContext: string;
    sources: Array<{ type: 'vector'; url: string }>;
  }> {
    this.logger.log('Performing vector database search...');
    onToken({ type: 'status', content: 'Searching vector database...' });

    let searchContext = '';
    const sources: Array<{ type: 'vector'; url: string }> = [];

    const vectorSearchResults =
      await this.documentService.searchSimilarDocuments(clientId, message, 3);
    if (vectorSearchResults && vectorSearchResults.length > 0) {
      this.logger.log(
        `Found ${vectorSearchResults.length} vector search results`,
      );
      onToken({
        type: 'status',
        content: `Found ${vectorSearchResults.length} documents in vector database`,
      });

      // 存储文档来源
      vectorSearchResults.forEach((doc) => {
        sources.push({
          type: 'vector',
          url: doc.metadata.filename,
        });
      });
      searchContext +=
        '本地文档搜索结果：\n' +
        vectorSearchResults
          .map(
            (doc) => `来源: ${doc.metadata.filename}\n内容: ${doc.pageContent}`,
          )
          .join('\n\n') +
        '\n\n';
      this.logger.log('Vector search results added to context');
    } else {
      onToken({
        type: 'status',
        content: 'No documents found in vector database',
      });
    }

    return { searchContext, sources };
  }

  // 流式聊天处理
  async streamChat(
    message: string,
    clientId: string,
    sessionId: string,
    onToken: (response: {
      type: 'content' | 'reasoning' | 'sources' | 'temp' | 'status';
      content: string;
    }) => void,
    useWebSearch: boolean = false,
    useVectorSearch: boolean = false,
    useTempDocSearch: boolean = false,
    modelId: string = 'bytedance_deepseek_r1',
  ) {
    this.logger.log(
      `Starting stream chat for session ${sessionId} and client ${clientId} using model ${modelId}`,
    );
    try {
      // 获取或创建会话
      let session;
      if (!sessionId) {
        this.logger.log('No sessionId provided, creating new session...');
        session = await this.sessionService.createSession(clientId);
        sessionId = session.sessionId;
        this.logger.log(`New session created with ID: ${sessionId}`);
      } else {
        session = await this.sessionService.getSessionMessages(
          sessionId,
          clientId,
        );
        session = session.session;
      }

      this.logger.log('Loading chat history...');
      const memory = await this.messageService.loadMemoryFromDatabase(
        sessionId,
        clientId,
      );
      const memoryVariables = await memory.loadMemoryVariables({});
      this.logger.log('Chat history loaded successfully');

      // 构建搜索上下文
      let searchContext = '';
      const sources: Array<{ type: 'web' | 'vector' | 'temp'; url: string }> =
        [];

      // 执行临时文档搜索
      if (useTempDocSearch && sessionId) {
        const { searchContext: tempSearchContext, sources: tempSources } =
          await this.performTempDocSearch(
            message,
            sessionId,
            clientId,
            onToken,
          );
        searchContext += tempSearchContext;
        sources.push(...tempSources);
      }

      // 执行网络搜索
      if (useWebSearch) {
        const { searchContext: webSearchContext, sources: webSources } =
          await this.performWebSearch(message, onToken);
        searchContext += webSearchContext;
        sources.push(...webSources);
      }

      // 执行向量数据库搜索
      if (useVectorSearch) {
        const { searchContext: vectorSearchContext, sources: vectorSources } =
          await this.performVectorSearch(message, clientId, onToken);
        searchContext += vectorSearchContext;
        sources.push(...vectorSources);
      }

      // 保存用户消息
      this.logger.log('Saving user message...');
      await this.messageService.saveMessage(
        'user',
        message,
        null,
        sessionId,
        clientId,
      );
      this.logger.log('User message saved successfully');

      // 创建并执行聊天链
      this.logger.log('Creating chat chain and starting stream...');
      const chain = this.prompt.pipe(this.getModel(modelId));
      const stream = await chain.stream({
        history: memoryVariables.history || [],
        input: message,
        searchContext: searchContext || '没有找到相关的搜索结果',
        systemPrompt: session.systemPrompt || this.DEFAULT_SYSTEM_PROMPT,
      });
      this.logger.log('Chat stream created successfully');

      // 处理流式响应
      let fullResponse = '';
      let fullReasoning = '';
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
          fullReasoning += reasoning;
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
        fullReasoning || null,
        sessionId,
        clientId,
      );
      this.logger.log('Assistant response saved successfully');
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      throw error;
    }
  }
}
