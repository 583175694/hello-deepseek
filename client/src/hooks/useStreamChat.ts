import { useState, useCallback } from "react";
import { useEventSource } from "./useEventSource";
import { baseURL } from "@/lib/api";

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
      },
      onStream?: (
        content: string,
        type: "content" | "reasoning" | "sources"
      ) => void
    ) => {
      setIsStreaming(true);
      let streamContent = "";

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

      // 连接 SSE
      connect(`${baseURL}/chat/stream?${params.toString()}`, {
        onMessage: (token) => {
          const res = JSON.parse(token);
          streamContent += res.content;
          onStream?.(streamContent, res.type);
        },
        onError: (error) => {
          console.error("Stream chat error:", error);
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
