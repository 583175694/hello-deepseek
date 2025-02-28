"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, FileText, Loader2 } from "lucide-react";
import { fileService } from "@/lib/api";
import type { FileInfo } from "@/types/file";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";

export function FileManager() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 加载文件列表
  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fileService.getFiles();
      setFiles(response.files);
    } catch (err) {
      setError("加载文件列表失败");
      console.error(err);
    } finally {
      setIsLoading(false);
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
      await loadFiles(); // 重新加载文件列表
    } catch (err) {
      setError("上传文件失败");
      console.error(err);
    } finally {
      setIsUploading(false);
      // 清空 input 的值，允许重复上传相同文件
      event.target.value = "";
    }
  };

  // 删除文件
  const handleDeleteFile = async (filename: string) => {
    try {
      await fileService.deleteFile(filename);
      await loadFiles(); // 重新加载文件列表
    } catch (err) {
      setError("删除文件失败");
      console.error(err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // 检查日期是否有效
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

  // 初始加载
  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">知识库文件</h2>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.txt,.md,.doc,.docx,.csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Button disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            上传文件
          </Button>
        </div>
      </div>

      {error && <div className="text-sm text-destructive">{error}</div>}

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">暂无文件</div>
        ) : (
          files.map((file) => (
            <div
              key={file.filename}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{file.filename}</div>
                  <div className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB ·{" "}
                    {formatDate(file.uploadedAt)}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteFile(file.filename)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
