"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { pptService } from "@/lib/api";
import pptxgen from "pptxgenjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PPTSlide {
  title: string;
  content: string[];
  imageDescription?: string;
}

interface PPTTemplate {
  id: string;
  name: string;
  styles: {
    background: { color: string };
    title: {
      fontSize: number;
      color: string;
      bold?: boolean;
    };
    content: {
      fontSize: number;
      color: string;
      lineSpacing: number;
    };
  };
}

// 预设模板
const BUILT_IN_TEMPLATES: PPTTemplate[] = [
  {
    id: "modern",
    name: "现代简约",
    styles: {
      background: { color: "FFFFFF" },
      title: {
        fontSize: 32,
        color: "1E293B",
        bold: true,
      },
      content: {
        fontSize: 18,
        color: "334155",
        lineSpacing: 32,
      },
    },
  },
  {
    id: "dark",
    name: "深色主题",
    styles: {
      background: { color: "1E293B" },
      title: {
        fontSize: 32,
        color: "FFFFFF",
        bold: true,
      },
      content: {
        fontSize: 18,
        color: "E2E8F0",
        lineSpacing: 32,
      },
    },
  },
  {
    id: "colorful",
    name: "缤纷活力",
    styles: {
      background: { color: "F0F9FF" },
      title: {
        fontSize: 32,
        color: "0369A1",
        bold: true,
      },
      content: {
        fontSize: 18,
        color: "334155",
        lineSpacing: 32,
      },
    },
  },
];

export function PPTGenerator() {
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  const [slides, setSlides] = useState<PPTSlide[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "input" | "preview" | "download"
  >("input");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");
  const [progress, setProgress] = useState(0);

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
      setCurrentStep("preview");
    } catch (error) {
      console.error("生成内容失败:", error);
    } finally {
      setTimeout(() => {
        setIsGeneratingContent(false);
      }, 500); // 给进度条一点时间显示100%
    }
  };

  const handleBack = () => {
    setCurrentStep("input");
  };

  const handleGeneratePPT = async () => {
    if (!slides.length) {
      return;
    }

    setIsGeneratingPPT(true);
    try {
      const pres = new pptxgen();
      const template =
        BUILT_IN_TEMPLATES.find((t) => t.id === selectedTemplate) ||
        BUILT_IN_TEMPLATES[0];

      // 设置幻灯片大小为宽屏16:9
      pres.layout = "LAYOUT_WIDE";

      // 创建封面页
      const coverSlide = pres.addSlide();
      coverSlide.background = { color: template.styles.background.color };
      coverSlide.addText(title, {
        x: "10%",
        y: "40%",
        w: "80%",
        fontSize: 44,
        bold: true,
        align: "center",
        color: template.styles.title.color,
      });

      // 添加内容页
      slides.forEach((slide) => {
        const contentSlide = pres.addSlide();
        contentSlide.background = template.styles.background;

        // 添加标题
        contentSlide.addText(slide.title, {
          x: "5%",
          y: "5%",
          w: "90%",
          h: "15%",
          ...template.styles.title,
        });

        // 添加内容要点
        const bulletPoints = slide.content.map((point) => ({ text: point }));
        contentSlide.addText(bulletPoints, {
          x: "5%",
          y: "25%",
          w: "90%",
          h: "70%",
          ...template.styles.content,
          bullet: true,
        });
      });

      // 保存文件
      const fileName = `${title}.pptx`;
      await pres.writeFile({ fileName });
      setCurrentStep("preview");
    } catch (error) {
      console.error("生成 PPT 失败:", error);
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  if (currentStep === "preview") {
    return (
      <div className="p-6 w-full h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">预览 PPT 内容</h1>
            <div className="space-x-2 flex items-center">
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择模板" />
                </SelectTrigger>
                <SelectContent>
                  {BUILT_IN_TEMPLATES.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleBack}>
                返回编辑
              </Button>
              <Button onClick={handleGeneratePPT} disabled={isGeneratingPPT}>
                {isGeneratingPPT ? "生成中..." : "生成 PPT"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 bg-card shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    第 {index + 1} 页：{slide.title}
                  </h2>
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
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl h-screen overflow-y-auto">
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
      </div>
    </div>
  );
}
