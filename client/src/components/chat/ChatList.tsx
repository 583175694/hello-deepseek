"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useSessionManager } from "@/contexts/SessionContext";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { useRef, useEffect } from "react";
import type { Session } from "@/types/chat";

// 定义列表项组件的数据类型
interface ItemData {
  sessions: Session[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  handleDeleteSession: (e: React.MouseEvent, id: string) => void;
}

const ChatItem = ({
  index,
  style,
  data,
}: ListChildComponentProps<ItemData>) => {
  const session = data.sessions[index];
  return (
    <div
      style={style}
      className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 group ${
        session.sessionId === data.currentSessionId ? "bg-muted" : ""
      }`}
      onClick={() => data.setCurrentSessionId(session.sessionId)}
    >
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-xs text-muted-foreground">
          {format(new Date(session.createdAt), "MM/dd HH:mm")}
        </span>
        <span className="font-medium truncate">
          {session.roleName || "⭐️ 默认助手"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 ml-2 shrink-0"
        onClick={(e) => data.handleDeleteSession(e, session.sessionId)}
      >
        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
};

export function ChatList() {
  const { sessions, currentSessionId, setCurrentSessionId, deleteSession } =
    useSessionManager();
  const listRef = useRef<FixedSizeList>(null);

  const handleDeleteSession = async (
    e: React.MouseEvent,
    sessionId: string
  ) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error("删除对话失败:", error);
    }
  };

  // 当 currentSessionId 改变时，滚动到当前选中的会话
  useEffect(() => {
    if (listRef.current && currentSessionId) {
      const index = sessions.findIndex((s) => s.sessionId === currentSessionId);
      if (index !== -1) {
        listRef.current.scrollToItem(index, "smart");
      }
    }
  }, [currentSessionId, sessions]);

  const ITEM_HEIGHT = 76; // 每个列表项的高度（包含 padding）

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
      {sessions.length === 0 ? (
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground p-4 text-center">
          暂无会话记录
        </div>
      ) : (
        <FixedSizeList
          ref={listRef}
          height={window.innerHeight} // 减去头部和其他元素的高度
          width="100%"
          itemCount={sessions.length}
          itemSize={ITEM_HEIGHT}
          itemData={{
            sessions,
            currentSessionId: currentSessionId || "",
            setCurrentSessionId,
            handleDeleteSession,
          }}
          className="scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border/80 scrollbar-track-transparent"
          style={{ overflowX: "hidden" }}
        >
          {ChatItem}
        </FixedSizeList>
      )}
    </div>
  );
}
