"use client";

import { useEffect } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { useSessionManager } from "@/contexts/SessionContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService } from "@/lib/api";

export function ChatHistory() {
  const { currentSessionId } = useSessionManager();
  const { messages, isLoading, error, sendStreamMessage, setMessageList } =
    useAIChat();

  // 加载会话消息历史
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentSessionId) return;

      try {
        const data = await chatService.getSessionMessages(currentSessionId);
        setMessageList(data.messages);
      } catch (error) {
        console.error("加载消息历史失败:", error);
      }
    };

    loadMessages();
  }, [currentSessionId, setMessageList]);

  if (!currentSessionId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        选择或创建一个对话开始聊天
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6 max-w-2xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="text-sm text-muted-foreground">AI 正在思考...</div>
          )}
          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
      </div>

      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={(content, { useWebSearch, useVectorSearch }) => {
              sendStreamMessage(content, currentSessionId, {
                useWebSearch,
                useVectorSearch,
              });
            }}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
