import { useState } from "react";
import { useChatStore } from "@/store/chat";
import { chatService } from "@/lib/api";
import type { Message } from "@/types/chat";
import { useStreamChat } from "./useStreamChat";

export function useAIChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addMessage, updateMessage } = useChatStore();
  const { streamChat, stopStreaming, isStreaming } = useStreamChat();

  // 普通对话方法
  const sendMessage = async (
    chatId: string,
    content: string,
    messages: Message[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // 添加用户消息
      addMessage(chatId, {
        content,
        role: "user",
      });

      // 准备历史记录
      const history = messages.map((msg) => ({
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
        role: "assistant",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送消息失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 流式对话方法
  const sendStreamMessage = async (
    chatId: string,
    content: string,
    messages: Message[]
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // 添加用户消息
      addMessage(chatId, {
        content,
        role: "user",
      });

      // 添加一个空的 AI 消息
      const aiMessageId = addMessage(chatId, {
        content: "AI正在思考中...",
        role: "assistant",
      });

      // 开始流式对话
      streamChat(content, messages, (streamContent) => {
        if (streamContent && isLoading) {
          setIsLoading(false);
        }
        // 更新 AI 消息内容
        updateMessage(chatId, aiMessageId, {
          content: streamContent,
          role: "assistant",
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送消息失败");
      stopStreaming();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isStreaming,
    sendMessage,
    sendStreamMessage,
    stopStreaming,
  };
}
