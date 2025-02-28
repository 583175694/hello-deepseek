"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { pptService } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// 解析 markdown 格式的 PPT 内容
interface ParsedSlide {
  title: string;
  content: string[];
  pageNumber: number;
}

function parseMarkdownSlides(markdown: string): ParsedSlide[] {
  const slides: ParsedSlide[] = [];
  console.log("开始解析 markdown:", markdown.substring(0, 100) + "...");

  // 首先尝试提取主标题部分
  const mainSections = markdown.split(/# /).filter(Boolean);
  console.log("主标题部分数量:", mainSections.length);

  let pageNumber = 1;

  mainSections.forEach((section) => {
    const lines = section.trim().split("\n");
    if (lines.length === 0) return;

    // 第一行是主标题
    const mainTitle = lines[0].trim();
    console.log(`处理主标题: ${mainTitle}`);

    // 收集所有层级的要点
    const allPoints: string[] = [];

    // 提取所有以 - 开头的要点
    lines.forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("-")) {
        // 移除开头的 - 和可能的空格
        const point = trimmedLine.substring(1).trim();
        allPoints.push(point);
      }
    });

    console.log(`提取的要点数量: ${allPoints.length}`);

    // 如果找到要点，创建一个幻灯片
    if (allPoints.length > 0) {
      slides.push({
        pageNumber: pageNumber++,
        title: mainTitle,
        content: allPoints,
      });
    }

    // 查找二级标题部分 (## 开头)
    const subSections = section.split(/\n## /).slice(1); // 跳过第一部分，因为它是主标题

    subSections.forEach((subSection) => {
      const subLines = subSection.trim().split("\n");
      if (subLines.length === 0) return;

      // 第一行是二级标题
      const subTitle = subLines[0].trim();
      console.log(`处理二级标题: ${subTitle}`);

      // 收集该二级标题下的所有要点
      const subPoints: string[] = [];

      subLines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("-")) {
          // 移除开头的 - 和可能的空格
          const point = trimmedLine.substring(1).trim();
          subPoints.push(point);
        }
      });

      // 如果找到要点，创建一个幻灯片
      if (subPoints.length > 0) {
        slides.push({
          pageNumber: pageNumber++,
          title: subTitle,
          content: subPoints,
        });
      }
    });
  });

  // 如果没有解析出任何幻灯片，尝试使用原来的方法
  if (slides.length === 0) {
    console.log("尝试使用原始方法解析幻灯片");

    // 使用正则表达式匹配每个幻灯片部分
    // 匹配格式: # 第X页：标题
    const slidePattern =
      /# 第(\d+)页：([^\n]+)([\s\S]*?)(?=\n# 第\d+页：|\s*$)/g;

    let match;
    while ((match = slidePattern.exec(markdown)) !== null) {
      const pageNumber = parseInt(match[1]);
      const title = match[2].trim();
      const content = match[3].trim();

      console.log(`找到第 ${pageNumber} 页:`, title);

      // 提取要点列表
      const contentItems = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => {
          // 移除开头的 - 和可能的空格
          let point = line.trim();
          if (point.startsWith("-")) {
            point = point.substring(1).trim();
          }
          return point;
        });

      console.log("提取的要点:", contentItems);

      slides.push({
        pageNumber,
        title,
        content: contentItems,
      });
    }

    // 如果仍然没有解析出幻灯片，使用最简单的方法
    if (slides.length === 0) {
      console.log("使用最简单的方法解析幻灯片");

      // 直接按 # 分割内容
      const sections = markdown.split("#").filter(Boolean);
      console.log("简单分割后的部分数量:", sections.length);

      sections.forEach((section) => {
        // 尝试提取标题和内容
        const lines = section.trim().split("\n").filter(Boolean);

        if (lines.length > 0) {
          // 第一行应该是标题
          const titleLine = lines[0].trim();

          // 剩余的行是内容
          const contentItems = lines
            .slice(1)
            .filter((line) => line.trim().startsWith("-"))
            .map((line) => {
              // 移除开头的 - 和可能的空格
              let point = line.trim();
              if (point.startsWith("-")) {
                point = point.substring(1).trim();
              }
              return point;
            });

          if (contentItems.length > 0) {
            slides.push({
              pageNumber: pageNumber++,
              title: titleLine,
              content: contentItems,
            });
          }
        }
      });
    }
  }

  console.log("解析出的幻灯片数量:", slides.length);
  return slides;
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
  const [slides, setSlides] = useState<ParsedSlide[]>([]);
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingPPT, setIsGeneratingPPT] = useState(false);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isChatGenerating, setIsChatGenerating] = useState(false);

  // 控制界面显示的状态
  const [showOutlineSection, setShowOutlineSection] = useState(false);
  const [showContentSection, setShowContentSection] = useState(false);
  const [showPPTIframe, setShowPPTIframe] = useState(false);

  // 引用用于滚动的元素
  const outlineSectionRef = useRef<HTMLDivElement>(null);
  const contentSectionRef = useRef<HTMLDivElement>(null);
  const iframeSectionRef = useRef<HTMLDivElement>(null);

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
      // 显示大纲部分
      setShowOutlineSection(true);

      // 等待DOM更新后滚动到大纲部分
      setTimeout(() => {
        outlineSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("生成大纲失败:", error);
      toast.error("生成大纲失败");
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
      setContent(content);
      // 调试输出
      console.log("接收到的 markdown 内容:", content);

      // 解析 markdown 内容为幻灯片数组
      const parsedSlides = parseMarkdownSlides(content);
      console.log("解析后的幻灯片:", parsedSlides);

      setSlides(parsedSlides);
      setProgress(100);

      // 显示内容预览部分
      setShowContentSection(true);

      // 等待DOM更新后滚动到内容部分
      setTimeout(() => {
        contentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("生成内容失败:", error);
      toast.error("生成内容失败");
    } finally {
      setTimeout(() => {
        setIsGeneratingContent(false);
      }, 500); // 给进度条一点时间显示100%
    }
  };

  const handleGeneratePPT = async () => {
    if (!title || !content) {
      return;
    }

    setIsGeneratingPPT(true);
    try {
      // 显示iframe部分
      setShowPPTIframe(true);

      // 等待DOM更新后滚动到iframe部分
      setTimeout(() => {
        iframeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

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
            content: content, // 使用生成的内容
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
              toast.error("PPT生成失败");
              break;
          }
        },
      });
    } catch (error) {
      console.error("生成 PPT 失败:", error);
      toast.error("PPT生成失败");
    } finally {
      setIsGeneratingPPT(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatPrompt.trim()) return;

    // Add user message to chat history
    const userMessage = { role: "user", content: chatPrompt };
    setChatHistory((prev) => [...prev, userMessage]);

    // Clear input
    setChatPrompt("");

    setIsChatGenerating(true);
    try {
      // Create a context-aware prompt that includes the current outline
      const contextPrompt = `我当前有一个PPT大纲如下：\n\n${outline}\n\n用户的要求是：${userMessage.content}\n\n请根据用户的要求，生成一个新的、改进的PPT大纲。`;

      // Use the same API as outline generation
      const newOutline = await pptService.generateOutline(contextPrompt);

      // Add AI response to chat history
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "我已根据您的要求更新了大纲。" },
      ]);

      // Update the outline
      setOutline(newOutline);
    } catch (error) {
      console.error("AI对话失败:", error);
      toast.error("AI对话失败");
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "抱歉，生成大纲时出现了错误。" },
      ]);
    } finally {
      setIsChatGenerating(false);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto">
      <div className="w-full mx-auto p-4 max-w-4xl scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border/80 scrollbar-track-transparent">
        <h1 className="text-2xl font-bold mb-6 pl-16 lg:pl-0">AI PPT</h1>
        <div className="space-y-6">
          {/* 标题输入 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center sticky top-0 bg-white py-2 z-10">
              <label className="text-sm font-medium">
                演示文稿主题/内容描述
              </label>
              <div className="flex justify-end mt-2">
                <Button
                  onClick={handleGenerateOutline}
                  disabled={!title || isGeneratingOutline}
                >
                  {isGeneratingOutline ? "生成中..." : "生成大纲"}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="请输入演示文稿的主题、内容描述或任何相关信息，AI将帮您生成大纲..."
                className="flex-1 min-h-[100px]"
              />
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

          {/* 大纲编辑 - 只在生成大纲后显示 */}
          {showOutlineSection && (
            <div className="space-y-2" ref={outlineSectionRef}>
              <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10">
                <label className="text-sm font-medium">演示文稿大纲</label>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                        AI对话优化大纲
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>与AI对话优化大纲</DialogTitle>
                      </DialogHeader>
                      <div className="max-h-[300px] overflow-y-auto p-4 bg-muted rounded-md mb-4">
                        {chatHistory.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">
                            告诉AI你想如何改进大纲，例如&quot;增加一个关于市场分析的章节&quot;
                          </p>
                        ) : (
                          chatHistory.map((msg, i) => (
                            <div
                              key={i}
                              className={`mb-4 ${
                                msg.role === "user" ? "text-right" : ""
                              }`}
                            >
                              <div
                                className={`inline-block p-3 rounded-lg ${
                                  msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted-foreground/20"
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))
                        )}
                        {isChatGenerating && (
                          <div className="mb-4">
                            <div className="inline-block p-3 rounded-lg bg-muted-foreground/20">
                              <div className="flex space-x-2">
                                <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                                <div
                                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                                  style={{ animationDelay: "0.2s" }}
                                ></div>
                                <div
                                  className="w-2 h-2 rounded-full bg-current animate-bounce"
                                  style={{ animationDelay: "0.4s" }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-end gap-2">
                        <Textarea
                          value={chatPrompt}
                          onChange={(e) => setChatPrompt(e.target.value)}
                          placeholder="输入你的要求..."
                          className="flex-1 min-h-[80px]"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.ctrlKey) {
                              e.preventDefault();
                              handleChatSubmit();
                            }
                          }}
                        />
                        <Button
                          onClick={handleChatSubmit}
                          disabled={isChatGenerating || !chatPrompt.trim()}
                          className="mb-1"
                        >
                          发送
                        </Button>
                      </div>
                      <DialogFooter className="mt-4">
                        <DialogClose asChild>
                          <Button variant="outline">关闭</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    onClick={handleGenerateContent}
                    disabled={!title || !outline || isGeneratingContent}
                  >
                    {isGeneratingContent ? "生成中..." : "生成内容"}
                  </Button>
                </div>
              </div>
              <Textarea
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="生成的大纲将显示在这里，你可以进行编辑..."
                className="min-h-[200px]"
              />

              {isGeneratingContent && (
                <div className="space-y-2 mt-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    正在生成内容 ({progress}%)
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 预览内容 - 只在生成内容后显示 */}
          {showContentSection && slides.length > 0 && (
            <div className="space-y-6" ref={contentSectionRef}>
              <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10">
                <h2 className="text-xl font-semibold">预览 PPT 内容</h2>
                <Button onClick={handleGeneratePPT} disabled={isGeneratingPPT}>
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
                        第 {slide.pageNumber} 页：{slide.title}
                      </h3>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      {slide.content.map((point, pointIndex) => (
                        <li key={pointIndex} className="text-base">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 原始Markdown内容编辑 - 只在生成内容后显示 */}
          {showContentSection && content && (
            <div className="space-y-2 mt-6">
              <div className="flex items-center justify-between sticky top-0 bg-white py-2 z-10">
                <h3 className="text-lg font-semibold">编辑 Markdown 内容</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // 重新解析编辑后的内容
                    const parsedSlides = parseMarkdownSlides(content);
                    setSlides(parsedSlides);
                  }}
                >
                  更新预览
                </Button>
              </div>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="编辑 Markdown 内容..."
              />
              <p className="text-xs text-muted-foreground">
                提示：直接编辑上方的 Markdown
                内容，点击&quot;更新预览&quot;查看效果，编辑后的内容将直接用于生成PPT。
              </p>
            </div>
          )}

          {/* AIPPT iframe 容器 - 只在点击生成PPT后显示 */}
          <div
            ref={iframeSectionRef}
            className={`w-full h-[600px] relative border rounded-lg mt-6 ${
              showPPTIframe ? "" : "hidden"
            }`}
            style={{ minHeight: "600px" }}
          >
            {/* 添加一个内部容器来确保 iframe 能正确填充高度 */}
            <div id="aippt-container" className="absolute inset-0">
              {/* iframe 将被 AIPPT SDK 插入到这里 */}
            </div>
          </div>

          {/* 底部重置按钮 */}
          {showPPTIframe && (
            <div className="flex justify-center mt-8 pb-6">
              <Button
                variant="outline"
                className="px-8"
                onClick={() => {
                  // 重置所有状态
                  setTitle("");
                  setOutline("");
                  setContent("");
                  setSlides([]);
                  setChatPrompt("");
                  setChatHistory([]);
                  setShowOutlineSection(false);
                  setShowContentSection(false);
                  setShowPPTIframe(false);
                  setProgress(0);
                  setIsGeneratingOutline(false);
                  setIsGeneratingContent(false);
                  setIsGeneratingPPT(false);
                  setIsChatGenerating(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M3 2v6h6"></path>
                  <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
                </svg>
                重置所有内容
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
