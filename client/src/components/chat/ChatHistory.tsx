"use client";

import { useEffect, useState, useRef } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { useSessionManager } from "@/contexts/SessionContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService, fileService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { ChatList } from "@/components/chat/ChatList";
import { CreateSessionDialog } from "@/components/chat/CreateSessionDialog";
import type { TempFile } from "@/types/api";

export function ChatHistory() {
  // 状态管理
  const { currentSessionId, createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hasTempDocs, setHasTempDocs] = useState(false);
  const [tempFiles, setTempFiles] = useState<TempFile[]>([]);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // 从 AI 聊天 hook 获取状态和方法
  const {
    messages,
    isStreaming,
    sendStreamMessage,
    setMessageList,
    abortStream,
  } = useAIChat();

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  // 是否接近底部
  const isNearBottom = () => {
    const scrollTop = messagesRef.current?.scrollTop || 0;
    const clientHeight = messagesRef.current?.clientHeight || 0;
    const scrollHeight = messagesRef.current?.scrollHeight || 0;
    return scrollTop + clientHeight >= scrollHeight - 40;
  };

  // 当消息列表更新时,滚动到最新消息
  useEffect(() => {
    if (isStreaming && isNearBottom()) {
      scrollToBottom();
    } else if (!isStreaming) {
      scrollToBottom();
    }
  }, [messages, isStreaming]);

  // 加载会话消息历史
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentSessionId) {
        setMessageList([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await chatService.getSessionMessages(currentSessionId);
        setMessageList(data.messages);
        setHasTempDocs(Boolean(data.tempFiles?.length));
        setTempFiles(data.tempFiles || []);
      } catch (error) {
        console.error("加载消息历史失败:", error);
      } finally {
        setIsLoading(false);
        // 在消息加载完成后滚动到底部
        setTimeout(scrollToBottom, 0);
      }
    };

    loadMessages();
  }, [currentSessionId, setMessageList]);

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!currentSessionId) {
      throw new Error("No active session");
    }

    if (tempFiles.length > 0) {
      throw new Error("已有上传的文件");
    }

    console.log("handleFileUpload", file);

    const result = await fileService.uploadTempFile(currentSessionId, file);
    const tempFile = {
      filename: file.name,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
    };

    setHasTempDocs(true);
    setTempFiles([tempFile]);

    return {
      ...tempFile,
      path: result.filePath,
    };
  };

  // 处理文件删除
  const handleFileRemove = async () => {
    if (!currentSessionId) return;
    try {
      await fileService.cleanupTempFiles(currentSessionId);
      setHasTempDocs(false);
      setTempFiles([]);
    } catch (error) {
      console.error("文件删除失败:", error);
      throw error;
    }
  };

  // 重置临时文档状态
  useEffect(() => {
    setHasTempDocs(false);
    setTempFiles([]);
  }, [currentSessionId]);

  // 处理消息删除
  const handleMessageDelete = (messageId: string) => {
    setMessageList(messages.filter((message) => message.id !== messageId));
  };

  return (
    <div className="flex flex-row h-full">
      {/* 左侧列表区域 */}
      <div
        className={`
        lg:block lg:w-[280px] lg:relative
        fixed inset-y-0 left-0
        w-[280px] h-full
        bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileListOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        z-50
      `}
      >
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
          {/* 移动端顶部操作栏 */}
          <div className="lg:hidden h-14 flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-20">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-24"
                onClick={() => setIsMobileListOpen(true)}
              >
                历史会话
              </Button>
              <Button
                size="sm"
                className="h-9 w-26 gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusIcon className="h-4 w-4" />
                创建新会话
              </Button>
            </div>
          </div>

          {/* 消息列表区域 */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border/80 scrollbar-track-transparent"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-sm text-muted-foreground">加载中...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground">
                <span>开始新的对话</span>
              </div>
            ) : (
              <div className="max-w-3xl w-full mx-auto px-4">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isStreaming={
                      isStreaming && index === messages.length - 1
                    }
                    onDelete={() => handleMessageDelete(message.id)}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* 底部输入区域 */}
          <div className="shrink-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={(content, options) => {
                  sendStreamMessage(content, currentSessionId, options);
                  setTimeout(() => {
                    scrollToBottom();
                  }, 10);
                }}
                disabled={!currentSessionId}
                isLoading={isStreaming}
                onAbort={abortStream}
                onFileUpload={handleFileUpload}
                onFileRemove={handleFileRemove}
                hasTempDocs={hasTempDocs}
                tempDocs={tempFiles}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              欢迎使用 AI 助手
            </h2>
            <p className="text-sm lg:text-base mb-6 max-w-md mx-auto text-muted-foreground">
              选择一个现有的对话或创建一个新的对话以开始聊天
            </p>
            <div className="flex flex-col gap-3 items-center lg:hidden">
              <Button
                size="lg"
                onClick={() => setIsCreateDialogOpen(true)}
                className="w-48 gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                创建新会话
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsMobileListOpen(true)}
                className="w-48"
              >
                历史会话
              </Button>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 hidden lg:inline-flex"
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

      {/* 移动端历史会话遮罩 */}
      {isMobileListOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileListOpen(false)}
        />
      )}
    </div>
  );
}
