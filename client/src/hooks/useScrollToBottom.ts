import {
  useCallback,
  useEffect,
  useRef,
  useState,
  DependencyList,
} from "react";

interface ScrollToBottomOptions {
  threshold?: number;
  behavior?: ScrollBehavior;
}

export function useScrollToBottom(
  deps: DependencyList = [],
  options: ScrollToBottomOptions = {}
) {
  const { threshold = 100, behavior = "smooth" } = options;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
    // 更新是否在底部的状态
    setShouldAutoScroll(isAtBottom());

    // 清除之前的定时器
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  }, [isAtBottom]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    console.log(111);
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, [behavior]);

  // 监听滚动事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // 在依赖变化时处理滚动
  useEffect(() => {
    // 如果内容为空，总是滚动到底部
    if (!scrollContainerRef.current?.childElementCount) {
      setShouldAutoScroll(true);
      scrollToBottom();
      return;
    }

    // 如果用户在底部，就滚动到底部
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [...deps, shouldAutoScroll]);

  return {
    messagesEndRef,
    scrollContainerRef,
    shouldAutoScroll,
    setShouldAutoScroll,
    isAtBottom,
    scrollToBottom,
  };
}
