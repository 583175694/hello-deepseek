"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Send, Settings, Database, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// 定义组件的 Props 接口
interface ChatInputProps {
  onSend: (
    content: string,
    options: { useWebSearch?: boolean; useVectorSearch?: boolean }
  ) => void;
  disabled?: boolean; // 是否禁用输入框
  isLoading?: boolean; // AI是否正在回复
  onAbort?: () => void; // 中断回复的回调函数
}

export function ChatInput({
  onSend,
  disabled,
  isLoading,
  onAbort,
}: ChatInputProps) {
  // 状态管理
  const [input, setInput] = useState(""); // 输入框内容
  const [useWebSearch, setUseWebSearch] = useState(false); // 是否启用网络搜索
  const [useVectorSearch, setUseVectorSearch] = useState(false); // 是否启用知识库搜索
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 文本框引用，用于调整高度

  // 监听输入内容变化，自动调整文本框高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 先重置高度
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // 设置新高度，最大 200px
    }
  }, [input]);

  // 处理消息发送
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || isLoading) return;

    // 发送消息，包含搜索选项
    onSend(input, { useWebSearch, useVectorSearch });
    setInput(""); // 清空输入框
  };

  // 处理快捷键：Enter 发送，Shift + Enter 换行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 输入框表单 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-none min-h-[40px] max-h-[200px]"
            placeholder={
              isLoading
                ? "AI 正在回复中..."
                : "发送消息... (Shift + Enter 换行)"
            }
            disabled={disabled || isLoading}
            rows={1}
          />
        </div>
        {isLoading ? (
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={onAbort}
          >
            <span className="w-4 h-4">×</span>
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={disabled || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        )}
      </form>

      {/* 功能按钮区域 */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {/* 网络搜索切换按钮 */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 gap-1",
              useWebSearch &&
                "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
            )}
            onClick={() => setUseWebSearch(!useWebSearch)}
            disabled={disabled || isLoading}
          >
            <Globe className={cn("w-4 h-4", useWebSearch && "text-primary")} />
            {useWebSearch && isLoading ? "搜索中..." : "联网搜索"}
          </Button>

          {/* 知识库搜索切换按钮 */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 gap-1",
              useVectorSearch &&
                "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
            )}
            onClick={() => setUseVectorSearch(!useVectorSearch)}
            disabled={disabled || isLoading}
          >
            <Database
              className={cn("w-4 h-4", useVectorSearch && "text-primary")}
            />
            {useVectorSearch && isLoading ? "搜索中..." : "知识库"}
          </Button>
        </div>

        {/* 设置按钮 */}
        <Button
          variant="ghost"
          size="sm"
          className="h-7"
          disabled={disabled || isLoading}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
