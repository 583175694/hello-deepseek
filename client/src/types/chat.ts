export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  searchContext?: string;
  sources?: string;
  tempFiles?: string;
  status?: string;
  createdAt: string;
  type: "content" | "reasoning" | "sources" | "temp" | "status";
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
  firstMessage: string;
  lastMessage: string;
  messageCount: number;
  roleName?: string;
  systemPrompt?: string;
}
