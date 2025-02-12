import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { Bot, Copy, RotateCcw, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect } from "react";

interface ChatMessageProps {
  message: Message;
  type: "content" | "reasoning" | "sources";
  isStreaming?: boolean;
  onRetry?: () => void;
  onShare?: () => void;
}

export function ChatMessage({
  message,
  type,
  isStreaming,
  onRetry,
  onShare,
}: ChatMessageProps) {
  const isAI = message.role === "assistant";
  const [content, setContent] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [sources, setSources] = useState<string[]>([]);

  useEffect(() => {
    // 根据type更新对应的状态，但不清空其他状态
    if (type === "content") {
      setContent(message.content);
    } else if (type === "reasoning") {
      setReasoning(message.content);
    } else if (type === "sources") {
      setSources(message.content.split("\n").filter(Boolean));
    }
  }, [message.content, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const renderMessageContent = () => {
    return (
      <div className="flex flex-col gap-2">
        {reasoning && (
          <div className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {reasoning + (isStreaming && type === "reasoning" ? "▊" : "")}
            </ReactMarkdown>
          </div>
        )}
        {content && (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content + (isStreaming && type === "content" ? "▊" : "")}
          </ReactMarkdown>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className={cn("flex gap-3", isAI ? "justify-start" : "justify-end")}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div
            className={cn(
              "max-w-[100%] rounded-2xl px-4 py-2.5",
              isAI
                ? "bg-muted prose dark:prose-invert prose-sm max-w-none"
                : "bg-primary text-primary-foreground prose-sm max-w-none"
            )}
          >
            {isAI ? renderMessageContent() : message.content}
          </div>

          {isAI && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
                disabled={isStreaming}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onRetry}
                disabled={isStreaming}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onShare}
                disabled={isStreaming}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
        )}
      </div>

      {sources.length > 0 && (
        <div className="flex flex-wrap gap-2 ml-11">
          {sources.map((source, index) => (
            <div
              key={index}
              className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs"
            >
              {source}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
