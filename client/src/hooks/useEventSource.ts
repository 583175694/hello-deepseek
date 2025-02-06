import { useCallback, useRef } from "react";

interface EventSourceOptions {
  onMessage?: (data: string) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useEventSource() {
  const eventSourceRef = useRef<EventSource | null>(null);

  const close = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const connect = useCallback(
    (url: string, options: EventSourceOptions = {}) => {
      // 先关闭已存在的连接
      close();

      const source = new EventSource(url);
      eventSourceRef.current = source;

      source.onopen = () => {
        options.onOpen?.();
      };

      source.onmessage = (event) => {
        if (event.data === "[DONE]") {
          close();
          options.onClose?.();
          return;
        }
        options.onMessage?.(event.data);
      };

      source.onerror = (error) => {
        options.onError?.(error);
        close();
      };

      // 返回清理函数
      return () => {
        close();
      };
    },
    [close]
  );

  return {
    connect,
    close,
    eventSource: eventSourceRef.current,
  };
}
