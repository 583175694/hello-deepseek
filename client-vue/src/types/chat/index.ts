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

export interface FileInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: string;
  type: string;
}

export interface ChatState {
  currentSession: Session | null;
  sessions: Session[];
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export interface SendMessageParams {
  content: string;
  sessionId?: string;
  files?: File[];
  useWeb?: boolean;
  useKnowledge?: boolean;
}

export interface CreateSessionParams {
  roleName?: string;
  systemPrompt?: string;
}

export interface UploadFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}
