"use client";

import { FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalKnowledge } from "./PersonalKnowledge";
import { Building2, Ban } from "lucide-react";

const cibKnowledgeData = [
  {
    id: "1",
    title: "CIB业务手册2024",
    type: "PDF",
    size: "2.5MB",
    date: "2024-02-14",
  },
  {
    id: "2",
    title: "企业金融产品白皮书",
    type: "PDF",
    size: "1.8MB",
    date: "2024-02-10",
  },
  {
    id: "3",
    title: "交易银行业务指南",
    type: "PDF",
    size: "3.2MB",
    date: "2024-02-08",
  },
];

const bankKnowledgeData = [
  {
    id: "1",
    title: "全行制度汇编2024",
    type: "PDF",
    size: "5.5MB",
    date: "2024-02-01",
  },
  {
    id: "2",
    title: "内控合规手册",
    type: "PDF",
    size: "4.2MB",
    date: "2024-01-28",
  },
  {
    id: "3",
    title: "风险管理制度",
    type: "PDF",
    size: "3.8MB",
    date: "2024-01-25",
  },
];

interface KnowledgeItem {
  id: string;
  title: string;
  type: string;
  size: string;
  date: string;
}

function KnowledgeCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
      <div className="p-2 rounded-lg bg-primary/10">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function KnowledgeList({ data }: { data: KnowledgeItem[] }) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-card"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            <span>{item.title}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{item.type}</span>
            <span>{item.size}</span>
            <span>{item.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function KnowledgeBase() {
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-4">知识库</h1>
        <div className="grid grid-cols-3 gap-4">
          <KnowledgeCard
            icon={FileText}
            title="个人知识库"
            desc="上传和管理您的个人文档"
          />
          <KnowledgeCard
            icon={Building2}
            title="CIB知识库"
            desc="企业金融相关文档"
          />
          <KnowledgeCard
            icon={Ban}
            title="全行知识库"
            desc="全行制度及规章文档"
          />
        </div>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">个人知识库</TabsTrigger>
          <TabsTrigger value="cib">CIB知识库</TabsTrigger>
          <TabsTrigger value="bank">全行知识库</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="mt-6">
          <PersonalKnowledge />
        </TabsContent>
        <TabsContent value="cib" className="mt-6">
          <KnowledgeList data={cibKnowledgeData} />
        </TabsContent>
        <TabsContent value="bank" className="mt-6">
          <KnowledgeList data={bankKnowledgeData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
