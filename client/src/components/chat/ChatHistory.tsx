"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { toast } from "sonner";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import Link from "next/link";

export function ChatHistory() {
  // 状态管理
  const { currentSessionId, createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hasTempDocs, setHasTempDocs] = useState(false);
  const [tempFiles, setTempFiles] = useState<TempFile[]>([]);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // 是否接近顶部
  const isNearTop = () => {
    const scrollTop = messagesRef.current?.scrollTop || 0;
    return scrollTop < 50;
  };

  // 当消息列表更新时,滚动到最新消息
  useEffect(() => {
    // 在以下情况滚动到底部：
    // 1. 正在流式传输且用户接近底部
    // 2. 不是在加载更多消息时（例如首次加载完成或切换会话）
    if (isStreaming && isNearBottom()) {
      scrollToBottom();
    } else if (!isStreaming && !isLoadingMore) {
      // 当不是加载更多消息时，应该滚动到底部
      // 这包括切换会话和首次加载完成的情况
      scrollToBottom();
    }
  }, [messages, isStreaming, isLoadingMore]);

  // 加载会话消息历史
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentSessionId) {
        setMessageList([]);
        setCurrentPage(1);
        setHasMore(true);
        return;
      }

      setIsLoading(true);
      try {
        const data = await chatService.getSessionMessages(currentSessionId, 1);
        setMessageList(data.messages);
        setHasTempDocs(Boolean(data.tempFiles?.length));
        setTempFiles(data.tempFiles || []);
        setCurrentPage(1);
        setHasMore(data.pagination?.hasMore || false);
      } catch (error) {
        console.error("加载消息历史失败:", error);
        toast.error("加载消息历史失败");
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [currentSessionId, setMessageList]);

  // 加载更多消息
  const loadMoreMessages = useCallback(async () => {
    if (!currentSessionId || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await chatService.getSessionMessages(
        currentSessionId,
        nextPage
      );

      // 记录当前滚动位置
      const scrollContainer = messagesRef.current;
      const scrollPosition = scrollContainer?.scrollTop || 0;
      const scrollHeight = scrollContainer?.scrollHeight || 0;

      // 将新加载的消息添加到消息列表的前面，确保没有重复的消息ID
      setMessageList((prevMessages) => {
        // 创建一个Set来存储已有的消息ID
        const existingIds = new Set(prevMessages.map((msg) => msg.id));

        // 过滤掉已经存在的消息，避免重复key错误
        const newMessages = data.messages.filter(
          (msg) => !existingIds.has(msg.id)
        );

        return [...newMessages, ...prevMessages];
      });

      setCurrentPage(nextPage);
      setHasMore(data.pagination?.hasMore || false);

      // 在下一个渲染周期后恢复滚动位置
      // 使用requestAnimationFrame确保DOM已更新
      requestAnimationFrame(() => {
        if (scrollContainer) {
          // 计算新增内容的高度差
          const newScrollHeight = scrollContainer.scrollHeight;
          const heightDifference = newScrollHeight - scrollHeight;

          // 调整滚动位置，保持相对位置不变
          scrollContainer.scrollTop = scrollPosition + heightDifference;
        }
      });
    } catch (error) {
      console.error("加载更多消息失败:", error);
      toast.error("加载更多消息失败");
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentSessionId, currentPage, hasMore, isLoadingMore, setMessageList]);

  // 监听滚动事件，检测是否需要加载更多消息
  useEffect(() => {
    const handleScroll = () => {
      // 只有在非流式传输状态下才触发加载更多
      if (
        isNearTop() &&
        hasMore &&
        !isLoadingMore &&
        !isLoading &&
        !isStreaming
      ) {
        loadMoreMessages();
      }
    };

    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, isStreaming, loadMoreMessages]);

  // 处理文件上传
  const handleFileUpload = async (file: File) => {
    if (!currentSessionId) {
      throw new Error("No active session");
    }

    if (tempFiles.length > 0) {
      throw new Error("已有上传的文件");
    }

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
      toast.error("文件删除失败");
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

  // 处理消息发送
  const handleSendMessage = (content: string, options: any) => {
    // 保存当前的临时文件信息
    const currentTempFiles =
      tempFiles.length > 0 ? JSON.stringify(tempFiles) : null;

    // 发送消息后，清除顶部的临时文件显示
    if (hasTempDocs) {
      setTempFiles([]);
      setHasTempDocs(false);
    }

    // 将临时文件信息添加到消息选项中
    const messageOptions = {
      ...options,
      tempFiles: currentTempFiles,
    };

    // 发送消息
    sendStreamMessage(content, currentSessionId!, messageOptions);
    setTimeout(() => {
      scrollToBottom();
    }, 10);
  };

  return (
    <div className="flex flex-row h-full">
      {/* 左侧列表区域 */}
      <div
        className={`
        lg:block lg:relative
        fixed inset-y-0 left-0
        h-full
        bg-background border-r border-border
        transform transition-all duration-300 ease-in-out
        ${
          isMobileListOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isSidebarCollapsed ? "lg:w-0 lg:border-r-0" : "lg:w-[280px]"}
        w-[280px]
        z-50
        overflow-hidden
      `}
      >
        <div
          className={`p-4 border-b border-border ${
            isSidebarCollapsed ? "lg:hidden" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              对话
            </h2>
            {/* 添加侧边栏收起/展开按钮 - 仅在大屏幕上显示 */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <PanelRightOpen className="h-4 w-4" />
            </Button>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full mt-2 bg-primary/90 hover:bg-primary transition-colors"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            新建会话
          </Button>
        </div>
        <div className={isSidebarCollapsed ? "lg:hidden" : ""}>
          <ChatList />
        </div>
      </div>
      {isSidebarCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 ml-4 mt-4"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      )}

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
              <div className="max-w-4xl w-full mx-auto px-4 py-8">
                {isLoadingMore && (
                  <div
                    ref={loadingMoreRef}
                    className="py-4 text-center text-sm text-muted-foreground"
                  >
                    加载更多消息...
                  </div>
                )}
                {!isLoadingMore && hasMore && isStreaming && (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    AI 正在回复中，暂停加载历史消息
                  </div>
                )}
                {!isLoadingMore && hasMore && !isStreaming && (
                  <div className="py-4 text-center text-sm text-muted-foreground">
                    上滑加载更多消息
                  </div>
                )}
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isStreaming={isStreaming && index === messages.length - 1}
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
                onSend={handleSendMessage}
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

          <div className="fixed bottom-0 w-full py-2 text-center text-sm text-muted-foreground backdrop-blur-sm">
            <Link
              href="https://beian.miit.gov.cn/"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              粤ICP备2025381895号
            </Link>
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
