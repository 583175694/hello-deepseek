"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Send, Settings } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "search">("chat");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
          placeholder={mode === "chat" ? "发送消息..." : "搜索内容..."}
          disabled={disabled}
        />
        <Button type="submit" size="icon" disabled={disabled}>
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === "chat" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("chat")}
            className="h-7"
            disabled={disabled}
          >
            DeepThink
          </Button>
          <Button
            variant={mode === "search" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setMode("search")}
            className="h-7"
            disabled={disabled}
          >
            <Search className="w-4 h-4 mr-1" />
            搜索
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-7"
          disabled={disabled}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
} 