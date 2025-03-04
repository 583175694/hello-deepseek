"use client";

import { ChatHistory } from "@/components/chat/ChatHistory";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Database,
  Presentation,
  Bot,
  FileText,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useSessionManager } from "@/contexts/SessionContext";
import { CreateSessionDialog } from "@/components/chat/CreateSessionDialog";
import logo from "@/assets/images/logo.png";
import Image from "next/image";
import { PPTGenerator } from "@/components/ppt/PPTGenerator";
import { AgentMarket } from "@/components/agent/AgentMarket";
import { AIReading } from "@/components/reading/AIReading";

export function Layout() {
  const router = useRouter();
  const pathname = usePathname();
  const isChat = pathname === "/" || pathname === "/chat";
  const isKnowledge = pathname === "/knowledge";
  const isPPT = pathname === "/ppt";
  const isAgent = pathname === "/agent";
  const isReading = pathname === "/reading";
  const { createNewSession } = useSessionManager();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* 移动端菜单按钮 */}
      <button
        className="lg:hidden fixed top-2 left-4 z-50 p-3 rounded-lg bg-background border shadow-sm hover:bg-accent/50 transition-colors"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span
            className={`w-full h-0.5 bg-foreground transition-transform duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
            }`}
          />
          <span
            className={`w-full h-0.5 bg-foreground transition-opacity duration-300 ${
              isMobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`w-full h-0.5 bg-foreground transition-transform duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
            }`}
          />
        </div>
      </button>

      {/* 左侧导航栏 */}
      <div
        className={`
        fixed lg:relative
        w-[180px] lg:w-[144px]
        h-screen
        border-r
        flex flex-col items-center
        gap-2
        bg-background
        shadow-lg lg:shadow-none
        transition-all duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        z-40
      `}
      >
        <div className="h-14 lg:hidden" /> {/* 移动端顶部空间 */}
        <Image src={logo} width={144} height={144} alt="量子皮皮虾" />
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            isChat ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => {
            router.push("/chat");
            setIsMobileMenuOpen(false);
          }}
        >
          <MessageSquare className="w-5 h-5" />
          <span>对话</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            isKnowledge ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => {
            router.push("/knowledge");
            setIsMobileMenuOpen(false);
          }}
        >
          <Database className="w-5 h-5" />
          <span>知识库</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            isReading ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => {
            router.push("/reading");
            setIsMobileMenuOpen(false);
          }}
        >
          <FileText className="w-5 h-5" />
          <span>AI 阅读</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            isPPT ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => {
            router.push("/ppt");
            setIsMobileMenuOpen(false);
          }}
        >
          <Presentation className="w-5 h-5" />
          <span>AI PPT</span>
        </Button>
        <Button
          variant="ghost"
          className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
            isAgent ? "bg-accent" : "hover:bg-accent/50"
          }`}
          onClick={() => {
            router.push("/agent");
            setIsMobileMenuOpen(false);
          }}
        >
          <Bot className="w-5 h-5" />
          <span>智能体</span>
        </Button>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1">
        {isChat ? (
          <ChatHistory />
        ) : isKnowledge ? (
          <KnowledgeBase />
        ) : isPPT ? (
          <PPTGenerator />
        ) : isAgent ? (
          <AgentMarket />
        ) : isReading ? (
          <AIReading />
        ) : null}
      </div>

      {/* 移动端菜单遮罩 */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <CreateSessionDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateSession={createNewSession}
      />
    </div>
  );
}
