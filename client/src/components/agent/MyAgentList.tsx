import { Brain, Calendar, Clock } from "lucide-react";

interface MyAgentHistory {
  id: string;
  name: string;
  lastUsed: string;
  useCount: number;
  description: string;
}

// 模拟数据，实际应该从API获取
const mockHistoryData: MyAgentHistory[] = [
  {
    id: "1",
    name: "代码助手",
    lastUsed: "2024-03-20 14:30",
    useCount: 42,
    description: "专注于代码开发和问题解决的AI助手",
  },
  {
    id: "2",
    name: "数据分析师",
    lastUsed: "2024-03-19 16:45",
    useCount: 28,
    description: "协助数据分析和可视化的专业助手",
  },
];

export function MyAgentList() {
  return (
    <div className="space-y-4">
      {mockHistoryData.map((agent) => (
        <div
          key={agent.id}
          className="p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <h3 className="font-semibold">{agent.name}</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>使用 {agent.useCount} 次</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>最近使用: {agent.lastUsed}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{agent.description}</p>
        </div>
      ))}
    </div>
  );
}
