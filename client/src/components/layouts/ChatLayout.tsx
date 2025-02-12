"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function ChatLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isChat = pathname === "/" || pathname === "/chat";

  return (
    <div className="flex h-screen">
      {/* 左侧导航栏 */}
      <div className="w-[72px] border-r flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl ${
            isChat ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => router.push("/chat")}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`w-12 h-12 rounded-xl ${
            !isChat ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => router.push("/knowledge")}
        >
          <Database className="w-5 h-5" />
        </Button>
      </div>

      {/* 左侧列表区域 - 仅在聊天页面显示 */}
      {isChat && (
        <div className="w-[280px] border-r border-border h-[calc(100vh-72px)]">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">对话</h2>
          </div>
          <ChatList />
        </div>
      )}

      {/* 右侧内容区域 */}
      <div className="flex-1">
        {isChat ? <ChatHistory /> : <KnowledgeBase />}
      </div>
    </div>
  );
}
