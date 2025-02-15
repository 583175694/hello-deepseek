export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  sources?: string;
  createdAt: string;
  type: "content" | "reasoning" | "sources" | "temp";
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
