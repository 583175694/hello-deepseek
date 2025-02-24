"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Presentation, Upload, FileText } from "lucide-react";
import { aipptService } from "@/lib/api";
import Script from "next/script";

// 声明全局 AipptIframe 类型
declare global {
  interface Window {
    AipptIframe: {
      show: (config: {
        appkey: string;
        channel: string;
        code: string;
        editorModel: boolean;
        onMessage: (eventType: string, data: any) => void;
      }) => Promise<void>;
    };
  }
}

export function PPTGenerator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(false);

  // 初始化 AIPPT SDK
  useEffect(() => {
    const initAIPPT = async () => {
      if (!isSDKReady) return;

      try {
        const { code } = await aipptService.getAuthCode();
        await window.AipptIframe.show({
          appkey: "67b6fc375e43d", // 使用您的 appkey
          channel: "test",
          code: code,
          editorModel: true,
          onMessage(eventType, data) {
            console.log("AIPPT Event:", eventType, data);
            // 处理各种事件
            switch (eventType) {
              case "success":
                // 处理成功事件
                break;
              case "error":
                // 处理错误事件
                break;
              // 添加其他事件处理...
            }
          },
        });
      } catch (error) {
        console.error("Failed to initialize AIPPT:", error);
      }
    };

    initAIPPT();
  }, [isSDKReady]);

  const handleGenerate = async () => {
    if (!title || !content) return;
    setIsGenerating(true);
    try {
      // TODO: 实现 PPT 生成逻辑
      console.log("Generating PPT...", { title, content });
    } catch (error) {
      console.error("Failed to generate PPT:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Script
        src="https://api-static.aippt.cn/aippt-iframe-sdk.js"
        onLoad={() => setIsSDKReady(true)}
      />

      <div className="container max-w-4xl mx-auto p-4 lg:p-8">
        <div className="flex flex-col items-center justify-center mb-8">
          <Presentation className="w-12 h-12 text-primary mb-4" />
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">AI PPT 生成器</h1>
          <p className="text-muted-foreground text-center">
            输入主题和内容，让 AI 为你生成专业的演示文稿
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">PPT 标题</label>
            <Input
              placeholder="输入 PPT 标题，例如：公司年度报告"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">PPT 内容</label>
            <Textarea
              placeholder="输入 PPT 内容大纲或详细内容..."
              className="min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Button
              className="w-full"
              size="lg"
              onClick={handleGenerate}
              disabled={!title || !content || isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  生成中...
                </>
              ) : (
                <>
                  <Presentation className="w-5 h-5 mr-2" />
                  生成 PPT
                </>
              )}
            </Button>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                上传文档
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                <FileText className="w-5 h-5 mr-2" />
                模板库
              </Button>
            </div>
          </div>
        </div>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".doc,.docx,.pdf,.txt"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // TODO: 处理文件上传
              console.log("File uploaded:", file);
            }
          }}
        />
      </div>
    </>
  );
}
