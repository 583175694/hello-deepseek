import { useState, useCallback } from "react";
import { useEventSource } from "./useEventSource";
import { baseURL, readerService } from "@/lib/api";
import { toast } from "sonner";

export function useAIReading() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const { connect, close } = useEventSource();

  // 上传 PDF 文件
  const uploadPDF = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      const result = await readerService.uploadPDF(file);
      setUploadedFilename(result.filename);
      return result;
    } catch (error) {
      console.error("上传文件错误:", error);
      toast.error("上传文件失败，请重试");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 生成文章摘要
  const generateSummary = useCallback(
    (filename: string, modelId: string = "bytedance_deepseek_v3") => {
      setIsLoading(true);
      setSummary("");

      const url = `${baseURL}/reader/summary?filename=${filename}&modelId=${modelId}`;

      connect(url, {
        onMessage: (data) => {
          try {
            const parsedData = JSON.parse(data);
            setSummary((prev) => prev + parsedData.content);
          } catch (error) {
            console.error("解析SSE消息错误:", error);
          }
        },
        onError: (error) => {
          console.error("SSE连接错误:", error);
          toast.error("生成摘要失败，请重试");
          setIsLoading(false);
        },
        onClose: () => {
          setIsLoading(false);
        },
      });
    },
    [connect]
  );

  // 删除上传的文件
  const deleteFile = useCallback(async () => {
    if (uploadedFilename) {
      try {
        await readerService.deletePDF(uploadedFilename);
        setUploadedFilename(null);
        setSummary("");
        return true;
      } catch (error) {
        console.error("删除文件错误:", error);
        toast.error("删除文件失败，请重试");
        return false;
      }
    }
    return true;
  }, [uploadedFilename]);

  // 上传并生成摘要
  const uploadAndGenerateSummary = useCallback(
    async (file: File, modelId: string = "bytedance_deepseek_v3") => {
      try {
        const result = await uploadPDF(file);
        generateSummary(result.filename, modelId);
      } catch (error) {
        console.error("处理文件错误:", error);
      }
    },
    [uploadPDF, generateSummary]
  );

  return {
    isLoading,
    summary,
    uploadedFilename,
    uploadPDF,
    generateSummary,
    deleteFile,
    uploadAndGenerateSummary,
    closeConnection: close,
  };
}
