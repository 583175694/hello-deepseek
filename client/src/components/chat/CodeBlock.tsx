import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Check, Copy, Play, Image } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import mermaid from "mermaid";

interface CodeBlockProps {
  children: string;
  language: string;
}

// 初始化 mermaid 配置
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  deterministicIds: true,
  fontFamily: "sans-serif",
});

export const CodeBlock = ({ children, language }: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMermaidPreviewOpen, setIsMermaidPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const code = String(children).replace(/\n$/, "");
  const isHtml = language.toLowerCase() === "html";
  const isMermaid = language.toLowerCase() === "mermaid";
  const mermaidRef = useRef<HTMLDivElement>(null);

  // HTML 预览弹窗
  const htmlPreviewDialog = useMemo(() => {
    if (!isHtml) return null;

    return (
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[800px] w-[90vw] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>HTML 预览</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[70vh] border rounded-md overflow-hidden">
            <iframe
              srcDoc={code}
              className="absolute inset-0 w-full h-full"
              sandbox="allow-scripts"
              title="HTML Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [isHtml, isPreviewOpen, code]);

  const handleDownloadPng = useCallback(async () => {
    if (!mermaidRef.current) return;

    try {
      setIsDownloading(true);
      const svgElement = mermaidRef.current.querySelector("svg");
      if (!svgElement) {
        throw new Error("SVG element not found");
      }

      // 克隆 SVG 元素以避免修改原始元素
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;

      // 设置 SVG 的尺寸
      const bbox = svgElement.getBBox();
      clonedSvg.setAttribute("width", bbox.width.toString());
      clonedSvg.setAttribute("height", bbox.height.toString());

      // 添加白色背景
      const bgRect = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect"
      );
      bgRect.setAttribute("width", "100%");
      bgRect.setAttribute("height", "100%");
      bgRect.setAttribute("fill", "white");
      clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);

      // 转换 SVG 为 base64
      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBase64 = btoa(unescape(encodeURIComponent(svgData)));
      const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

      // 创建图片对象
      const img = document.createElement("img");
      img.src = dataUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            // 创建 canvas
            const canvas = document.createElement("canvas");
            const scale = 2; // 2倍清晰度
            canvas.width = bbox.width * scale;
            canvas.height = bbox.height * scale;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              throw new Error("无法创建 canvas context");
            }

            // 设置白色背景
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 绘制图片
            ctx.scale(scale, scale);
            ctx.drawImage(img, 0, 0);

            // 转换为 PNG 并下载
            const pngUrl = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "mermaid-diagram.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            resolve();
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error("图片加载失败"));
      });

      toast.success("图表已下载为 PNG");
      // 下载完成后关闭弹框
      setIsMermaidPreviewOpen(false);
    } catch (err) {
      console.error("Failed to download PNG:", err);
      toast.error("下载 PNG 失败");
    } finally {
      setIsDownloading(false);
    }
  }, []);

  // Mermaid 预览弹窗
  const mermaidPreviewDialog = useMemo(() => {
    if (!isMermaid) return null;

    return (
      <Dialog
        open={isMermaidPreviewOpen}
        onOpenChange={setIsMermaidPreviewOpen}
      >
        <DialogContent className="w-[900px] max-w-[90vw] h-[90vh] flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Mermaid 图表预览</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDownloadPng}
              disabled={isDownloading}
            >
              <Image className="w-4 h-4" />
              {isDownloading ? "导出中..." : "导出为PNG"}
            </Button>
          </DialogHeader>
          <div className="relative w-full border rounded-md overflow-hidden p-4 bg-white dark:bg-gray-900 flex-grow overflow-y-auto">
            <div className="overflow-y-auto flex-grow">
              <div
                ref={mermaidRef}
                className="flex justify-center w-full min-h-[100px] pointer-events-none"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [isMermaid, isMermaidPreviewOpen, isDownloading, handleDownloadPng]);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!isMermaid || !code || !mermaidRef.current || !isMermaidPreviewOpen) {
        return;
      }

      try {
        console.log("Starting mermaid render with code:", code);
        const ref = mermaidRef.current;

        // 首先尝试解析代码
        try {
          await mermaid.parse(code);
        } catch (parseError: any) {
          throw new Error(
            `语法错误: ${parseError?.message || "请检查图表语法"}`
          );
        }

        // 生成唯一 ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        console.log("Generated mermaid container ID:", id);

        // 创建一个新的容器并设置样式
        const container = document.createElement("div");
        container.id = id;
        container.className = "mermaid";
        container.style.visibility = "hidden";
        container.textContent = code;

        // 清空并添加新容器
        ref.innerHTML = "";
        ref.appendChild(container);

        // 确保容器已经被添加到 DOM 中
        await new Promise((resolve) => setTimeout(resolve, 0));

        // 渲染图表
        const { svg } = await mermaid.render(id, code);

        // 创建一个新的容器来放置渲染后的 SVG
        const svgContainer = document.createElement("div");
        svgContainer.innerHTML = svg;

        // 调整 SVG 样式
        const svgElement = svgContainer.querySelector("svg");
        if (svgElement) {
          svgElement.style.height = "auto";
          svgElement.style.display = "block";
          svgElement.style.margin = "0 auto";

          // 确保 SVG 的尺寸正确
          if (!svgElement.hasAttribute("width")) {
            svgElement.setAttribute("width", "100%");
          }
          if (!svgElement.hasAttribute("height")) {
            svgElement.setAttribute("height", "auto");
          }

          // 添加自定义样式
          svgElement.style.minWidth = "600px";
        }

        // 替换原始内容
        ref.innerHTML = "";
        ref.appendChild(svgContainer);
        console.log("SVG rendered and inserted successfully");
      } catch (err) {
        console.log("Failed to render mermaid:", err);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `
            <div class="p-4 border border-red-200 bg-red-50 dark:bg-red-900/10">
              <p class="text-red-600 dark:text-red-400 mb-2">Mermaid 图表渲染失败: ${
                err instanceof Error ? err.message : "未知错误"
              }</p>
              <pre class="bg-gray-100 dark:bg-gray-800 p-2 rounded text-sm overflow-x-auto">${code}</pre>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">提示：请检查语法是否正确，确保图表定义完整</p>
            </div>
          `;
        }
        toast.error("Mermaid 图表渲染失败");
      }
    };

    // 使用 requestAnimationFrame 确保 DOM 已更新
    if (isMermaidPreviewOpen) {
      requestAnimationFrame(() => {
        renderMermaid();
      });
    }
  }, [code, isMermaid, isMermaidPreviewOpen]);

  const handleCopyCode = () => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setIsCopied(true);
      toast.success("已复制到剪贴板");
      setTimeout(() => setIsCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
      toast.error("复制失败");
    }
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 flex gap-2">
        <button
          onClick={handleCopyCode}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
        >
          {isCopied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
        {(isHtml || isMermaid) && (
          <button
            onClick={() =>
              isHtml ? setIsPreviewOpen(true) : setIsMermaidPreviewOpen(true)
            }
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="max-w-full overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          PreTag="div"
          customStyle={{
            margin: 0,
            marginBottom: 0,
            padding: "1rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      {htmlPreviewDialog}
      {mermaidPreviewDialog}
    </div>
  );
};

CodeBlock.displayName = "CodeBlock";
