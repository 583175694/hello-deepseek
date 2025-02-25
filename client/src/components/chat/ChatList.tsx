"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useSessionManager } from "@/contexts/SessionContext";
import { useRef, useEffect, useState } from "react";
import type { Session } from "@/types/chat";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface ChatItemProps {
  session: Session;
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  handleOpenDeleteDialog: (e: React.MouseEvent, sessionId: string) => void;
}

const ChatItem = ({
  session,
  currentSessionId,
  setCurrentSessionId,
  handleOpenDeleteDialog,
}: ChatItemProps) => {
  const handleClick = () => {
    // 立即更新视觉状态
    const clickedElement = document.querySelector(
      `[data-session-id="${session.sessionId}"]`
    );
    if (clickedElement) {
      const allItems = document.querySelectorAll("[data-session-id]");
      allItems.forEach((item) =>
        item.classList.remove("bg-muted", "shadow-sm")
      );
      clickedElement.classList.add("bg-muted", "shadow-sm");
    }
    setCurrentSessionId(session.sessionId);
  };

  return (
    <div
      className={`flex items-center justify-between p-3 cursor-pointer 
        hover:bg-muted/50 group
        rounded-lg mx-1
        ${
          session.sessionId === currentSessionId
            ? "bg-muted shadow-sm"
            : "hover:shadow-sm"
        }`}
      onClick={handleClick}
    >
      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
        <span className="text-[0.7rem] text-muted-foreground flex items-center gap-2">
          {format(new Date(session.createdAt), "MM/dd HH:mm")}
        </span>
        <span className="text-sm font-medium truncate">
          {session.roleName || "⭐️ 默认助手"}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 ml-2 shrink-0 transition-all duration-200 hover:bg-destructive/10"
        onClick={(e) => handleOpenDeleteDialog(e, session.sessionId)}
      >
        <Trash2 className="w-3.5 h-3.5 text-muted-foreground [.hover\:bg-destructive\/10_&]:text-destructive transition-colors duration-200" />
      </Button>
    </div>
  );
};

export function ChatList() {
  const { sessions, currentSessionId, setCurrentSessionId, deleteSession } =
    useSessionManager();
  const listRef = useRef<HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(currentSessionId);

  const handleSessionClick = (sessionId: string) => {
    setSelectedId(sessionId); // 立即更新选中状态
    setCurrentSessionId(sessionId); // 触发实际的会话切换
  };

  const handleOpenDeleteDialog = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  // 当 currentSessionId 从外部更新时，同步更新 selectedId
  useEffect(() => {
    setSelectedId(currentSessionId);
  }, [currentSessionId]);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error("删除对话失败:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-sm text-muted-foreground p-4 text-center gap-2">
          <span>暂无会话记录</span>
          <span className="text-xs opacity-50">开始新的对话以创建会话</span>
        </div>
      ) : (
        <>
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border hover:scrollbar-thumb-border/80 scrollbar-track-transparent py-1"
          >
            {sessions.map((session) => (
              <div key={session.sessionId} data-session-id={session.sessionId}>
                <ChatItem
                  session={session}
                  currentSessionId={selectedId || ""}
                  setCurrentSessionId={handleSessionClick}
                  handleOpenDeleteDialog={handleOpenDeleteDialog}
                />
              </div>
            ))}
          </div>
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确认删除会话</AlertDialogTitle>
                <AlertDialogDescription>
                  此操作将永久删除该会话记录，删除后将无法恢复。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSessionToDelete(null)}>
                  取消
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() =>
                    sessionToDelete && handleDeleteSession(sessionToDelete)
                  }
                >
                  确认删除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
