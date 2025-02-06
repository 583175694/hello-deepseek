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
      streaming: true,
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

  async streamChat(
    message: string,
    history: { role: string; content: string }[] = [],
    onToken: (token: string) => void,
  ) {
    try {
      const messages = history.map((msg) =>
        msg.role === 'user'
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content),
      );

      messages.push(new HumanMessage(message));

      const stream = await this.model.stream(messages);

      for await (const chunk of stream) {
        if (chunk.content) {
          onToken(chunk.content.toString());
        }
      }
    } catch (error) {
      this.logger.error('Stream chat error:', error);
      throw error;
    }
  }
}
