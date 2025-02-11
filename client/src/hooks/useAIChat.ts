import { useState, useCallback } from "react";
import { useStreamChat } from "./useStreamChat";
import type { Message } from "@/types/chat";
import { nanoid } from "nanoid";

export function useAIChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { streamChat, stopStreaming, isStreaming } = useStreamChat();

  // 添加消息
  const addMessage = useCallback(
    (message: Omit<Message, "id" | "createdAt">) => {
      const newMessage: Message = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        ...message,
      };
      setMessages((prev) => [...prev, newMessage]);
      return newMessage.id;
    },
    []
  );

  // 更新消息
  const updateMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
    );
  }, []);

  // 流式对话方法
  const sendStreamMessage = async (
    content: string,
    sessionId: string,
    options?: {
      useWebSearch?: boolean;
      useVectorSearch?: boolean;
    }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      // 添加用户消息
      addMessage({
        content,
        role: "user",
      });

      // 添加一个空的 AI 消息
      const aiMessageId = addMessage({
        content: "AI正在思考中...",
        role: "assistant",
      });

      // 开始流式对话
      streamChat(content, sessionId, options, (streamContent) => {
        if (streamContent && isLoading) {
          setIsLoading(false);
        }
        // 更新 AI 消息内容
        updateMessage(aiMessageId, streamContent);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送消息失败");
      stopStreaming();
    } finally {
      setIsLoading(false);
    }
  };

  // 设置消息列表
  const setMessageList = useCallback((newMessages: Message[]) => {
    setMessages(newMessages);
  }, []);

  return {
    messages,
    isLoading,
    error,
    isStreaming,
    sendStreamMessage,
    stopStreaming,
    setMessageList,
  };
}
