"use client";

import { Button } from "@/components/ui/button";
import { format, isToday, subDays, subMonths, isThisYear } from "date-fns";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import { toast } from "sonner";

// 定义时间区间类型
type TimeInterval =
  | "today"
  | "withinWeek"
  | "withinMonth"
  | "thisYear"
  | "earlier";

// 按时间区间对会话进行分组
const groupSessionsByTimeInterval = (sessions: Session[]) => {
  const groups: Record<TimeInterval, Session[]> = {
    today: [],
    withinWeek: [],
    withinMonth: [],
    thisYear: [],
    earlier: [],
  };

  const now = new Date();
  const oneWeekAgo = subDays(now, 7);
  const oneMonthAgo = subMonths(now, 1);

  sessions.forEach((session) => {
    const date = new Date(session.createdAt);
    if (isToday(date)) {
      groups.today.push(session);
    } else if (date >= oneWeekAgo) {
      groups.withinWeek.push(session);
    } else if (date >= oneMonthAgo) {
      groups.withinMonth.push(session);
    } else if (isThisYear(date)) {
      groups.thisYear.push(session);
    } else {
      groups.earlier.push(session);
    }
  });

  return groups;
};

// 获取时间区间的显示名称
const getIntervalLabel = (interval: TimeInterval): string => {
  switch (interval) {
    case "today":
      return "今天";
    case "withinWeek":
      return "一周内";
    case "withinMonth":
      return "一个月内";
    case "thisYear":
      return "今年";
    case "earlier":
      return "更早";
    default:
      return "";
  }
};

interface ChatItemProps {
  session: Session;
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  handleOpenDeleteDialog: (e: React.MouseEvent, sessionId: string) => void;
  onRename: (sessionId: string, newName: string) => void;
}

const ChatItem = ({
  session,
  currentSessionId,
  setCurrentSessionId,
  handleOpenDeleteDialog,
  onRename,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(session.roleName || "默认助手");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClick = () => {
    setCurrentSessionId(session.sessionId);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(session.sessionId, newName.trim());
      setIsEditing(false);
      setPopoverOpen(false);
    }
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
        <span className="text-[0.7rem] text-muted-foreground flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
          {format(new Date(session.createdAt), "MM/dd HH:mm")}
        </span>
        <span className="text-sm font-medium truncate whitespace-nowrap overflow-hidden text-ellipsis">
          {session.roleName || "默认助手"}
        </span>
      </div>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 ml-2 shrink-0 transition-all duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-52 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          {isEditing ? (
            <form onSubmit={handleRename} className="space-y-2">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="输入新名称"
                className="h-8"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setNewName(session.roleName || "默认助手");
                  }}
                >
                  取消
                </Button>
                <Button type="submit" size="sm">
                  保存
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col">
              <Button
                variant="ghost"
                size="sm"
                className="justify-start"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                重命名
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-destructive hover:text-destructive"
                onClick={(e) => {
                  handleOpenDeleteDialog(e, session.sessionId);
                  setPopoverOpen(false);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

// 时间区间分组组件
const TimeIntervalGroup = ({
  interval,
  sessions,
  currentSessionId,
  setCurrentSessionId,
  handleOpenDeleteDialog,
  onRename,
}: {
  interval: TimeInterval;
  sessions: Session[];
  currentSessionId: string;
  setCurrentSessionId: (id: string) => void;
  handleOpenDeleteDialog: (e: React.MouseEvent, sessionId: string) => void;
  onRename: (sessionId: string, newName: string) => void;
}) => {
  if (sessions.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
        {getIntervalLabel(interval)}
      </div>
      <div className="space-y-1">
        {sessions.map((session) => (
          <div key={session.sessionId} data-session-id={session.sessionId}>
            <ChatItem
              session={session}
              currentSessionId={currentSessionId}
              setCurrentSessionId={setCurrentSessionId}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              onRename={onRename}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export function ChatList() {
  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    deleteSession,
    updateSession,
  } = useSessionManager();
  const listRef = useRef<HTMLDivElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(currentSessionId);

  // 按时间区间对会话进行分组
  const groupedSessions = groupSessionsByTimeInterval(sessions);

  const handleSessionClick = (sessionId: string) => {
    setSelectedId(sessionId);
    setCurrentSessionId(sessionId);
  };

  const handleOpenDeleteDialog = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleRename = async (sessionId: string, newName: string) => {
    try {
      await updateSession(sessionId, { roleName: newName });
      toast.success("会话名称已更新");
    } catch (error) {
      console.error("更新会话名称失败:", error);
      toast.error("更新会话名称失败");
    }
  };

  useEffect(() => {
    setSelectedId(currentSessionId);
  }, [currentSessionId]);

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
      toast.success("对话已删除");
    } catch (error) {
      console.error("删除对话失败:", error);
      toast.error("删除对话失败");
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
            {/* 按时间区间显示分组会话 */}
            <TimeIntervalGroup
              interval="today"
              sessions={groupedSessions.today}
              currentSessionId={selectedId || ""}
              setCurrentSessionId={handleSessionClick}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              onRename={handleRename}
            />
            <TimeIntervalGroup
              interval="withinWeek"
              sessions={groupedSessions.withinWeek}
              currentSessionId={selectedId || ""}
              setCurrentSessionId={handleSessionClick}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              onRename={handleRename}
            />
            <TimeIntervalGroup
              interval="withinMonth"
              sessions={groupedSessions.withinMonth}
              currentSessionId={selectedId || ""}
              setCurrentSessionId={handleSessionClick}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              onRename={handleRename}
            />
            <TimeIntervalGroup
              interval="thisYear"
              sessions={groupedSessions.thisYear}
              currentSessionId={selectedId || ""}
              setCurrentSessionId={handleSessionClick}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              onRename={handleRename}
            />
            <TimeIntervalGroup
              interval="earlier"
              sessions={groupedSessions.earlier}
              currentSessionId={selectedId || ""}
              setCurrentSessionId={handleSessionClick}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              onRename={handleRename}
            />
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
