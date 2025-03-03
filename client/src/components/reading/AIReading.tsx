"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";

// 使用动态导入避免服务器端渲染问题
const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

export function AIReading() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(55); // 初始宽度比例为60%
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理文件上传
  const handleFileChange = (file: File | null) => {
    if (file) {
      // 检查文件类型
      if (file.type !== "application/pdf") {
        alert("请上传PDF文件");
        return;
      }

      setPdfFile(file);
      // 创建URL以供预览
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);
    }
  };

  // 处理文件输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  // 处理拖放
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  // 处理点击上传区域
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 清除已上传的文件
  const handleClearFile = () => {
    setPdfFile(null);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 处理拖动调整大小
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      // 计算左侧面板宽度百分比，限制在20%到80%之间
      let newWidth = (mouseX / containerWidth) * 100;
      newWidth = Math.max(20, Math.min(80, newWidth));

      setLeftPanelWidth(newWidth);
    },
    [isResizing]
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // 添加和移除全局事件监听器
  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleResizeMove);
      window.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div className="flex flex-col h-full p-4 md:p-6 md:pb-0 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI阅读</h1>
      </div>

      {!pdfFile ? (
        <div
          className={`
            flex flex-col items-center justify-center
            border-2 border-dashed rounded-lg
            p-8 md:p-12
            cursor-pointer
            transition-colors
            ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            }
            flex-1
          `}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInputChange}
            accept="application/pdf"
            className="hidden"
          />
          <Upload className="w-16 h-16 mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium mb-2">上传PDF文件</h3>
          <p className="text-muted-foreground text-center mb-4">
            拖放文件到此处，或点击上传
          </p>
          <Button className="gap-2">
            <FileUp className="w-4 h-4" />
            选择文件
          </Button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <span className="font-medium mr-2">{pdfFile.name}</span>
              <span className="text-sm text-muted-foreground">
                ({Math.round(pdfFile.size / 1024)} KB)
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFile}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <div ref={containerRef} className="flex flex-row h-full relative">
            <div
              className="rounded-lg overflow-hidden"
              style={{ width: `${leftPanelWidth}%` }}
            >
              {pdfUrl && <PDFViewer fileUrl={pdfUrl} />}
            </div>

            {/* 可拖动分隔线 */}
            <div
              className={`w-1 bg-border hover:bg-primary cursor-col-resize active:bg-primary transition-all`}
              onMouseDown={handleResizeStart}
            />

            <div
              className="flex flex-col pl-4"
              style={{ width: `${100 - leftPanelWidth}%` }}
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">AI阅读</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
