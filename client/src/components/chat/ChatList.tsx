"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { useSessionManager } from "@/contexts/SessionContext";

export function ChatList() {
  const { sessions, currentSessionId, setCurrentSessionId, createNewSession, deleteSession } = useSessionManager();

  const handleNewChat = async () => {
    try {
      await createNewSession();
    } catch (error) {
      console.error("创建新对话失败:", error);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
    } catch (error) {
      console.error("删除对话失败:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button className="w-full" onClick={handleNewChat}>
          <Plus className="w-4 h-4 mr-2" />
          新对话
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {sessions.map((session) => (
          <div
            key={session.sessionId}
            className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 group ${
              session.sessionId === currentSessionId ? "bg-muted" : ""
            }`}
            onClick={() => setCurrentSessionId(session.sessionId)}
          >
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs text-muted-foreground">
                {format(new Date(session.createdAt), "MM/dd HH:mm")}
              </span>
              <span className="font-medium truncate">{session.lastMessage}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 ml-2"
              onClick={(e) => handleDeleteSession(e, session.sessionId)}
            >
              <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 