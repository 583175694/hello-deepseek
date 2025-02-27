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
  Share2,
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

// 添加代码块组件
function CodeBlock({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
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

export function ChatMessage({
  message,
  isStreaming,
  onDelete,
}: ChatMessageProps) {
  // 判断消息是否来自 AI
  const isAI = message.role === "assistant";
  // 复制状态管理
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // 处理复制消息内容
  const handleCopy = async () => {
    // 构建要复制的文本
    let textToCopy = "";

    if (isAI) {
      // 如果是 AI 消息，包含思考过程（如果有）
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

  // 处理分享
  const handleShare = async () => {
    try {
      await navigator.share({
        title: "AI 对话分享",
        text: message.content,
      });
    } catch {
      await navigator.clipboard.writeText(message.content);
      toast.success("已复制到剪贴板");
    }
  };

  // 处理点赞和点踩
  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  // 处理下载为Word文档
  const handleDownload = () => {
    // 构建要下载的内容
    let content = "";
    if (message.reasoning) {
      content += "思考过程：\n" + message.reasoning + "\n\n";
    }
    content += message.content;

    const filename = generateTimestampFilename("ai-response", "docx");
    downloadAsFile(content, filename);
  };

  // 处理删除消息
  const handleDelete = async () => {
    try {
      await chatService.deleteMessage(message.id);
      onDelete?.(message.id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("删除消息出错:", error);
    }
  };

  // 渲染消息内容
  const renderMessageContent = () => {
    if (!isAI) {
      // 用户消息直接显示，保留换行
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }

    // AI 消息使用 Markdown 渲染
    return (
      <div className="flex flex-col space-y-2">
        {message.reasoning && (
          // 渲染思考过程，使用左边框突出显示
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
                {`${message.reasoning}${isStreaming ? "▊" : ""}`}
              </ReactMarkdown>
            </div>
          </div>
        )}
        {/* 显示状态信息 */}
        {isStreaming && message.status && (
          <div className="text-sm text-muted-foreground mb-2 animate-pulse">
            {message.status}
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
          {`${message.content}${isStreaming ? "▊" : ""}`}
        </ReactMarkdown>
      </div>
    );
  };

  // 渲染消息来源
  const renderSources = () => {
    if (!message.sources) return null;

    try {
      const sources: Source[] = JSON.parse(message.sources || "[]");
      const uniqueSources = Array.from(
        new Set(sources.map((source) => source.url))
      ).map((url) => sources.find((source) => source.url === url)!);

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
  };

  // 渲染交互按钮组
  const renderInteractionButtons = () => {
    return (
      <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* 所有消息都显示的按钮 */}
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

        {/* AI 消息特有的按钮 */}
        {isAI && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleShare}
              disabled={isStreaming}
            >
              <Share2 className="h-4 w-4" />
            </Button>

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
                className={cn("h-4 w-4", liked && "stroke-[2.5] text-primary")}
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

        {/* 删除按钮 - 对所有消息都显示 */}
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
    );
  };

  // 渲染整个消息组件
  return (
    <>
      <div className="flex flex-col space-y-2 mt-6">
        {/* 消息主体部分 */}
        <div
          className={cn(
            "flex gap-3 group",
            isAI ? "justify-start" : "justify-end"
          )}
        >
          {/* AI 头像 */}
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
              {/* 消息内容 */}
              {renderMessageContent()}
            </div>

            {/* 交互按钮组 */}
            {renderInteractionButtons()}
          </div>

          {/* 用户头像 */}
          {!isAI && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* 渲染消息来源 */}
        {renderSources()}
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
