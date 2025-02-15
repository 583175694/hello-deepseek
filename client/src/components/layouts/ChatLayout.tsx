"use client";

import { ChatList } from "@/components/chat/ChatList";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { KnowledgeBase } from "@/components/knowledge/KnowledgeBase";
import { AgentList } from "@/components/agent/AgentList";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import webankLogo from "@/assets/img/webank_logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MessageSquare,
  Database,
  Brain,
  LogOut,
  MessageCircle,
  User2,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { MyAgentList } from "@/components/agent/MyAgentList";

export function ChatLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const isChat = pathname === "/" || pathname === "/chat";
  const isKnowledge = pathname === "/knowledge";
  const isAgent = pathname === "/agent";
  const isMyAgent = pathname === "/my-agent";

  return (
    <div className="flex h-screen">
      {/* 左侧导航栏 */}
      <div className="w-[144px] border-r flex flex-col items-center py-4">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <Image
            src={webankLogo}
            alt="Webank"
            width={32}
            height={32}
            priority
          />
          <span className="font-semibold text-sm">CIB智能应用平台</span>
        </div>

        {/* 导航按钮 */}
        <div className="flex flex-col gap-2">
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
              isKnowledge ? "bg-accent" : "hover:bg-accent/50"
            }`}
            onClick={() => router.push("/knowledge")}
          >
            <Database className="w-5 h-5" />
            <span>知识库</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
              isAgent ? "bg-accent" : "hover:bg-accent/50"
            }`}
            onClick={() => router.push("/agent")}
          >
            <Brain className="w-5 h-5" />
            <span>智能体</span>
          </Button>
          <Button
            variant="ghost"
            className={`w-32 h-12 rounded-xl flex items-center gap-2 ${
              isMyAgent ? "bg-accent" : "hover:bg-accent/50"
            }`}
            onClick={() => router.push("/my-agent")}
          >
            <User2 className="w-5 h-5" />
            <span>我的智能体</span>
          </Button>
        </div>

        {/* 用户头像和下拉菜单 */}
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-12 rounded-xl px-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center">
                  <User2 className="w-4 h-4" />
                </div>
                <span className="text-sm">admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                <span>登出</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>我要反馈</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
        {isChat ? (
          <ChatHistory />
        ) : isKnowledge ? (
          <KnowledgeBase />
        ) : isAgent ? (
          <div className="h-full p-6">
            <h1 className="text-2xl font-semibold mb-6">智能体</h1>
            <AgentList />
          </div>
        ) : isMyAgent ? (
          <div className="h-full p-6">
            <h1 className="text-2xl font-semibold mb-6">我的智能体</h1>
            <MyAgentList />
          </div>
        ) : null}
      </div>
    </div>
  );
}
