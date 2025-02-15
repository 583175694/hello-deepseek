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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function getURLParameters(url: string): { [key: string]: string } {
  // 创建一个 URL 对象
  const urlObj = new URL(url);

  // 获取搜索参数（查询字符串）
  const searchParams = new URLSearchParams(urlObj.search);

  // 创建一个对象来存储参数
  const params: { [key: string]: string } = {};

  // 遍历所有参数并添加到对象中
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
}

interface Source {
  type: "vector" | "temp" | "web";
  url: string;
}

// 添加代码块组件
function CodeBlock({
  children,
  language,
}: {
  children: string;
  language: string;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCode = async () => {
    const code = String(children).replace(/\n$/, "");
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={handleCopyCode}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
      >
        {isCopied ? (
          <Check className="w-4 h-4" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
      <SyntaxHighlighter language={language} style={oneDark} PreTag="div">
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}

// 添加搜索状态接口
interface SearchState {
  qichacha: string[] | null;
  collection: string[] | null;
  knowledge: string[] | null;
  web: string[] | null;
}

// 定义组件的 Props 接口
interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  searchState?: SearchState;
}

export function ChatMessage({
  message,
  isStreaming,
  searchState,
}: ChatMessageProps) {
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

  // 渲染搜索进度
  const useRenderSearchProgress = () => {
    const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(
      {}
    );
    // 临时逻辑
    const urlparams = getURLParameters(window.location.href);
    if (urlparams.agentId !== "case-analysis") {
      return null;
    }
    if (!searchState) return null;
    const steps = [
      {
        id: "qichacha",
        title: "查询启信宝中...",
        result: searchState.qichacha,
      },
      {
        id: "collection",
        title: "查询催收管理系统中...",
        result: searchState.collection,
      },
      {
        id: "knowledge",
        title: "查询催收知识库中...",
        result: searchState.knowledge,
      },
      {
        id: "web",
        title: "查询外网信息中...",
        result: searchState.web,
      },
    ];

    // 切换 result 的显示/隐藏
    const toggleStep = (id: string) => {
      setExpandedSteps((prev) => ({
        ...prev,
        [id]: !prev[id], // 切换当前步骤的展开状态
      }));
    };

    return (
      <div className="flex flex-col space-y-2 mb-3 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50 rounded-lg p-3">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 transition-opacity duration-200",
              step.result ? "opacity-100" : "opacity-60"
            )}
          >
            {/* 状态图标 */}
            {step.result ? (
              <Check className="w-4 h-4 text-green-500 shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
            )}

            {/* 标题和结果 */}
            <div className="flex flex-col gap-1 min-w-0">
              <span
                className="text-sm font-medium text-foreground"
                onClick={() => toggleStep(step.id)}
              >
                {step.title}
              </span>
              {step.result && expandedSteps[step.id] && (
                // <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md break-words">
                //   {step.result}
                // </span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md break-words">
                  {step.result.map((item: string, index: number) => (
                    <span key={index} className="block">
                      {item}
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
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
                <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message.content
            ? message.content + (isStreaming ? "▊" : "")
            : "思考中..."}
        </ReactMarkdown>
      </div>
    );
  };

  // 渲染消息来源
  const renderSources = () => {
    if (!message.sources) return null;

    try {
      const sources: Source[] = JSON.parse(message.sources || "[]");
      let uniqueSources = Array.from(
        new Set(sources.map((source) => source.url))
      ).map((url) => sources.find((source) => source.url === url)!);
      // 临时逻辑
      const urlparams = getURLParameters(window.location.href);
      if (urlparams.agentId === "case-analysis") {
        uniqueSources = [
          {
            url: "https://www.163.com/dy/article/J3TOG8S005198SOQ.html",
            type: "vector",
          },
          {
            url: "https://www.chinabgao.com/freereport/96772.html",
            type: "vector",
          },
          {
            url: "https://www.163.com/dy/article/JGSFNBU505198SOQ.html",
            type: "vector",
          },
          { url: "https://xueqiu.com/8457709645/308276662", type: "vector" },
          { url: "https://zhuanlan.zhihu.com/p/659838413", type: "vector" },
        ];
      }

      return (
        <div className="flex flex-col gap-2 ml-11 mt-2">
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
                  {source.url
                    ? new URL(source.url).hostname.replace(/^www\./, "")
                    : "未知来源"}
                </a>
              );
            })}
          </div>
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
          {/* 搜索进度 */}
          {useRenderSearchProgress()}

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
