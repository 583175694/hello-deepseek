"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { chatService } from "@/lib/api";
import type { Session } from "@/types/chat";
import { toast } from "sonner";

type SessionContextType = {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  loadSessions: () => Promise<void>;
  createNewSession: (params?: {
    roleName: string;
    systemPrompt: string;
  }) => Promise<Session>;
  deleteSession: (sessionId: string) => Promise<void>;
  updateSession: (
    sessionId: string,
    updates: Partial<Session>
  ) => Promise<void>;
  hasTempDocs: boolean;
  setHasTempDocs: (value: boolean) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [hasTempDocs, setHasTempDocs] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const { sessions } = await chatService.getSessions();
      setSessions(sessions);
    } catch (error) {
      console.error("加载会话列表失败:", error);
      toast.error("加载会话列表失败");
    }
  }, []);

  const createNewSession = useCallback(
    async (params?: { roleName: string; systemPrompt: string }) => {
      try {
        console.log("创建新会话", params);
        const session = await chatService.createSession(params);
        setSessions((prev) => [session, ...prev]);
        setCurrentSessionId(session.sessionId);
        setHasTempDocs(false);
        return session;
      } catch (error) {
        console.error("创建会话失败:", error);
        toast.error("创建会话失败");
        throw error;
      }
    },
    []
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await chatService.deleteSession(sessionId);
        setSessions((prev) =>
          prev.filter((session) => session.sessionId !== sessionId)
        );
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null);
        }
      } catch (error) {
        console.error("删除会话失败:", error);
        toast.error("删除会话失败");
        throw error;
      }
    },
    [currentSessionId]
  );

  const updateSession = useCallback(
    async (sessionId: string, updates: Partial<Session>) => {
      try {
        await chatService.updateSession(sessionId, updates);
        setSessions((prev) =>
          prev.map((session) =>
            session.sessionId === sessionId
              ? { ...session, ...updates }
              : session
          )
        );
      } catch (error) {
        console.error("更新会话失败:", error);
        toast.error("更新会话失败");
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <SessionContext.Provider
      value={{
        sessions,
        setSessions,
        currentSessionId,
        setCurrentSessionId,
        loadSessions,
        createNewSession,
        deleteSession,
        updateSession,
        hasTempDocs,
        setHasTempDocs,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionManager() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSessionManager must be used within a SessionProvider");
  }
  return context;
}
