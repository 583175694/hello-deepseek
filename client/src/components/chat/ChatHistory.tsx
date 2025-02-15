"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { useSessionManager } from "@/contexts/SessionContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService, fileService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { ChatList } from "@/components/chat/ChatList";
import { CreateSessionDialog } from "@/components/chat/CreateSessionDialog";

export function ChatHistory() {
  // 添加消息容器的引用
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSessionId, createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

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

  return (
    <div className="flex flex-row h-full">
      {/* 左侧列表区域 */}
      <div className="w-[280px] border-r border-border h-[calc(100vh-72px)]">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">对话</h2>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              新建会话
            </Button>
          </div>
        </div>
        <ChatList />
      </div>

      {currentSessionId ? (
        <div className="flex-1 flex flex-col h-full">
          {/* 消息列表区域 */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6">
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  // 空消息提示
                  <div className="h-[80vh] flex flex-col items-center justify-center text-muted-foreground">
                    <div className="p-8 rounded-lg text-center">
                      <h2 className="text-2xl font-semibold mb-3">
                        开始一个新的对话
                      </h2>
                      <p className="text-base mb-6 max-w-md mx-auto text-muted-foreground">
                        你可以问我任何问题，我会尽力帮助你。如果需要参考知识库中的内容，可以开启知识库搜索。
                      </p>
                    </div>
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
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 输入框区域 */}
          <div className="flex-shrink-0 border-t border-border bg-background">
            <div className="max-w-3xl mx-auto px-4 py-4">
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
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-3">欢迎使用 AI 助手</h2>
            <p className="text-base mb-6 max-w-md mx-auto text-muted-foreground">
              选择一个现有的对话或创建一个新的对话以开始聊天
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              创建新会话
            </Button>
          </div>
        </div>
      )}

      <CreateSessionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSession={createNewSession}
      />
    </div>
  );
}
