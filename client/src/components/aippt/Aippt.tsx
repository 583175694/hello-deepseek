"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Presentation, Upload } from "lucide-react";
import { useState } from "react";

export function Aippt() {
  const [title, setTitle] = useState("");

  return (
    <div className="flex flex-col h-full">
      {/* 顶部标题栏 */}
      <div className="h-14 flex items-center px-4 py-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-lg font-semibold">AI PPT</h1>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* 输入区域 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">创建新的 PPT</h2>
              <p className="text-sm text-muted-foreground mb-4">
                输入主题或上传文档，让 AI 为您生成专业的演示文稿
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  PPT 主题
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入 PPT 主题，例如：人工智能发展现状与未来趋势"
                  className="w-full"
                />
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-primary/50 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">上传文档</p>
                <p className="text-xs text-muted-foreground mb-4">
                  支持 Word、PDF、Markdown 等格式
                </p>
                <Button variant="outline" size="sm">
                  选择文件
                </Button>
              </div>

              <Button className="w-full" size="lg" disabled={!title}>
                <Presentation className="w-4 h-4 mr-2" />
                开始生成
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
