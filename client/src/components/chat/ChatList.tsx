"use client";

import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";

export function ChatList() {
  const { chats, currentChatId, createChat, selectChat, deleteChat } = useChatStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button
          className="w-full"
          onClick={createChat}
        >
          <Plus className="w-4 h-4" />
          新对话
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 ${
              chat.id === currentChatId ? "bg-muted" : ""
            }`}
            onClick={() => selectChat(chat.id)}
          >
            <div className="flex flex-col">
              <span className="font-medium">{chat.title}</span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(chat.updatedAt), "MM/dd HH:mm")}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 