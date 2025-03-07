// 导入必要的依赖
import { Injectable, Logger } from '@nestjs/common';
import { ChatDeepSeek } from '@langchain/deepseek';
import { ExaRetriever } from '@langchain/exa';
import Exa from 'exa-js';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { MessageService } from './services/message.service';
import { SessionService } from './services/session.service';
import { DocumentService } from './services/document.service';
import { TempDocumentService } from './services/temp-document.service';
import { models } from 'src/configs/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionTempFile } from './entities/session-temp-file.entity';

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
    @InjectRepository(SessionTempFile)
    private sessionTempFileRepository: Repository<SessionTempFile>,
  ) {
    this.logger.log('正在初始化AI聊天服务...');
    this.initializeServices();
  }

  // 初始化各项服务
  private initializeServices() {
    this.logger.log('正在初始化DeepSeek模型...');
    // 初始化所有可用的模型实例
    this.initializeAllModels();

    this.logger.log('正在初始化Exa客户端和检索器...');
    // 初始化Exa客户端和检索器
    this.exa = new Exa(process.env.EXA_API_KEY);
    this.retriever = new ExaRetriever({
      client: this.exa,
    });

    this.logger.log('正在设置聊天提示模板...');
    // 设置聊天提示模板
    this.prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        '{systemPrompt}\n\n以下是一些相关的搜索结果，可以参考：\n\n{searchContext}\n\n',
      ],
      new MessagesPlaceholder('history'),
      ['human', '{input}'],
    ]);
    this.logger.log('聊天提示模板设置完成');
    this.logger.log('服务初始化完成');
  }

  // 初始化所有模型
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
        maxTokens: 4096, // 添加最大token限制
        maxRetries: 3, // 添加最大重试次数
        modelKwargs: {
          ignore_token_counting: true, // 忽略token计数
        },
      });
      this.logger.log(`已初始化模型: ${modelId}`);
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

  // 生成系统提示词
  async generateSystemPrompt(
    roleName: string,
    modelId: string = 'bytedance_deepseek_v3',
  ): Promise<string> {
    this.logger.log(`正在为角色 "${roleName}" 生成系统提示词...`);

    try {
      const chain = ChatPromptTemplate.fromMessages([
        [
          'system',
          '你是一个专业的AI提示词专家。你的任务是根据用户提供的角色名称，生成一个详细的、专业的系统提示词。' +
            '这个提示词应该清晰地定义AI助手的角色、专业领域、行为准则和主要职责。' +
            '提示词应该是中文的，并且要简洁有力。直接返回生成的提示词，不需要任何解释或额外的格式。',
        ],
        ['human', `请为"${roleName}"这个角色生成一个系统提示词。`],
      ]).pipe(this.getModel(modelId));

      const response = await chain.invoke({});
      const systemPrompt = response.content.toString().trim();

      this.logger.log(`系统提示词生成成功: ${systemPrompt}`);
      return systemPrompt;
    } catch (error) {
      this.logger.error('生成系统提示词时出错:', error);
      throw error;
    }
  }

  // 执行Exa搜索
  private async performExaSearch(query: string): Promise<string> {
    this.logger.log(`正在使用查询执行Exa搜索: ${query}`);
    try {
      const searchResults = await this.retriever.getRelevantDocuments(query);
      this.logger.log(`找到 ${searchResults.length} 条搜索结果`);
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
    this.logger.log('正在执行临时文档搜索...');
    onToken({ type: 'status', content: 'Searching temporary documents...' });

    let searchContext = '';
    const sources: Array<{ type: 'temp'; url: string }> = [];

    // 先尝试获取短文档内容
    const tempFiles = await this.sessionTempFileRepository.find({
      where: { sessionId, clientId },
      withDeleted: false,
    });

    if (tempFiles && tempFiles.length > 0) {
      // 检查是否有短文档标记
      const shortDocs = tempFiles.filter((file) => file.isShortDocument);

      if (shortDocs.length > 0) {
        this.logger.log(`找到 ${shortDocs.length} 个短文档，直接使用完整内容`);
        onToken({
          type: 'status',
          content: `Found ${shortDocs.length} short documents, using full content`,
        });

        // 直接使用短文档的完整内容
        searchContext += '会话临时文档内容：\n';
        for (const doc of shortDocs) {
          searchContext += `来源: ${doc.originalFilename}\n内容: ${doc.fullContent}\n\n`;
          sources.push({
            type: 'temp',
            url: doc.filename,
          });
        }

        this.logger.log('短文档内容已添加到上下文');
        return { searchContext, sources };
      }
    }

    // 如果没有短文档，则执行向量搜索
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
      this.logger.log(`找到 ${tempDocuments.length} 个包含内容的临时文档`);
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

      this.logger.log('临时文档搜索结果已添加到上下文');
    } else {
      this.logger.log('未找到有效的临时文档');
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
    this.logger.log('正在执行网络搜索...');
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
      this.logger.log(`找到 ${urls.length} 个网络来源`);
      onToken({
        type: 'status',
        content: `Found ${urls.length} web resources`,
      });

      urls.forEach((url) => {
        sources.push({ type: 'web', url });
      });
      searchContext += '网络搜索结果：\n' + webSearchResults + '\n\n';
      this.logger.log('网络搜索结果已添加到上下文');
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
    this.logger.log('正在执行向量数据库搜索...');
    onToken({ type: 'status', content: 'Searching vector database...' });

    let searchContext = '';
    const sources: Array<{ type: 'vector'; url: string }> = [];

    const vectorSearchResults =
      await this.documentService.searchSimilarDocuments(clientId, message, 3);
    if (vectorSearchResults && vectorSearchResults.length > 0) {
      this.logger.log(`找到 ${vectorSearchResults.length} 条向量搜索结果`);
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
      this.logger.log('向量搜索结果已添加到上下文');
    } else {
      onToken({
        type: 'status',
        content: 'No documents found in vector database',
      });
    }

    return { searchContext, sources };
  }

  // 删除消息
  async deleteMessage(messageId: string): Promise<void> {
    this.logger.log(`正在删除ID为 ${messageId} 的消息`);
    try {
      await this.messageService.deleteMessage(messageId);
      this.logger.log('消息删除成功');
    } catch (error) {
      this.logger.error('Delete message error:', error);
      throw error;
    }
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
      `正在为会话 ${sessionId} 和客户端 ${clientId} 使用模型 ${modelId} 启动流式聊天`,
    );
    try {
      // 获取或创建会话
      let session;
      if (!sessionId) {
        this.logger.log('未提供会话ID，正在创建新会话...');
        session = await this.sessionService.createSession(clientId);
        sessionId = session.sessionId;
        this.logger.log(`已创建ID为 ${sessionId} 的新会话`);
      } else {
        session = await this.sessionService.getSessionMessages(
          sessionId,
          clientId,
        );
        session = session.session;
      }

      this.logger.log('正在加载聊天历史...');
      const memory = await this.messageService.loadMemoryFromDatabase(
        sessionId,
        clientId,
      );
      const memoryVariables = await memory.loadMemoryVariables({});

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
      await this.messageService.saveMessage(
        'user',
        message,
        null,
        sessionId,
        clientId,
        useTempDocSearch
          ? {
              tempFiles: JSON.stringify(
                await this.tempDocumentService.getSessionDocuments(
                  sessionId,
                  clientId,
                ),
              ),
              searchContext,
            }
          : undefined,
      );

      // 如果使用了临时文档搜索，存储完成后清理临时文件
      if (useTempDocSearch) {
        this.logger.log('正在清理临时文件...');
        try {
          await this.tempDocumentService.cleanupSession(sessionId, clientId);
          this.logger.log('临时文件清理完成');
        } catch (error) {
          this.logger.error('清理临时文件时出错:', error);
          // 不抛出错误，因为这不应该影响主流程
        }
      }

      // 创建并执行聊天链
      const chain = this.prompt.pipe(this.getModel(modelId));
      const stream = await chain.stream({
        history: memoryVariables.history || [],
        input: message,
        searchContext: searchContext || '没有找到相关的搜索结果',
        systemPrompt: session.systemPrompt || this.DEFAULT_SYSTEM_PROMPT,
      });

      // 处理流式响应
      let fullResponse = '';
      let fullReasoning = '';
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
      this.logger.log('流式响应处理完成');

      // 在所有内容传输完成后，发送来源信息
      if (sources.length > 0) {
        this.logger.log(`正在发送 ${sources.length} 个来源...`);
        onToken({
          type: 'sources',
          content: JSON.stringify(sources),
        });
        this.logger.log('来源发送成功');
      }

      // 保存AI助手的回复
      this.logger.log('正在保存助手响应...');
      await this.messageService.saveMessage(
        'assistant',
        fullResponse.startsWith('\n\n') ? fullResponse.slice(2) : fullResponse,
        fullReasoning || null,
        sessionId,
        clientId,
        {
          sources: JSON.stringify(sources),
        },
      );
      this.logger.log('助手响应保存成功');
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      throw error;
    }
  }
}
