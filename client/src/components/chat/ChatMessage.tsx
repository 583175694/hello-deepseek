// 导入必要的依赖
import {
  cn,
  copyToClipboard,
  downloadAsFile,
  generateTimestampFilename,
  formatUrlHostname,
} from "@/lib/utils";
import type { Message } from "@/types/chat";
import {
  Bot,
  Copy,
  User,
  Database,
  Globe,
  Check,
  ThumbsUp,
  ThumbsDown,
  Download,
  ChevronDown,
  ChevronRight,
  Trash2,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { chatService } from "@/lib/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import React from "react";

// 定义消息来源的接口
interface Source {
  type: string;
  url?: string;
}

// 定义组件的 Props 接口
interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean; // 是否正在流式传输消息
  onDelete?: (messageId: string) => void; // 添加删除回调
}

// 消息操作按钮组件
const MessageActions = React.memo(
  ({
    message,
    isStreaming,
    onDelete,
  }: {
    message: Message;
    isStreaming?: boolean;
    onDelete?: (messageId: string) => void;
  }) => {
    const [copied, setCopied] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const isAI = message.role === "assistant";

    const handleCopy = async () => {
      let textToCopy = "";
      if (isAI) {
        if (message.reasoning) {
          textToCopy += "思考过程：\n" + message.reasoning + "\n\n";
        }
        textToCopy += message.content;
      } else {
        textToCopy = message.content;
      }

      const success = await copyToClipboard(textToCopy);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    };

    const handleLike = () => {
      if (disliked) setDisliked(false);
      setLiked(!liked);
    };

    const handleDislike = () => {
      if (liked) setLiked(false);
      setDisliked(!disliked);
    };

    const handleDownload = () => {
      let content = "";
      if (message.reasoning) {
        content += "思考过程：\n" + message.reasoning + "\n\n";
      }
      content += message.content;

      const filename = generateTimestampFilename("ai-response", "docx");
      downloadAsFile(content, filename);
    };

    const handleDelete = async () => {
      try {
        await chatService.deleteMessage(message.id);
        onDelete?.(message.id);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("删除消息出错:", error);
      }
    };

    return (
      <>
        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleCopy}
            disabled={isStreaming}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          {isAI && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDownload}
                disabled={isStreaming}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleLike}
                disabled={isStreaming}
              >
                <ThumbsUp
                  className={cn(
                    "h-4 w-4",
                    liked && "stroke-[2.5] text-primary"
                  )}
                />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleDislike}
                disabled={isStreaming}
              >
                <ThumbsDown
                  className={cn(
                    "h-4 w-4",
                    disliked && "stroke-[2.5] text-primary"
                  )}
                />
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-foreground hover:text-foreground"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={isStreaming}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除消息</AlertDialogTitle>
              <AlertDialogDescription>
                此操作将永久删除该消息，删除后将无法恢复。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={handleDelete}
              >
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }
);
MessageActions.displayName = "MessageActions";

// 消息来源组件
const MessageSources = React.memo(({ sources }: { sources?: string }) => {
  if (!sources) return null;

  try {
    const sourcesData: Source[] = JSON.parse(sources);
    const uniqueSources = Array.from(
      new Set(sourcesData.map((source) => source.url))
    ).map((url) => sourcesData.find((source) => source.url === url)!);

    return (
      <div className="flex flex-col gap-2 ml-11 mt-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="h-px flex-grow bg-muted-foreground/20"></div>
          <span className="text-xs font-medium text-muted-foreground/60">
            引用来源
          </span>
          <div className="h-px flex-grow bg-muted-foreground/20"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {uniqueSources.map((source) => {
            if (source.type === "vector" || source.type === "temp") {
              return source.url ? (
                <span
                  key={source.url}
                  className="bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground px-3 py-1 rounded-md text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Database className="w-3 h-3" />
                  {source.url}
                </span>
              ) : null;
            }

            return (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground px-3 py-1 rounded-md text-xs flex items-center gap-1.5 transition-colors"
              >
                <Globe className="w-3 h-3" />
                {source.url ? formatUrlHostname(source.url) : "未知来源"}
              </a>
            );
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to parse sources:", error);
    toast.error("解析引用来源失败");
    return null;
  }
});
MessageSources.displayName = "MessageSources";

// 添加代码块组件
export const CodeBlock = React.memo(
  ({ children, language }: { children: string; language: string }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const code = String(children).replace(/\n$/, "");
    const isHtml = language.toLowerCase() === "html";

    const handleCopyCode = () => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setIsCopied(true);
        toast.success("已复制到剪贴板");
        setTimeout(() => setIsCopied(false), 1500);
      } catch (err) {
        console.error("Failed to copy code:", err);
        toast.error("复制失败");
      }
    };

    // HTML 预览弹窗
    const HtmlPreviewDialog = () => {
      if (!isHtml) return null;

      return (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-[800px] w-[90vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>HTML 预览</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[70vh] border rounded-md overflow-hidden">
              <iframe
                srcDoc={code}
                className="absolute inset-0 w-full h-full"
                sandbox="allow-scripts"
                title="HTML Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    };

    return (
      <div className="relative group">
        <div className="absolute right-2 top-2 flex gap-2">
          <button
            onClick={handleCopyCode}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
          >
            {isCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          {isHtml && (
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="max-w-full overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            PreTag="div"
            customStyle={{
              margin: 0,
              marginBottom: 0,
              padding: "1rem",
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
        <HtmlPreviewDialog />
      </div>
    );
  }
);
CodeBlock.displayName = "CodeBlock";

// AI消息内容组件
const AIMessageContent = React.memo(
  ({
    content,
    reasoning,
    status,
    isStreaming,
  }: {
    content: string;
    reasoning?: string;
    status?: string;
    isStreaming?: boolean;
  }) => {
    const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);

    return (
      <div className="flex flex-col space-y-2">
        {reasoning && (
          <div className="border-l-4 border-primary/30 pl-4 text-muted-foreground">
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setIsReasoningExpanded(!isReasoningExpanded)}
            >
              {isReasoningExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">思考过程</span>
            </div>
            <div
              className={cn(
                "transition-all duration-200 overflow-hidden",
                isReasoningExpanded
                  ? "max-h-[1600px] opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {`${reasoning}${isStreaming ? "▊" : ""}`}
              </ReactMarkdown>
            </div>
          </div>
        )}
        {isStreaming && status && (
          <div className="text-sm text-muted-foreground mb-2 animate-pulse">
            {status}
          </div>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {`${content}${isStreaming ? "▊" : ""}`}
        </ReactMarkdown>
      </div>
    );
  }
);
AIMessageContent.displayName = "AIMessageContent";

// 用户消息内容组件
const UserMessageContent = React.memo(({ content }: { content: string }) => {
  return <div className="whitespace-pre-wrap">{content}</div>;
});
UserMessageContent.displayName = "UserMessageContent";

export function ChatMessage({
  message,
  isStreaming,
  onDelete,
}: ChatMessageProps) {
  const isAI = message.role === "assistant";

  return (
    <div className="flex flex-col space-y-2 mt-6">
      <div
        className={cn(
          "flex gap-3 group",
          isAI ? "justify-start" : "justify-end"
        )}
      >
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col">
          <div
            className={cn(
              "rounded-2xl px-4 prose-sm py-2.5 max-w-[calc(100vw-5rem)] md:max-w-[45rem]",
              isAI
                ? "bg-muted dark:prose-invert prose-p:my-0 prose-pre:my-0 prose-pre:max-w-full prose-pre:overflow-x-auto"
                : "bg-primary text-primary-foreground"
            )}
          >
            {isAI ? (
              <AIMessageContent
                content={message.content}
                reasoning={message.reasoning}
                status={message.status}
                isStreaming={isStreaming}
              />
            ) : (
              <UserMessageContent content={message.content} />
            )}
          </div>

          <MessageActions
            message={message}
            isStreaming={isStreaming}
            onDelete={onDelete}
          />
        </div>

        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>

      <MessageSources sources={message.sources} />
    </div>
  );
}
