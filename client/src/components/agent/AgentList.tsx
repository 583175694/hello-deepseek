import {
  FileText,
  PresentationIcon,
  Pencil,
  BookOpen,
  FileSearch,
  Users,
  DollarSign,
  BarChart2,
  TrendingUp,
  AlertTriangle,
  Building2,
  Video,
  Headphones,
  Search,
  FileCheck,
  MessageSquare,
  FileQuestion,
  BrainCircuit,
  Database,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useSessionManager } from "@/contexts/SessionContext";

const categories = [
  "办公通用",
  "风险领域",
  "客群经营",
  "催收领域",
  "营销领域",
  "产品渠道",
  "金市领域",
  "经营管理",
  "研发及数据领域",
  "项目定制",
] as const;

type Category = (typeof categories)[number];

interface Agent {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  category: Category;
}

const agents: Agent[] = [
  // 办公通用
  {
    id: "ocr",
    name: "智能OCR",
    icon: FileText,
    desc: "智能识别图片文字",
    category: "办公通用",
  },
  {
    id: "ppt",
    name: "PPT创造",
    icon: PresentationIcon,
    desc: "一键生成精美PPT",
    category: "办公通用",
  },
  {
    id: "writing",
    name: "AI写作",
    icon: Pencil,
    desc: "智能创作各类文章",
    category: "办公通用",
  },
  {
    id: "reading",
    name: "AI阅读",
    icon: BookOpen,
    desc: "快速理解文章内容",
    category: "办公通用",
  },
  {
    id: "audio",
    name: "语音理解",
    icon: Headphones,
    desc: "深度理解语音内容",
    category: "办公通用",
  },
  {
    id: "video",
    name: "视频理解",
    icon: Video,
    desc: "智能分析视频内容",
    category: "办公通用",
  },

  // 风险领域
  {
    id: "contract",
    name: "合同审核智能体",
    icon: FileCheck,
    desc: "贸易合同背景资料搜索，查询，调查",
    category: "风险领域",
  },
  {
    id: "due-diligence",
    name: "尽调材料检查智能体",
    icon: Search,
    desc: "尽调报告内容搜集",
    category: "风险领域",
  },

  // 客群经营
  {
    id: "customer-analysis",
    name: "尽调材料分析智能体",
    icon: Users,
    desc: "客户经理尽调材料分析",
    category: "客群经营",
  },

  // 催收领域
  {
    id: "case-analysis",
    name: "案件分析智能体",
    icon: FileSearch,
    desc: "催员阅读总结辅助，企业调查",
    category: "催收领域",
  },

  // 营销领域
  {
    id: "marketing-insight",
    name: "营销数据洞察智能体",
    icon: TrendingUp,
    desc: "营销数据洞察",
    category: "营销领域",
  },

  // 产品渠道
  {
    id: "product-qa",
    name: "产品答疑智能体",
    icon: MessageSquare,
    desc: "产品知识答疑",
    category: "产品渠道",
  },
  {
    id: "product-analysis",
    name: "产品需求分析智能体",
    icon: FileQuestion,
    desc: "写需求，分析需求",
    category: "产品渠道",
  },

  // 金市领域
  {
    id: "market-inquiry",
    name: "询价助手智能体",
    icon: DollarSign,
    desc: "交易员询价",
    category: "金市领域",
  },

  // 经营管理
  {
    id: "operation-analysis",
    name: "数据分析智能体",
    icon: BarChart2,
    desc: "智能数据洞察",
    category: "经营管理",
  },

  // 研发及数据领域
  {
    id: "dev-assistant",
    name: "研发助手",
    icon: BrainCircuit,
    desc: "研发效能提升",
    category: "研发及数据领域",
  },
  {
    id: "data-assistant",
    name: "数据分析助手",
    icon: Database,
    desc: "数据分析与洞察",
    category: "研发及数据领域",
  },

  // 项目定制
  {
    id: "risk-report",
    name: "大额风险报告",
    icon: AlertTriangle,
    desc: "大额业务风控",
    category: "项目定制",
  },
  {
    id: "micro",
    name: "小微智能体",
    icon: Building2,
    desc: "小微企业服务",
    category: "项目定制",
  },
];

function AgentGrid({ agents }: { agents: Agent[] }) {
  const router = useRouter();
  const { createSession } = useSessionManager();

  const handleAgentClick = async (agent: Agent) => {
    // 创建新会话并获取会话ID
    await createSession({
      name: agent.name,
      type: "agent",
      agentId: agent.id,
    });

    // 跳转到新会话
    router.push(`/chat`);
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      {agents.map((agent) => {
        const Icon = agent.icon;
        return (
          <div
            key={agent.id}
            className="rounded-xl border bg-card p-6 cursor-pointer hover:border-primary/50 hover:bg-accent transition-colors"
            onClick={() => handleAgentClick(agent)}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">{agent.name}</h3>
                <p className="text-sm text-muted-foreground">{agent.desc}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AgentList() {
  return (
    <Tabs defaultValue="办公通用" className="w-full">
      <TabsList className="mb-8">
        {categories.map((category) => (
          <TabsTrigger key={category} value={category}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent key={category} value={category}>
          <AgentGrid
            agents={agents.filter((agent) => agent.category === category)}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
