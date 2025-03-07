import { useState, useCallback } from "react";
import { useStreamChat } from "./useStreamChat";
import type { Message } from "@/types/chat";
import { nanoid } from "nanoid";

interface StreamContent {
  content: string;
  type: "content" | "reasoning" | "sources" | "status";
}

interface MessageContent {
  content: string;
  reasoning: string;
  sources: string;
  status: string;
}

interface ChatOptions {
  useWebSearch?: boolean;
  useVectorSearch?: boolean;
  useTempDocSearch?: boolean;
  tempFiles?: string;
}

export function useAIChat() {
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

      // 确保不会添加重复的消息
      setMessages((prev) => {
        return [...prev, newMessage];
      });

      return newMessage.id;
    },
    []
  );

  // 更新消息
  const updateMessage = useCallback(
    (messageId: string, content: MessageContent) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === messageId) {
            return {
              ...msg,
              content: content.content,
              reasoning: content.reasoning,
              sources: content.sources,
              status: content.status,
            };
          }
          return msg;
        })
      );
    },
    []
  );

  // 设置消息列表
  const setMessageList = useCallback(
    (newMessages: Message[] | ((prev: Message[]) => Message[])) => {
      setMessages(newMessages);
    },
    []
  );

  // 发送流式消息
  const sendStreamMessage = useCallback(
    async (content: string, sessionId: string, options: ChatOptions = {}) => {
      try {
        setError(null);

        // 添加用户消息
        addMessage({
          role: "user",
          content,
          type: "content",
          tempFiles: options.tempFiles,
        });

        // 添加 AI 消息占位
        const messageId = addMessage({
          role: "assistant",
          content: "",
          type: "content",
          status: "",
        });

        // 用于累积不同类型的内容
        const messageContent: MessageContent = {
          content: "",
          reasoning: "",
          sources: "",
          status: "",
        };

        // 开始流式传输
        await streamChat(
          content,
          sessionId,
          options,
          (response: StreamContent) => {
            // 根据类型累积内容
            if (response.type === "content") {
              messageContent.content += response.content;
              messageContent.status = ""; // 清空状态
            } else if (response.type === "reasoning") {
              messageContent.reasoning += response.content;
              messageContent.status = ""; // 清空状态
            } else if (response.type === "sources") {
              messageContent.sources += response.content;
            } else if (response.type === "status") {
              messageContent.status = response.content;
            }
            // 更新消息
            updateMessage(messageId, messageContent);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "发送消息失败");
      }
    },
    [addMessage, streamChat, updateMessage]
  );

  // 中断流式传输
  const abortStream = useCallback(() => {
    stopStreaming();
  }, [stopStreaming]);

  return {
    messages,
    isLoading: isStreaming,
    error,
    isStreaming,
    sendStreamMessage,
    setMessageList,
    abortStream,
  };
}
