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
