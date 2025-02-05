import { useState } from 'react';
import { useChatStore } from '@/store/chat';
import { chatService } from '@/lib/api';
import type { Message } from '@/types/chat';

export function useAIChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMessage } = useChatStore();

  const sendMessage = async (chatId: string, content: string, messages: Message[]) => {
    try {
      setIsLoading(true);
      setError(null);

      // 添加用户消息
      addMessage(chatId, {
        content,
        role: 'user',
      });

      // 准备历史记录
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      // 发送请求
      const response = await chatService.chat({
        message: content,
        history,
      });

      // 添加 AI 回复
      addMessage(chatId, {
        content: response.content,
        role: 'assistant',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    sendMessage,
  };
} 