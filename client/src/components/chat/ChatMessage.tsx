import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { Bot, Copy, RotateCcw, Share2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAI = message.role === "assistant";
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };
  
  const handleRetry = () => {
    // TODO: 实现重试逻辑
  };
  
  const handleShare = () => {
    // TODO: 实现分享逻辑
  };

  return (
    <div
      className={cn(
        "flex gap-3",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5" />
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <div
          className={cn(
            "max-w-[100%] rounded-2xl px-4 py-2.5 text-sm",
            isAI ? "bg-muted" : "bg-primary text-primary-foreground",
          )}
        >
          {message.content}
        </div>
        
        {isAI && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleRetry}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
} 