import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

@Injectable()
export class ChatService {
  private model: ChatOpenAI;
  private readonly logger = new Logger(ChatService.name);

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'deepseek-chat',
      temperature: 0.7,
      configuration: {
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
      },
    });
  }

  async chat(
    message: string,
    history: { role: string; content: string }[] = [],
  ) {
    try {
      const messages = history.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

      messages.push(new HumanMessage(message));

      const response = await this.model.invoke(messages);
      return response.content;
    } catch (error) {
      this.logger.error('Chat error:', error);
      throw error;
    }
  }
}
