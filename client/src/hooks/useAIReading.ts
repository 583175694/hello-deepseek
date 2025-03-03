import { useState, useCallback } from "react";
import { useEventSource } from "./useEventSource";
import { baseURL, readerService } from "@/lib/api";
import { toast } from "sonner";

export function useAIReading() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [deepReading, setDeepReading] = useState("");
  const [mindMap, setMindMap] = useState("");
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
    (
      filename: string,
      modelId: string = "bytedance_deepseek_v3"
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setSummary("");
        setUploadedFilename(filename);

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
            reject(error);
          },
          onClose: () => {
            setIsLoading(false);
            resolve();
          },
        });
      });
    },
    [connect]
  );

  // 生成文章精读
  const generateDeepReading = useCallback(
    (
      filename: string,
      modelId: string = "bytedance_deepseek_v3"
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setDeepReading("");
        setUploadedFilename(filename);

        const url = `${baseURL}/reader/deep-reading?filename=${filename}&modelId=${modelId}`;

        connect(url, {
          onMessage: (data) => {
            try {
              const parsedData = JSON.parse(data);
              setDeepReading((prev) => prev + parsedData.content);
            } catch (error) {
              console.error("解析SSE消息错误:", error);
            }
          },
          onError: (error) => {
            console.error("SSE连接错误:", error);
            toast.error("生成精读失败，请重试");
            setIsLoading(false);
            reject(error);
          },
          onClose: () => {
            setIsLoading(false);
            resolve();
          },
        });
      });
    },
    [connect]
  );

  // 生成脑图
  const generateMindMap = useCallback(
    (
      filename: string,
      modelId: string = "bytedance_deepseek_v3"
    ): Promise<void> => {
      return new Promise((resolve, reject) => {
        setIsLoading(true);
        setMindMap("");
        setUploadedFilename(filename);

        const url = `${baseURL}/reader/mind-map?filename=${filename}&modelId=${modelId}`;

        connect(url, {
          onMessage: (data) => {
            try {
              const parsedData = JSON.parse(data);
              setMindMap((prev) => prev + parsedData.content);
            } catch (error) {
              console.error("解析SSE消息错误:", error);
            }
          },
          onError: (error) => {
            console.error("SSE连接错误:", error);
            toast.error("生成脑图失败，请重试");
            setIsLoading(false);
            reject(error);
          },
          onClose: () => {
            setIsLoading(false);
            resolve();
          },
        });
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
        setDeepReading("");
        setMindMap("");
        return true;
      } catch (error) {
        console.error("删除文件错误:", error);
        toast.error("删除文件失败，请重试");
        return false;
      }
    }
    return true;
  }, [uploadedFilename]);

  // 上传并生成分析
  const uploadAndGenerateSummary = useCallback(
    async (file: File, modelId: string = "bytedance_deepseek_v3") => {
      try {
        // 如果是已经上传的文件（从历史记录中选择的）
        if (file.size === 0 && file.name) {
          setUploadedFilename(file.name);
          // 串行执行生成任务
          await generateSummary(file.name, modelId);
          await generateDeepReading(file.name, modelId);
          await generateMindMap(file.name, modelId);
          return { filename: file.name };
        }

        // 正常上传新文件
        const result = await uploadPDF(file);
        // 串行执行生成任务
        await generateSummary(result.filename, modelId);
        await generateDeepReading(result.filename, modelId);
        await generateMindMap(result.filename, modelId);
        return result;
      } catch (error) {
        console.error("处理文件错误:", error);
        throw error;
      }
    },
    [uploadPDF, generateSummary, generateDeepReading, generateMindMap]
  );

  return {
    isLoading,
    summary,
    deepReading,
    mindMap,
    uploadedFilename,
    setUploadedFilename,
    uploadPDF,
    generateSummary,
    generateDeepReading,
    generateMindMap,
    deleteFile,
    uploadAndGenerateSummary,
    closeConnection: close,
    setDeepReading,
    setMindMap,
    setSummary,
  };
}
