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
import { VariableSizeList, ListChildComponentProps } from "react-window";
import type { Message } from "@/types/chat";

// 定义消息列表项组件的数据类型
interface MessageItemData {
  messages: Message[];
  isStreaming: boolean;
  setSize: (index: number, size: number) => void;
}

const MessageItem = ({
  index,
  style,
  data,
}: ListChildComponentProps<MessageItemData>) => {
  const message = data.messages[index];
  const isLastMessage = index === data.messages.length - 1;
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itemRef.current) {
      // 获取实际渲染后的高度并更新
      const height = itemRef.current.getBoundingClientRect().height;
      data.setSize(index, height + 12); // 添加消息间距
    }
  }, [message.content, index, data.setSize, data]);

  return (
    <div style={{ ...style, height: "auto", width: "100%" }} ref={itemRef}>
      <div className="max-w-4xl mx-auto px-4 py-3 px-1">
        <ChatMessage
          message={message}
          isStreaming={data.isStreaming && isLastMessage}
        />
      </div>
    </div>
  );
};

export function ChatHistory() {
  const { currentSessionId, createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [hasTempDocs, setHasTempDocs] = useState(false);
  const [tempFiles, setTempFiles] = useState<TempFile[]>([]);
  const [isMobileListOpen, setIsMobileListOpen] = useState(false);
  const [listHeight, setListHeight] = useState(600); // 设置一个默认高度
  const messageListRef = useRef<VariableSizeList>(null);
  const sizeMap = useRef<{ [key: number]: number }>({});

  // 从 AI 聊天 hook 获取状态和方法
  const {
    messages,
    error,
    isStreaming,
    sendStreamMessage,
    setMessageList,
    abortStream,
  } = useAIChat();

  // 设置消息项的高度
  const setSize = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current[index] = size;
      if (messageListRef.current) {
        messageListRef.current.resetAfterIndex(index);
      }
    }
  }, []);

  // 获取消息项的高度
  const getSize = useCallback((index: number) => {
    return sizeMap.current[index] || 100; // 默认高度 100px
  }, []);

  // 计算消息列表的可用高度
  const calculateListHeight = useCallback(() => {
    // 减去顶部导航栏(56px)、底部输入框(88px)和其他边距(32px)的高度
    return window.innerHeight - 126;
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    // 初始化时计算实际高度
    setListHeight(window.innerHeight - 126);

    const handleResize = () => {
      const newHeight = calculateListHeight();
      setListHeight(newHeight);

      // 重置所有消息项的高度缓存
      sizeMap.current = {};
      if (messageListRef.current) {
        messageListRef.current.resetAfterIndex(0);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateListHeight]);

  // 当消息列表更新时，直接定位到最新消息，不使用动画
  useEffect(() => {
    if (messageListRef.current && messages.length > 0) {
      messageListRef.current.scrollToItem(messages.length - 1);
    }
  }, [messages]);

  // 当切换会话时，重置高度缓存
  useEffect(() => {
    sizeMap.current = {};
    setTimeout(() => {
      if (messageListRef.current) {
        messageListRef.current.resetAfterIndex(0);
      }
    }, 0);
  }, [currentSessionId]);

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

        // 在消息加载完成后，等待下一个渲染周期再滚动到底部
        setTimeout(() => {
          if (messageListRef.current && data.messages.length > 0) {
            messageListRef.current.scrollToItem(
              data.messages.length - 1,
              "end"
            );
          }
        }, 0);
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
          <div className="lg:hidden h-14 flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <div className="flex-1 overflow-hidden">
            <div className="w-full h-full flex justify-center">
              <div className="w-full relative">
                {messages.length === 0 ? (
                  // 空消息提示
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
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
                  <VariableSizeList
                    ref={messageListRef}
                    height={listHeight}
                    width="100%"
                    itemCount={messages.length}
                    itemSize={getSize}
                    itemData={{
                      messages,
                      isStreaming,
                      setSize,
                    }}
                    className="scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border/80 scrollbar-track-transparent"
                    style={{ overflowX: "hidden" }}
                  >
                    {MessageItem}
                  </VariableSizeList>
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

          {/* 底部输入区域 */}
          <div className="shrink-0 p-4 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
