"use client";

import { MyAgentList } from "@/components/agent/MyAgentList";

export default function MyAgentPage() {
  return (
    <div className="h-full p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">我的智能体</h1>
      </div>
      <MyAgentList />
    </div>
  );
}
