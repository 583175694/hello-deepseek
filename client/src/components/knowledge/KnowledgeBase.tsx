"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Trash2, Loader2 } from "lucide-react";
import { fileService } from "@/lib/api";
import type { FileInfo } from "@/types/file";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export function KnowledgeBase() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载文件列表
  const loadFiles = async () => {
    try {
      const response = await fileService.getFiles();
      setFiles(response.files);
    } catch (err) {
      setError("加载文件列表失败");
      console.error(err);
    }
  };

  // 上传文件
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      await fileService.uploadFile(file);
      await loadFiles();
    } catch (err) {
      setError("上传文件失败");
      console.error(err);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  // 删除文件
  const handleDeleteFile = async (filename: string) => {
    try {
      await fileService.deleteFile(filename);
      await loadFiles();
    } catch (err) {
      setError("删除文件失败");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "未知时间";
      }
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: zhCN,
      });
    } catch (error) {
      console.error("日期格式化错误:", error);
      return "未知时间";
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="h-full p-6 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">知识库</h1>
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <Button disabled={isUploading}>
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              上传文件
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-row flex-wrap gap-4">
          {files.map((file) => (
            <div
              key={file.filename}
              className="w-[200px] group rounded-lg border border-border hover:border-foreground/20 cursor-pointer transition-colors"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-muted-foreground shrink-0" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 -mr-2 -mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.filename);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 flex-1">
                  <h3 className="font-medium text-base line-clamp-2 mb-1">
                    {file.filename}
                  </h3>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span>大小：</span>
                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>上传于：</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
