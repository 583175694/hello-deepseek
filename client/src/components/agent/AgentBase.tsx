"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Bot, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { CreateAgentDialog } from "./CreateAgentDialog";

interface Agent {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  type: "assistant" | "function" | "custom";
}

export function AgentBase() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "文章助手",
      description: "帮助你写作和润色文章",
      createdAt: new Date().toISOString(),
      type: "assistant",
    },
    {
      id: "2",
      name: "代码助手",
      description: "帮助你编写和优化代码",
      createdAt: new Date().toISOString(),
      type: "function",
    },
  ]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateAgent = (agent: Omit<Agent, "id" | "createdAt">) => {
    const newAgent: Agent = {
      ...agent,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setAgents([...agents, newAgent]);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId));
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null);
    }
  };

  return (
    <div className="flex h-screen">
      {/* 左侧智能体列表 */}
      <div className="w-[280px] border-r flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">智能体</h2>
            <Button size="sm" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建智能体
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {agents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
              暂无智能体
            </div>
          ) : (
            <div className="divide-y">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 group ${
                    selectedAgent?.id === agent.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">{agent.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(agent.createdAt), "MM/dd HH:mm")}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAgent(agent.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div className="flex-1 p-6">
        {selectedAgent ? (
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{selectedAgent.name}</h1>
                <p className="text-muted-foreground">
                  {selectedAgent.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 这里可以添加智能体的具体功能卡片 */}
              <div className="p-4 rounded-lg border hover:border-foreground/20 cursor-pointer transition-colors">
                <h3 className="font-medium mb-2">对话</h3>
                <p className="text-sm text-muted-foreground">
                  与智能体进行自然语言对话
                </p>
              </div>
              <div className="p-4 rounded-lg border hover:border-foreground/20 cursor-pointer transition-colors">
                <h3 className="font-medium mb-2">知识库</h3>
                <p className="text-sm text-muted-foreground">
                  管理智能体的专属知识库
                </p>
              </div>
              <div className="p-4 rounded-lg border hover:border-foreground/20 cursor-pointer transition-colors">
                <h3 className="font-medium mb-2">设置</h3>
                <p className="text-sm text-muted-foreground">
                  自定义智能体的行为和参数
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Bot className="w-12 h-12 mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">选择或创建智能体</h2>
            <p className="text-muted-foreground mb-6">
              从左侧列表选择一个智能体，或者创建新的智能体开始使用
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新建智能体
            </Button>
          </div>
        )}
      </div>

      <CreateAgentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateAgent={handleCreateAgent}
      />
    </div>
  );
}
