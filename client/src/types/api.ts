import type { Message } from "./chat";

export interface ChatRequest {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface ChatResponse {
  content: string;
}

export interface APIError {
  message: string;
  code?: string;
}

export interface TempFile {
  filename: string;
  type: string;
  size: number;
  createdAt: string;
}

export interface GetSessionMessagesResponse {
  messages: Message[];
  tempFiles?: TempFile[];
}
