import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { Bot, Copy, RotateCcw, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  onRetry?: () => void;
  onShare?: () => void;
}

export function ChatMessage({
  message,
  isStreaming,
  onRetry,
  onShare,
}: ChatMessageProps) {
  const isAI = message.role === "assistant";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
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
          {isAI ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content + (isStreaming ? "▊" : "")}
            </ReactMarkdown>
          ) : (
            message.content
          )}
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
  );
}
