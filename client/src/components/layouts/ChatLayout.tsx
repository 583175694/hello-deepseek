"use client";

import { ChatHistory } from "@/components/chat/ChatHistory";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useSessionManager } from "@/contexts/SessionContext";
import { CreateSessionDialog } from "@/components/chat/CreateSessionDialog";

export function ChatLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isChat = pathname === "/" || pathname === "/chat";
  const { createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* 左侧导航栏 */}
      <div className="w-[144px] border-r flex flex-col items-center py-4 gap-2">
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            isChat ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => router.push("/chat")}
        >
          <MessageSquare className="w-5 h-5" />
          <span>对话</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            !isChat ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => router.push("/knowledge")}
        >
          <Database className="w-5 h-5" />
          <span>知识库</span>
        </Button>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1">
        {isChat ? <ChatHistory /> : <KnowledgeBase />}
      </div>

      <CreateSessionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSession={createNewSession}
      />
    </div>
  );
}
