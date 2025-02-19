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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
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

  // 检查是否在底部的函数
  const isAtBottom = () => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    const threshold = 10; // 允许10px的误差
    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  };

  // 处理滚动事件
  const handleScroll = () => {
    // 设置用户正在滚动
    setIsUserScrolling(true);

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 设置新的定时器，500ms 后认为用户停止滚动
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      setShouldAutoScroll(isAtBottom());
    }, 500);
  };

  // 添加滚动到底部的函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 在消息列表变化时滚动到底部
  useEffect(() => {
    // 当切换会话时，总是滚动到底部
    if (messages.length === 0) {
      setShouldAutoScroll(true);
      setIsUserScrolling(false);
    }

    // 只有当用户没有在滚动且应该自动滚动时，才执行滚动
    if (shouldAutoScroll && !isUserScrolling) {
      scrollToBottom();
    }
  }, [messages, currentSessionId, shouldAutoScroll, isUserScrolling]);

  // 监听滚动事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      // 清理定时器
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 当切换会话时，重置自动滚动状态
  useEffect(() => {
    setShouldAutoScroll(true);
    setIsUserScrolling(false);
  }, [currentSessionId]);

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
      {/* 左侧列表区域 - 在移动端默认隐藏 */}
      <div className="hidden lg:block w-[280px] border-r border-border h-[calc(100vh-72px)]">
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
          <div className="lg:hidden flex items-center justify-between p-4 pl-12 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              新建会话
            </Button>
          </div>

          {/* 消息列表区域 */}
          <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
            <div className="px-4 py-6">
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.length === 0 ? (
                  // 空消息提示
                  <div className="h-[60vh] lg:h-[80vh] flex flex-col items-center justify-center text-muted-foreground">
                    <div className="p-4 lg:p-8 rounded-lg text-center">
                      <h2 className="text-xl lg:text-2xl font-semibold mb-3">
                        开始一个新的对话
                      </h2>
                      <p className="text-sm lg:text-base mb-6 max-w-md mx-auto text-muted-foreground">
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
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mx-4 lg:mx-0">
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
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              欢迎使用 AI 助手
            </h2>
            <p className="text-sm lg:text-base mb-6 max-w-md mx-auto text-muted-foreground">
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
