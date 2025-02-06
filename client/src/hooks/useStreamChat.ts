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
      onStream?: (content: string) => void
    ) => {
      setIsStreaming(true);
      let streamContent = "";

      // 构建查询参数
      const params = new URLSearchParams({
        message,
        sessionId,
      });

      // 连接 SSE
      connect(`${baseURL}/chat/stream?${params.toString()}`, {
        onMessage: (token) => {
          streamContent += token;
          onStream?.(streamContent);
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
