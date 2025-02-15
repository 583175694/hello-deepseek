import { useState, useCallback } from "react";
import { useEventSource } from "./useEventSource";
import { baseURL } from "@/lib/api";

function getURLParameters(url: string): { [key: string]: string } {
  // 创建一个 URL 对象
  const urlObj = new URL(url);

  // 获取搜索参数（查询字符串）
  const searchParams = new URLSearchParams(urlObj.search);

  // 创建一个对象来存储参数
  const params: { [key: string]: string } = {};

  // 遍历所有参数并添加到对象中
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params;
}
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
      // 临时逻辑
      const urlparams = getURLParameters(window.location.href);
      if (urlparams.agentId === "case-analysis") {
        params.append("tag", "demo");
      }

      // 连接 SSE
      connect(`${baseURL}/chat/stream?${params.toString()}`, {
        onMessage: (token) => {
          const res = JSON.parse(token);
          onStream?.(res);
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
