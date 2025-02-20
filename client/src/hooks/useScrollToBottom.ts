import { useCallback, useEffect, useRef, useState } from "react";

interface ScrollToBottomOptions {
  threshold?: number;
  behavior?: ScrollBehavior;
  isStreaming?: boolean;
}

export function useScrollToBottom(options: ScrollToBottomOptions = {}) {
  const { threshold = 100, behavior = "smooth", isStreaming = false } = options;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastScrollPositionRef = useRef(0);

  // 检查是否在底部
  const isAtBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return true;

    return (
      container.scrollHeight - container.scrollTop - container.clientHeight <=
      threshold
    );
  }, [threshold]);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 记录最后的滚动位置
    lastScrollPositionRef.current = container.scrollTop;
    console.log("lastScrollPositionRef.current", lastScrollPositionRef.current);
    // 只在用户滚动到底部时更新自动滚动状态
    if (isAtBottom()) {
      setShouldAutoScroll(true);
    } else {
      setShouldAutoScroll(false);
    }
  }, [isAtBottom]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [behavior]);

  // 监听滚动事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 在依赖变化时处理滚动
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 如果内容为空，总是滚动到底部
    if (!container.childElementCount) {
      setShouldAutoScroll(true);
      scrollToBottom();
      return;
    }

    // 只在以下情况滚动到底部：
    // 1. 用户之前在底部（shouldAutoScroll 为 true）
    // 2. 正在流式响应中，且用户之前在底部
    if (
      shouldAutoScroll &&
      (isStreaming || lastScrollPositionRef.current === 0)
    ) {
      scrollToBottom();
    }
  }, [isStreaming, scrollToBottom, shouldAutoScroll]);

  return {
    messagesEndRef,
    scrollContainerRef,
    shouldAutoScroll,
    setShouldAutoScroll,
    isAtBottom,
    scrollToBottom,
  };
}
