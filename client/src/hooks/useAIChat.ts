import { useState, useCallback } from "react";
import { useStreamChat } from "./useStreamChat";
import type { Message } from "@/types/chat";
import { nanoid } from "nanoid";

interface StreamContent {
  content: string;
  reasoning: string;
  sources: string;
}

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
  const updateMessage = useCallback(
    (messageId: string, streamContent: StreamContent) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: streamContent.content,
              reasoning: streamContent.reasoning,
              sources: streamContent.sources,
            };
          }
          return msg;
        })
      );
    },
    []
  );

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
        type: "content",
      });

      // 添加AI消息
      const aiMessageId = addMessage({
        content: "",
        reasoning: "",
        sources: "",
        role: "assistant",
        type: "content",
      });

      // 用于累积不同类型的内容
      const streamContent: StreamContent = {
        content: "",
        reasoning: "",
        sources: "",
      };

      // 开始流式对话
      streamChat(content, sessionId, options, (res) => {
        if (isLoading) {
          setIsLoading(false);
        }

        // 根据类型累积内容
        if (res.type === "content") {
          streamContent.content += res.content;
        } else if (res.type === "reasoning") {
          streamContent.reasoning += res.content;
        } else if (res.type === "sources") {
          streamContent.sources += res.content;
        }

        // 更新消息
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
