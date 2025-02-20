"use client";

import { Fragment, useEffect, useState } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { useSessionManager } from "@/contexts/SessionContext";
import { useScrollToBottom } from "@/hooks/useScrollToBottom";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService, fileService } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { ChatList } from "@/components/chat/ChatList";
import { CreateSessionDialog } from "@/components/chat/CreateSessionDialog";
import type { TempFile } from "@/types/api";

export function ChatHistory() {
  const { currentSessionId, createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hasTempDocs, setHasTempDocs] = useState(false);
  const [tempFiles, setTempFiles] = useState<TempFile[]>([]);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);

  // 从 AI 聊天 hook 获取状态和方法
  const {
    messages,
    error,
    isStreaming,
    sendStreamMessage,
    setMessageList,
    abortStream,
  } = useAIChat();

  // 使用滚动 hook
  const { messagesEndRef, scrollContainerRef, setShouldAutoScroll } =
    useScrollToBottom([messages, isStreaming], {
      threshold: 100,
      behavior: "smooth",
    });

  // 加载会话消息历史
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentSessionId) return;

      try {
        const data = await chatService.getSessionMessages(currentSessionId);
        setMessageList(data.messages);
        // 设置临时文件状态
        setHasTempDocs(Boolean(data.tempFiles?.length));
        setTempFiles(data.tempFiles || []);
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

    // 如果已经有文件，先不允许上传
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
    // 设置新的临时文件
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
      // 统一使用cleanupTempFiles来删除文件
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
    setTempFiles([]); // 重置临时文件列表
  }, [currentSessionId]);

  // 当切换会话时，重置自动滚动状态
  useEffect(() => {
    setShouldAutoScroll(true);
  }, [currentSessionId, setShouldAutoScroll]);

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
          <div className="lg:hidden flex items-center justify-between px-20 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setIsMobileListOpen(true)}
              >
                历史会话
              </Button>
              <div className="h-4 w-px bg-border" />
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                新建会话
              </Button>
            </div>
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

          {/* 底部输入区域 */}
          <div className="p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-3xl mx-auto">
              <ChatInput
                onSend={(content, options) => {
                  sendStreamMessage(content, currentSessionId, options);
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
