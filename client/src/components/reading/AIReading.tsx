"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileUp,
  Trash2,
  Clock,
  FileText,
  ArrowLeft,
} from "lucide-react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { useAIReading } from "@/hooks/useAIReading";
import { readerService } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ArticleAnalysis } from "./ArticleAnalysis";
import { useLoading } from "@/contexts/LoadingContext";

type SupportedMimeTypes =
  | "application/pdf"
  | "application/msword"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "text/plain"
  | "text/markdown"
  | "text/csv"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "application/vnd.ms-excel";

type FileTypes = "pdf" | "doc" | "docx" | "txt" | "md" | "csv" | "xlsx" | "xls";

const SUPPORTED_FILE_TYPES: Record<SupportedMimeTypes, FileTypes> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "text/plain": "txt",
  "text/markdown": "md",
  "text/csv": "csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
};

// 定义历史文件类型
interface HistoryFile {
  filename: string;
  originalName?: string;
  size: number;
  uploadedAt: string;
  fileType: string; // 添加文件类型字段
}

// 使用动态导入避免服务器端渲染问题
const PDFViewer = dynamic(
  () => import("./PDFViewer").then((mod) => mod.PDFViewer),
  { ssr: false }
);

const DocumentViewer = dynamic(
  () => import("./DocViewer").then((mod) => mod.DocumentViewer),
  { ssr: false }
);

const TextViewer = dynamic(
  () => import("./TextViewer").then((mod) => mod.TextViewer),
  { ssr: false }
);

const SpreadsheetViewer = dynamic(
  () => import("./SpreadsheetViewer").then((mod) => mod.SpreadsheetViewer),
  { ssr: false }
);

export function AIReading() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(55); // 初始宽度比例为55%
  const [isResizing, setIsResizing] = useState(false);
  const [historyFiles, setHistoryFiles] = useState<HistoryFile[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fileType, setFileType] = useState<string>("pdf");
  const { showLoading, hideLoading } = useLoading();

  // 使用 AI 阅读 hook
  const {
    isLoading,
    summary,
    deepReading,
    mindMap,
    uploadAndGenerateSummary,
    closeConnection,
    generateSummary,
    generateDeepReading,
    generateMindMap,
    setDeepReading,
    setMindMap,
    setSummary,
  } = useAIReading();

  // 加载历史文件列表
  const loadHistoryFiles = useCallback(async () => {
    try {
      setIsLoadingHistory(true);
      const response = await readerService.getUploadedFiles();
      setHistoryFiles(response.files || []);
    } catch (error) {
      console.error("加载历史文件失败:", error);
      toast.error("加载历史文件失败");
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // 组件加载时获取历史文件
  useEffect(() => {
    loadHistoryFiles();
  }, [loadHistoryFiles]);

  // 处理文件上传
  const handleFileChange = async (file: File | null) => {
    if (file) {
      const mimeType = file.type as SupportedMimeTypes;
      const fileType = SUPPORTED_FILE_TYPES[mimeType];

      if (!fileType) {
        toast.error(
          "不支持的文件类型，请上传 PDF、DOC、DOCX、TXT、MD、CSV、XLSX、XLS 文件"
        );
        return;
      }

      setPdfFile(file);
      setFileType(fileType);

      // 创建URL以供预览
      const fileUrl = URL.createObjectURL(file);
      setPdfUrl(fileUrl);

      // 上传文件到服务器并生成摘要
      await uploadAndGenerateSummary(file);

      // 重新加载历史文件列表
      loadHistoryFiles();
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

  // 返回历史文件
  const handleReturnFile = async () => {
    // 确保关闭SSE连接
    closeConnection();

    // 清理本地状态
    setPdfFile(null);
    setDeepReading("");
    setMindMap("");
    setSummary("");
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // 重新加载历史文件列表
    loadHistoryFiles();
  };

  // 处理历史文件点击
  const handleHistoryFileClick = async (filename: string, fileType: string) => {
    try {
      showLoading();
      // 使用API获取文件内容
      const fileBlob = await readerService.getPDFFile(filename);
      hideLoading();

      // 创建URL以供预览
      const fileUrl = URL.createObjectURL(fileBlob);
      setPdfUrl(fileUrl);
      setFileType(fileType as FileTypes);

      // 设置一个临时的File对象，确保使用正确的 MIME 类型
      const mimeType =
        Object.entries(SUPPORTED_FILE_TYPES).find(
          ([, type]) => type === fileType
        )?.[0] || "application/pdf";

      const tempFile = new File([fileBlob], filename, {
        type: mimeType,
      });
      setPdfFile(tempFile);

      // 串行生成所有分析内容
      await generateSummary(filename);
      await generateDeepReading(filename);
      await generateMindMap(filename);
    } catch (error) {
      console.error("加载历史文件失败:", error);
      toast.error("加载历史文件失败");
    } finally {
      hideLoading();
    }
  };

  // 处理历史文件删除
  const handleDeleteHistoryFile = async (
    e: React.MouseEvent,
    filename: string
  ) => {
    e.stopPropagation(); // 阻止事件冒泡，避免触发点击文件的事件

    try {
      await readerService.deletePDF(filename);
      toast.success("文件已删除");
      // 重新加载历史文件列表
      loadHistoryFiles();
    } catch (error) {
      console.error("删除历史文件失败:", error);
      toast.error("删除文件失败，请重试");
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

  // 组件卸载时关闭 SSE 连接
  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, [closeConnection]);

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // 修改渲染文档预览的部分
  const renderDocumentViewer = () => {
    if (!pdfUrl) return null;

    switch (fileType) {
      case "pdf":
        return <PDFViewer fileUrl={pdfUrl} />;
      case "doc":
      case "docx":
        return <DocumentViewer fileUrl={pdfUrl} fileType={fileType} />;
      case "txt":
      case "md":
        return <TextViewer fileUrl={pdfUrl} fileType={fileType} />;
      case "csv":
      case "xlsx":
      case "xls":
        return <SpreadsheetViewer fileUrl={pdfUrl} fileType={fileType} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 md:pb-0 overflow-hidden">
      <div className="flex items-center justify-between mb-6 w-full max-w-4xl mx-auto lg:pl-6">
        <h1 className="text-2xl font-bold">AI阅读</h1>
      </div>

      {!pdfFile ? (
        <div className="flex flex-col h-full gap-6 p-4 lg:p-6 overflow-hidden w-full max-w-4xl mx-auto">
          <div
            className={`
                flex flex-col items-center justify-center
                border-2 border-dashed rounded-lg
                p-6 md:p-8
                cursor-pointer
                transition-colors
                ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }
                h-1/2
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
              accept=".pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
            />
            <Upload className="w-12 h-12 mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">上传文档</h3>
            <p className="text-muted-foreground text-center text-sm mb-3">
              支持 PDF、DOC、DOCX、TXT、MD、CSV、XLSX、XLS
              格式，拖放文件到此处，或点击上传
            </p>
            <Button size="sm" className="gap-2">
              <FileUp className="w-4 h-4" />
              选择文件
            </Button>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">历史上传</h3>
            </div>

            <div className="border rounded-lg flex-1 overflow-y-auto mb-4">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : historyFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
                  <FileText className="w-8 h-8 mb-2 opacity-50" />
                  <p>暂无历史文件</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {historyFiles.map((file) => (
                    <li
                      key={file.filename}
                      className="p-3 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() =>
                        handleHistoryFileClick(file.filename, file.fileType)
                      }
                    >
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-muted-foreground mr-3" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {file.originalName || file.filename}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <span>{formatFileSize(file.size)}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {formatDistanceToNow(new Date(file.uploadedAt), {
                                addSuffix: true,
                                locale: zhCN,
                              })}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={(e) =>
                            handleDeleteHistoryFile(e, file.filename)
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex flex-1 gap-4 overflow-hidden"
          style={{ cursor: isResizing ? "col-resize" : "auto" }}
        >
          {/* 左侧PDF预览 */}
          <div
            style={{ width: `${leftPanelWidth}%` }}
            className="relative h-full overflow-hidden"
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReturnFile}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="truncate">{pdfFile.name}</div>
              </div>
              <div className="flex-1 overflow-hidden">
                {renderDocumentViewer()}
              </div>
            </div>
          </div>

          {/* 拖动调整大小的把手 */}
          <div
            className="w-1 bg-border cursor-col-resize hover:bg-primary/50 active:bg-primary"
            onMouseDown={handleResizeStart}
          />

          {/* 右侧分析区域 */}
          <div
            style={{ width: `${100 - leftPanelWidth}%` }}
            className="h-full overflow-auto"
          >
            <ArticleAnalysis
              isLoading={isLoading}
              summary={summary}
              deepReading={deepReading}
              mindMap={mindMap}
            />
          </div>
        </div>
      )}
    </div>
  );
}
