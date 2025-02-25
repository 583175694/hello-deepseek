"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { pptService } from "@/lib/api";
import Script from "next/script";

interface PPTSlide {
  title: string;
  content: string[];
  imageDescription?: string;
}

// 将PPT内容转换为markdown格式
function convertToMarkdown(title: string, slides: PPTSlide[]): string {
  let markdown = `# ${title}\n\n`;

  slides.forEach((slide) => {
    markdown += `## ${slide.title}\n\n`;
    slide.content.forEach((point) => {
      markdown += `- ${point}\n`;
    });
    markdown += "\n";
  });

  return markdown;
}

// 声明全局 AipptIframe 类型
declare global {
  interface Window {
    AipptIframe: {
      show: (config: {
        appkey: string;
        channel: string;
        code: string;
        editorModel: boolean;
        content?: string;
        container?: HTMLElement | null;
        options: {
          custom_generate: {
            content: string;
            type: number;
            step?: number;
          };
        };
        onMessage: (eventType: string, data: any) => void;
      }) => Promise<void>;
    };
  }
}

export function PPTGenerator() {
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  const [slides, setSlides] = useState<PPTSlide[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSDKReady, setIsSDKReady] = useState(false);

  // 模拟进度条
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isGeneratingOutline || isGeneratingContent) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return prev;
          }
          // 速度随进度变化：开始快，后面慢
          const increment = Math.max(1, 10 - Math.floor(prev / 20));
          return Math.min(95, prev + increment);
        });
      }, 300);
    } else {
      setProgress(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGeneratingOutline, isGeneratingContent]);

  const handleGenerateOutline = async () => {
    if (!title) {
      return;
    }
    setIsGeneratingOutline(true);
    try {
      const outline = await pptService.generateOutline(title);
      setOutline(outline);
      setProgress(100);
    } catch (error) {
      console.error("生成大纲失败:", error);
    } finally {
      setTimeout(() => {
        setIsGeneratingOutline(false);
      }, 500); // 给进度条一点时间显示100%
    }
  };

  const handleGenerateContent = async () => {
    if (!title || !outline) {
      return;
    }
    setIsGeneratingContent(true);
    try {
      const content = await pptService.generateContent(title, outline);
      setSlides(content);
      setProgress(100);
    } catch (error) {
      console.error("生成内容失败:", error);
    } finally {
      setTimeout(() => {
        setIsGeneratingContent(false);
      }, 500); // 给进度条一点时间显示100%
    }
  };

  const handleGeneratePPT = async () => {
    if (!slides.length || !isSDKReady) {
      return;
    }

    setIsGeneratingPPT(true);
    try {
      // 将内容转换为markdown格式
      const markdownContent = convertToMarkdown(title, slides);

      // 获取AIPPT授权码
      const { code } = await pptService.getAuthCode();

      // 调用AIPPT SDK
      await window.AipptIframe.show({
        appkey: "67b6fc375e43d", // 使用您的 appkey
        channel: "test",
        code: code,
        editorModel: true,
        container: document.getElementById("aippt-container"), // 指定容器
        options: {
          custom_generate: {
            content: markdownContent,
            type: 7,
            step: 2,
          },
        },
        onMessage(eventType, data) {
          console.log("AIPPT Event:", eventType, data);
          switch (eventType) {
            case "success":
              // 处理成功事件
              console.log("PPT生成成功");
              break;
            case "error":
              // 处理错误事件
              console.error("PPT生成失败", data);
              break;
          }
        },
      });
    } catch (error) {
      console.error("生成 PPT 失败:", error);
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto">
      <Script
        src="https://api-static.aippt.cn/aippt-iframe-sdk.js"
        onLoad={() => setIsSDKReady(true)}
      />

      <div className="w-full mx-auto p-6 max-w-4xl scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border/80 scrollbar-track-transparent">
        <h1 className="text-2xl font-bold mb-6">AI PPT 生成器</h1>

        <div className="space-y-6">
          {/* 标题输入 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">演示文稿标题</label>
            <div className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入标题，例如：人工智能发展现状与未来趋势"
                className="flex-1"
              />
              <Button
                onClick={handleGenerateOutline}
                disabled={!title || isGeneratingOutline}
              >
                {isGeneratingOutline ? "生成中..." : "生成大纲"}
              </Button>
            </div>
            {isGeneratingOutline && (
              <div className="space-y-2 mt-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  正在生成大纲 ({progress}%)
                </p>
              </div>
            )}
          </div>

          {/* 大纲编辑 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">演示文稿大纲</label>
            <Textarea
              value={outline}
              onChange={(e) => setOutline(e.target.value)}
              placeholder="生成的大纲将显示在这里，你可以进行编辑..."
              className="min-h-[200px]"
            />
          </div>

          {/* 生成按钮 */}
          <div className="space-y-2">
            <div className="flex justify-end">
              <Button
                onClick={handleGenerateContent}
                disabled={!title || !outline || isGeneratingContent}
                className="w-full sm:w-auto"
              >
                {isGeneratingContent ? "生成中..." : "生成内容"}
              </Button>
            </div>
            {isGeneratingContent && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  正在生成内容 ({progress}%)
                </p>
              </div>
            )}
          </div>

          {/* 预览内容 */}
          {slides.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">预览 PPT 内容</h2>
                <Button
                  onClick={handleGeneratePPT}
                  disabled={isGeneratingPPT || !isSDKReady}
                >
                  {isGeneratingPPT ? "生成中..." : "使用AIPPT生成"}
                </Button>
              </div>

              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-6 bg-card shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">
                        第 {index + 1} 页：{slide.title}
                      </h3>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      {slide.content.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-base">
                          {point}
                        </li>
                      ))}
                    </ul>
                    {slide.imageDescription && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        <p>建议图片：{slide.imageDescription}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AIPPT iframe 容器 */}
          <div
            id="aippt-container"
            className="w-full h-[600px] relative border rounded-lg mt-6"
            style={{ minHeight: "600px" }}
          >
            {/* 添加一个内部容器来确保 iframe 能正确填充高度 */}
            <div className="absolute inset-0">
              {/* iframe 将被 AIPPT SDK 插入到这里 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
