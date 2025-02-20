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
  debounceTime?: number;
}

export function useScrollToBottom(
  deps: DependencyList = [],
  options: ScrollToBottomOptions = {}
) {
  const { threshold = 100, behavior = "smooth", debounceTime = 500 } = options;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const userScrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
    // 标记用户正在滚动
    isUserScrollingRef.current = true;

    // 清除之前的用户滚动超时
    if (userScrollTimeoutRef.current) {
      clearTimeout(userScrollTimeoutRef.current);
    }

    // 更新是否在底部的状态
    setShouldAutoScroll(isAtBottom());

    // 0.5秒后重置用户滚动状态
    userScrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, debounceTime);
  }, [isAtBottom, debounceTime]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    // 如果用户正在滚动，不执行自动滚动
    if (isUserScrollingRef.current) return;

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
      if (userScrollTimeoutRef.current) {
        clearTimeout(userScrollTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // 在依赖变化时处理滚动
  useEffect(() => {
    // 如果内容为空或切换会话，总是滚动到底部
    if (!scrollContainerRef.current?.childElementCount) {
      setShouldAutoScroll(true);
      isUserScrollingRef.current = false; // 重置用户滚动状态
      scrollToBottom();
      return;
    }

    // 如果用户在底部或AI正在流式回复，就滚动到底部
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
