import { useState, useCallback } from "react";
import { useEventSource } from "./useEventSource";
import { baseURL } from "@/lib/api";
import { toast } from "sonner";

interface StreamResponse {
  content: string;
  type: "content" | "reasoning" | "sources";
}

export function useStreamChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const { connect, close } = useEventSource();

  const streamChat = useCallback(
    (
      message: string,
      sessionId: string,
      options?: {
        useWebSearch?: boolean;
        useVectorSearch?: boolean;
        useTempDocSearch?: boolean;
        modelId?: string;
      },
      onStream?: (response: StreamResponse) => void
    ) => {
      setIsStreaming(true);

      // 构建查询参数
      const params = new URLSearchParams({
        message,
        sessionId,
      });

      if (options?.useWebSearch) {
        params.append("useWebSearch", "true");
      }
      if (options?.useVectorSearch) {
        params.append("useVectorSearch", "true");
      }
      if (options?.useTempDocSearch) {
        params.append("useTempDocSearch", "true");
      }
      if (options?.modelId) {
        params.append("modelId", options.modelId);
      }

      // 连接 SSE
      connect(`${baseURL}/chat/stream?${params.toString()}`, {
        onMessage: (token) => {
          const res = JSON.parse(token);
          onStream?.(res);
        },
        onError: (error) => {
          console.error("Stream chat error:", error);
          toast.error("AI对话失败");
          setIsStreaming(false);
        },
        onClose: () => {
          setIsStreaming(false);
        },
      });
    },
    [connect]
  );

  const stopStreaming = useCallback(() => {
    close();
    setIsStreaming(false);
  }, [close]);

  return {
    streamChat,
    stopStreaming,
    isStreaming,
  };
}
