export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  type: "content" | "reasoning" | "sources";
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  type: "content" | "reasoning" | "sources";
}

export interface Session {
  sessionId: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messageCount: number;
}
