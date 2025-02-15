"use client";

import { useEffect, useRef } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { useSessionManager } from "@/contexts/SessionContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService, fileService } from "@/lib/api";

export function ChatHistory() {
  // 添加消息容器的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSessionId } = useSessionManager();

  // 从 AI 聊天 hook 获取状态和方法
  const {
    messages,
    error,
    isStreaming,
    sendStreamMessage,
    setMessageList,
    abortStream,
  } = useAIChat();

  // 添加滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 在消息列表变化时滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSessionId]);

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

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!currentSessionId) {
      throw new Error("No active session");
    }

    const result = await fileService.uploadTempFile(currentSessionId, file);
    return {
      name: file.name,
      path: result.filePath,
    };
  };

  // 处理文件删除
  const handleFileRemove = async () => {
    if (!currentSessionId) return;
    try {
      await fileService.cleanupTempFiles(currentSessionId);
    } catch (error) {
      console.error("文件删除失败:", error);
      throw error;
    }
  };

  // 如果没有选中的会话，显示提示信息
  if (!currentSessionId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        选择或创建一个对话开始聊天
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表区域 */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            // 空消息提示
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-12">
              <h2 className="text-lg font-medium mb-2">开始一个新的对话</h2>
              <p className="text-sm text-center max-w-md">
                你可以问我任何问题，我会尽力帮助你。如果需要参考知识库中的内容，可以开启知识库搜索。
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={
                    isStreaming &&
                    message.id === messages[messages.length - 1].id
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
          {/* 错误提示 */}
          {error && <div className="text-sm text-destructive">{error}</div>}
        </div>
      </div>

      {/* 输入框区域 */}
      <div className="border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSend={(content, { useWebSearch, useVectorSearch }) => {
              sendStreamMessage(content, currentSessionId, {
                useWebSearch,
                useVectorSearch,
              });
            }}
            disabled={!currentSessionId}
            isLoading={isStreaming}
            onAbort={abortStream}
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            sessionId={currentSessionId}
          />
        </div>
      </div>
    </div>
  );
}
