// 导入必要的依赖
import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import {
  Bot,
  Copy,
  User,
  Database,
  Globe,
  Check,
  RefreshCw,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// 定义消息来源的接口
interface Source {
  type: string;
  url?: string;
}

// 定义组件的 Props 接口
interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean; // 是否正在流式传输消息
}

export function ChatMessage({ message, isStreaming }: ChatMessageProps) {
  // 判断消息是否来自 AI
  const isAI = message.role === "assistant";
  // 复制状态管理
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

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

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      // 1.5秒后重置复制状态
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  // 处理刷新
  const handleRefresh = () => {
    console.log("刷新回答");
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
      alert("已复制到剪贴板");
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

    // 生成时间戳
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    // 创建Blob对象
    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-response_${timestamp}.docx`;
    document.body.appendChild(a);
    a.click();

    // 清理
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.reasoning + (isStreaming ? "▊" : "")}
            </ReactMarkdown>
          </div>
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={oneDark}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content + (isStreaming ? "▊" : "")}
        </ReactMarkdown>
      </div>
    );
  };

  // 渲染消息来源
  const renderSources = () => {
    if (!message.sources) return null;

    try {
      // 解析消息来源
      const sources: Source[] = JSON.parse(message.sources);

      // 使用 Set 进行去重，以 url 为唯一标识
      const uniqueSources = Array.from(
        new Set(sources.map((source) => source.url))
      ).map((url) => sources.find((source) => source.url === url)!);

      return (
        <div className="flex flex-wrap gap-2 ml-11">
          {uniqueSources.map((source) => {
            // 渲染本地知识库来源
            if (source.type === "vector") {
              return source.url ? (
                <span
                  key={source.url}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  <Database className="w-3 h-3" />
                  {source.url}
                </span>
              ) : null;
            }

            // 渲染网络链接来源
            return (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1"
              >
                <Globe className="w-3 h-3" />
                {source.url
                  ? new URL(source.url).hostname.replace(/^www\./, "")
                  : "未知来源"}
              </a>
            );
          })}
        </div>
      );
    } catch (error) {
      console.error("Failed to parse sources:", error);
      return null;
    }
  };

  // 渲染整个消息组件
  return (
    <div className="flex flex-col space-y-2">
      {/* 消息主体部分 */}
      <div className={cn("flex gap-3", isAI ? "justify-start" : "justify-end")}>
        {/* AI 头像 */}
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col">
          {/* 消息内容 */}
          <div
            className={cn(
              "rounded-2xl px-4 prose-sm py-2.5",
              isAI
                ? "bg-muted dark:prose-invert prose-p:my-0 prose-pre:my-0"
                : "bg-primary text-primary-foreground"
            )}
          >
            {renderMessageContent()}
          </div>

          {/* 交互按钮组 */}
          {isAI && (
            <div className="flex gap-1 mt-1">
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

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleRefresh}
                disabled={isStreaming}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

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
                className={cn("h-7 w-7", liked && "text-green-500")}
                onClick={handleLike}
                disabled={isStreaming}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn("h-7 w-7", disliked && "text-red-500")}
                onClick={handleDislike}
                disabled={isStreaming}
              >
                <ThumbsDown className="h-4 w-4" />
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
            </div>
          )}
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
  );
}
