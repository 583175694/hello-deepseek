"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Trash2, Loader2 } from "lucide-react";
import { fileService } from "@/lib/api";
import type { FileInfo } from "@/types/file";

export function KnowledgeBase() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

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
      setDeletingFiles((prev) => new Set(prev).add(filename));
      await fileService.deleteFile(filename);
      await loadFiles();
    } catch (err) {
      setError("删除文件失败");
      console.error(err);
    } finally {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(filename);
        return newSet;
      });
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div className="h-full p-4 lg:p-6 overflow-auto max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 pl-16 lg:pl-0">知识库</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.txt,.md,.doc,.docx,.csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
            capture="environment"
          />
          <Button disabled={isUploading} size="sm" className="lg:h-10">
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
        <div className="mb-4 p-3 lg:p-4 text-sm text-destructive bg-destructive/10 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:flex lg:flex-row lg:flex-wrap gap-3 lg:gap-4">
        {files.length === 0 ? (
          <div className="col-span-2 w-full flex flex-col items-center justify-center py-8 lg:py-12 text-muted-foreground">
            <FileText className="w-8 h-8 lg:w-12 lg:h-12 mb-4" />
            <p className="text-base lg:text-lg mb-2">知识库还是空的</p>
            <p className="text-xs lg:text-sm">点击上方的上传按钮添加文件</p>
          </div>
        ) : (
          files.map((file) => (
            <div
              key={file.filename}
              className="w-full lg:w-[200px] group rounded-lg border border-border hover:border-foreground/20 cursor-pointer transition-colors"
            >
              <div className="p-3 lg:p-4 flex flex-col h-full">
                <div className="flex items-start justify-between">
                  <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-muted-foreground shrink-0" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 lg:h-8 lg:w-8 lg:opacity-0 lg:group-hover:opacity-100 -mr-1 -mt-1 lg:-mr-2 lg:-mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(file.filename);
                    }}
                    disabled={deletingFiles.has(file.filename)}
                  >
                    {deletingFiles.has(file.filename) ? (
                      <Loader2 className="w-3 h-3 lg:w-4 lg:h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                  </Button>
                </div>

                <div className="mt-3 lg:mt-4 flex-1">
                  <h3 className="font-medium text-sm lg:text-base line-clamp-2 mb-1">
                    {file.filename}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs lg:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span>大小：</span>
                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
