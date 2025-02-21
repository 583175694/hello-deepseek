import React, { createContext, useContext, useState } from "react";

type Session = {
  id: string;
  name: string;
  createdAt: Date;
};

type SessionContextType = {
  sessions: Session[];
  currentSession: Session | null;
  createNewSession: (name: string) => void;
  setCurrentSession: (session: Session) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  const createNewSession = (name: string) => {
    const newSession = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      createdAt: new Date(),
    };
    setSessions((prev) => [...prev, newSession]);
    setCurrentSession(newSession);
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        currentSession,
        createNewSession,
        setCurrentSession,
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
