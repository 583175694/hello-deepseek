"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Search, Send, Settings, Database } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ChatInputProps {
  onSend: (
    content: string,
    options: { useWebSearch?: boolean; useVectorSearch?: boolean }
  ) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [useWebSearch, setUseWebSearch] = useState(false);
  const [useVectorSearch, setUseVectorSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input, { useWebSearch, useVectorSearch });
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
          placeholder="发送消息..."
          disabled={disabled}
        />
        <Button type="submit" size="icon" disabled={disabled}>
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="web-search"
              checked={useWebSearch}
              onCheckedChange={(checked) => setUseWebSearch(checked as boolean)}
              disabled={disabled}
            />
            <label
              htmlFor="web-search"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
            >
              <Search className="w-4 h-4" />
              搜索
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="vector-search"
              checked={useVectorSearch}
              onCheckedChange={(checked) =>
                setUseVectorSearch(checked as boolean)
              }
              disabled={disabled}
            />
            <label
              htmlFor="vector-search"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
            >
              <Database className="w-4 h-4" />
              知识库
            </label>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="h-7" disabled={disabled}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
