"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import { Send, Settings, Database, Globe, Paperclip, X } from "lucide-react";
import { cn } from "@/lib/utils";

// 定义临时文件类型
interface TempFile {
  name: string;
  path: string;
}

// 定义组件的 Props 接口
interface ChatInputProps {
  onSend: (
    content: string,
    options: { useWebSearch?: boolean; useVectorSearch?: boolean }
  ) => void;
  disabled?: boolean; // 是否禁用输入框
  isLoading?: boolean; // AI是否正在回复
  onAbort?: () => void; // 中断回复的回调函数
  onFileUpload?: (file: File) => Promise<TempFile>; // 修改为返回 Promise<TempFile>
  onFileRemove?: () => Promise<void>; // 添加文件删除回调
  sessionId?: string; // 添加会话ID
  onSearchProgressUpdate?: (step: number) => void; // 添加搜索进度更新回调
  onSearchProgressStart?: () => void; // 添加搜索开始回调
  onSearchProgressEnd?: () => void; // 添加搜索结束回调
}

// 在 ChatInputProps 接口下方添加新的类型定义
interface FeatureButton {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function ChatInput({
  onSend,
  disabled,
  isLoading,
  onAbort,
  onFileUpload,
  onFileRemove,
  onSearchProgressUpdate,
  onSearchProgressStart,
  onSearchProgressEnd,
}: ChatInputProps) {
  // 状态管理
  const [input, setInput] = useState(""); // 输入框内容
  const [useWebSearch, setUseWebSearch] = useState(true); // 是否启用网络搜索
  const [useVectorSearch, setUseVectorSearch] = useState(false); // 是否启用知识库搜索
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 文本框引用，用于调整高度
  const [tempFile, setTempFile] = useState<TempFile | null>(null); // 添加临时文件状态

  // 在其他 state 下方添加特性按钮数据
  const featureButtons: FeatureButton[] = [
    {
      id: "ai-writing",
      label: "AI写作",
      icon: <span className="text-lg">✍️</span>,
      onClick: () => console.log("AI写作"),
    },
    {
      id: "ocr",
      label: "智能OCR",
      icon: <span className="text-lg">📷</span>,
      onClick: () => console.log("智能OCR"),
    },
    {
      id: "doc-reading",
      label: "AI 阅读",
      icon: <span className="text-lg">📚</span>,
      onClick: () => console.log("文档精读"),
    },
    {
      id: "gen-ppt",
      label: "AI PPT创作",
      icon: <span className="text-lg">📊</span>,
      onClick: () => console.log("生成PPT"),
    },
    {
      id: "voice-understanding",
      label: "语音理解",
      icon: <span className="text-lg">🎤</span>,
      onClick: () => console.log("语音理解"),
    },
    {
      id: "video-understanding",
      label: "视频理解",
      icon: <span className="text-lg">🎥</span>,
      onClick: () => console.log("视频理解"),
    },
  ];

  // 监听输入内容变化，自动调整文本框高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 先重置高度
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // 设置新高度，最大 200px
    }
  }, [input]);

  // 处理消息发送
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled || isLoading) return;
    const trimmedInput = input.trim();
    setInput(""); // 清空输入框

    // 如果启用了网络搜索，先模拟搜索过程
    if (useWebSearch) {
      setTimeout(async () => {
        onSearchProgressStart?.();

        // 模拟搜索步骤
        const steps = [
          { duration: 500 }, // 启信宝
          { duration: 500 }, // 催收系统
          { duration: 500 }, // 知识库
          { duration: 500 }, // 外网
        ];

        for (let i = 0; i < steps.length; i++) {
          onSearchProgressUpdate?.(i);
          await new Promise((resolve) =>
            setTimeout(resolve, steps[i].duration)
          );
        }

        onSearchProgressEnd?.();
      }, 0);
    }
    // 发送实际消息
    onSend(trimmedInput, { useWebSearch, useVectorSearch });
  };

  // 处理快捷键：Enter 发送，Shift + Enter 换行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 处理文件上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      try {
        const uploadedFile = await onFileUpload(file);
        setTempFile(uploadedFile);
      } catch (error) {
        console.error("文件上传失败:", error);
        // 这里可以添加错误提示
      }
    }
    // 重置文件输入框的值
    e.target.value = "";
  };

  // 处理文件删除
  const handleFileRemove = async () => {
    if (onFileRemove) {
      try {
        await onFileRemove();
        setTempFile(null);
        // 重置文件输入框的值
        const fileInput = document.getElementById(
          "file-upload"
        ) as HTMLInputElement;
        if (fileInput) {
          fileInput.value = "";
        }
      } catch (error) {
        console.error("文件删除失败:", error);
        // 这里可以添加错误提示
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 添加特性导航栏 */}
      <div className="flex gap-2 px-1 pb-2 overflow-x-auto">
        {featureButtons.map((button) => (
          <button
            key={button.id}
            onClick={button.onClick}
            disabled={disabled || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 bg-secondary/50 hover:bg-secondary/80 rounded-full text-sm font-medium transition-colors"
          >
            {button.icon}
            <span>{button.label}</span>
          </button>
        ))}
      </div>
      {/* 显示临时文件 */}
      {tempFile && (
        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
          <Paperclip className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm flex-1 truncate">{tempFile.name}</span>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-4 w-4"
            onClick={handleFileRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

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

        {/* 添加文件上传按钮 */}
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
          accept=".pdf,.doc,.docx,.txt,.md"
          disabled={disabled || isLoading}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={disabled || isLoading}
          title="上传文档"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

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
            {useVectorSearch && isLoading ? "搜索中..." : "我的知识库"}
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
