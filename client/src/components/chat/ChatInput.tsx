"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  Send,
  Database,
  Globe,
  Paperclip,
  X,
  FileIcon,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModelSelector } from "./ModelSelector";
import { toast } from "sonner";

// 定义临时文件类型
interface TempFile {
  filename: string;
  type: string;
  size: number;
  createdAt: string;
}

// 定义组件的 Props 接口
interface ChatInputProps {
  onSend: (
    content: string,
    options: {
      useWebSearch?: boolean;
      useVectorSearch?: boolean;
      useTempDocSearch?: boolean;
      modelId?: string;
    }
  ) => void;
  disabled?: boolean; // 是否禁用输入框
  isLoading?: boolean; // AI是否正在回复
  onAbort?: () => void; // 中断回复的回调函数
  onFileUpload?: (file: File) => Promise<TempFile>; // 修改为返回 Promise<TempFile>
  onFileRemove?: () => Promise<void>; // 添加文件删除回调
  sessionId?: string; // 添加会话ID
  hasTempDocs?: boolean;
  tempDocs?: TempFile[];
}

export function ChatInput({
  onSend,
  disabled,
  isLoading,
  onAbort,
  onFileUpload,
  onFileRemove,
  hasTempDocs = false,
  tempDocs = [],
}: ChatInputProps) {
  // 状态管理
  const [input, setInput] = useState(""); // 输入框内容
  const [useWebSearch, setUseWebSearch] = useState(false); // 是否启用网络搜索
  const [useVectorSearch, setUseVectorSearch] = useState(false); // 是否启用知识库搜索
  const [selectedModelId, setSelectedModelId] = useState(
    "bytedance_deepseek_r1"
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 文本框引用，用于调整高度
  const [tempFiles, setTempFiles] = useState<TempFile[]>([]); // 添加临时文件状态
  const [isUploading, setIsUploading] = useState(false); // 添加上传状态

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
    onSend(input, {
      useWebSearch,
      useVectorSearch,
      useTempDocSearch: hasTempDocs,
      modelId: selectedModelId,
    });
    setInput(""); // 清空输入框
  };

  // 处理快捷键：Enter 发送，Shift + Enter 换行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果是 IME 输入状态，不处理回车键
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      if (tempFiles.length > 0) {
        e.target.value = "";
        return;
      }

      setIsUploading(true); // 开始上传时设置状态
      try {
        const uploadedFile = await onFileUpload(file);
        setTempFiles([uploadedFile]);
      } catch (error) {
        console.error("文件上传失败:", error);
        toast.error("文件上传失败");
      } finally {
        setIsUploading(false); // 上传完成后重置状态
      }
    }
    e.target.value = "";
  };

  // 处理文件删除
  const handleFileRemove = async () => {
    if (onFileRemove) {
      try {
        await onFileRemove();
        setTempFiles([]); // 直接清空文件列表
        // 重置文件输入框的值
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } catch (error) {
        console.error("文件删除失败:", error);
        toast.error("文件删除失败");
      }
    }
  };

  useEffect(() => {
    setTempFiles(tempDocs);
  }, [tempDocs]);

  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 显示临时文件 */}
      {tempFiles.length > 0 && (
        <div className="w-[320px] flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <FileIcon className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {tempFiles[0].filename}
            </div>
            <div className="text-xs text-muted-foreground">
              {(tempFiles[0].size / 1024).toFixed(2)} KB
            </div>
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
            onClick={handleFileRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* 显示上传状态 */}
      {isUploading && (
        <div className="w-[320px] flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg animate-pulse">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-muted-foreground/20 rounded w-3/4 mb-1"></div>
            <div className="h-4 bg-muted-foreground/20 rounded w-1/4"></div>
          </div>
        </div>
      )}

      {/* 输入框表单 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 1200))}
            onKeyDown={handleKeyDown}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 resize-none min-h-[40px] max-h-[200px] scrollbar-thin scrollbar-thumb-border/40 hover:scrollbar-thumb-border/60 scrollbar-track-transparent"
            placeholder={isLoading ? "AI 正在回复中..." : "发送消息..."}
            disabled={disabled || isLoading}
            rows={1}
            maxLength={1200}
          />
          {input.length > 0 && (
            <div className="absolute bottom-3 right-4 text-xs text-muted-foreground">
              {input.length}/1200
            </div>
          )}
        </div>

        {/* 添加文件上传按钮 */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls"
          disabled={disabled || isLoading || tempFiles.length > 0}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={disabled || isLoading || tempFiles.length > 0}
          title={tempFiles.length > 0 ? "已有上传的文件" : "上传文档"}
          className="hidden lg:inline-flex"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {isLoading ? (
          <Button type="button" size="icon" variant="outline" onClick={onAbort}>
            <span className="w-4 h-4">×</span>
          </Button>
        ) : (
          <Button type="submit" size="icon" disabled={disabled || isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        )}
      </form>

      {/* 功能按钮区域 */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* 模型选择器 */}
          <ModelSelector
            onModelChange={handleModelChange}
            disabled={disabled || isLoading}
          />

          {/* 网络搜索切换按钮 */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 gap-1 text-xs lg:text-sm",
              useWebSearch &&
                "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
            )}
            onClick={() => setUseWebSearch(!useWebSearch)}
            disabled={disabled || isLoading}
          >
            <Globe
              className={cn(
                "w-3 h-3 lg:w-4 lg:h-4",
                useWebSearch && "text-primary"
              )}
            />
            {useWebSearch && isLoading ? "搜索中..." : "联网搜索"}
          </Button>

          {/* 知识库搜索切换按钮 */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className={cn(
              "h-7 px-2 gap-1 text-xs lg:text-sm",
              useVectorSearch &&
                "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
            )}
            onClick={() => setUseVectorSearch(!useVectorSearch)}
            disabled={disabled || isLoading}
          >
            <Database
              className={cn(
                "w-3 h-3 lg:w-4 lg:h-4",
                useVectorSearch && "text-primary"
              )}
            />
            {useVectorSearch && isLoading ? "搜索中..." : "我的知识库"}
          </Button>

          {/* 移动端文件上传按钮 */}
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 gap-1 text-xs lg:hidden"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={disabled || isLoading}
          >
            <Paperclip className="w-3 h-3" />
            上传文件
          </Button>
        </div>
      </div>
    </div>
  );
}
