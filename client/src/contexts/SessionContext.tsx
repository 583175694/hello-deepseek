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

type SessionContextType = {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  loadSessions: () => Promise<void>;
  createNewSession: () => Promise<Session>;
  deleteSession: (sessionId: string) => Promise<void>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      const { sessions } = await chatService.getSessions();
      setSessions(sessions);
    } catch (error) {
      console.error("加载会话列表失败:", error);
    }
  }, []);

  const createNewSession = useCallback(async () => {
    try {
      const session = await chatService.createSession();
      setSessions((prev) => [session, ...prev]);
      setCurrentSessionId(session.sessionId);
      return session;
    } catch (error) {
      console.error("创建会话失败:", error);
      throw error;
    }
  }, []);

  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await chatService.deleteSession(sessionId);
      setSessions((prev) => prev.filter(session => session.sessionId !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
    } catch (error) {
      console.error("删除会话失败:", error);
      throw error;
    }
  }, [currentSessionId]);

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
