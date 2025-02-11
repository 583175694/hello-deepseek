"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { FileManager } from "@/components/file/FileManager";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Files } from "lucide-react";

export function ChatLayout() {
  const [activeTab, setActiveTab] = useState<"chat" | "files">("chat");

  return (
    <div className="flex h-screen">
      <div className="w-[320px] border-r border-border bg-muted/10">
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <Button
              variant={activeTab === "chat" ? "secondary" : "ghost"}
              className="flex-1"
              onClick={() => setActiveTab("chat")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              对话
            </Button>
            <Button
              variant={activeTab === "files" ? "secondary" : "ghost"}
              className="flex-1"
              onClick={() => setActiveTab("files")}
            >
              <Files className="w-4 h-4 mr-2" />
              文件
            </Button>
          </div>
        </div>
        {activeTab === "chat" ? <ChatList /> : <FileManager />}
      </div>
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-4xl">
          <ChatHistory />
        </div>
      </div>
    </div>
  );
}
