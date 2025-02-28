import { Button } from "@/components/ui/button";
import { Search, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const categories = [
  { id: "work", name: "工作" },
  { id: "study", name: "学习" },
  { id: "create", name: "创作" },
  { id: "draw", name: "绘画" },
  { id: "life", name: "生活" },
];

interface Agent {
  id?: string; // 智能体唯一标识
  title: string; // 智能体标题
  description: string; // 智能体描述
  views: string; // 访问量
  author: string; // 作者
  avatar?: string; // 头像URL（可选）
  category?: string; // 分类（可选）
  tags?: string[]; // 标签列表（可选）
  createdAt?: Date; // 创建时间（可选）
  updatedAt?: Date; // 更新时间（可选）
}

type AgentList = Agent[];

const agents: AgentList = [];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-muted/50 p-4 rounded-full mb-4">
        <Bot className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">功能开发中</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        智能体市场即将上线，敬请期待~
      </p>
    </div>
  );
}

export function AgentMarket() {
  const [activeCategory, setActiveCategory] = useState("work");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // TODO: 这里可以添加按分类筛选智能体的逻辑
    console.log("Selected category:", categoryId);
  };

  return (
    <div className="h-full p-4 lg:p-6 overflow-auto max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 pl-16 lg:pl-0">智能体</h1>
      <div className="py-6">
        {/* 搜索和分类区域 */}
        <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center mb-6">
          {/* 分类标签 */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                className={`border ${
                  category.id === activeCategory
                    ? "bg-black text-white hover:bg-black/90 hover:text-white border-black"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* 搜索框 */}
          <div className="relative w-full sm:w-auto min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              className="pl-10 bg-muted/50 w-full"
              placeholder="搜索智能体"
            />
          </div>
        </div>

        {/* 智能体列表 */}
        {agents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <AgentCard key={index} {...agent} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

function AgentCard({ title, description, views }: Agent) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{views}</span>
          <span>·</span>
        </div>
      </div>
    </div>
  );
}
