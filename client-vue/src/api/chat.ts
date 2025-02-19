import axios from "axios";
import type { Message, Session, FileInfo } from "../types/chat";
import { API_BASE_URL } from "../config";
import { getClientIdHeader } from "../utils/clientId";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 添加请求拦截器，注入 clientId
api.interceptors.request.use((config) => {
  const headers = getClientIdHeader();
  Object.keys(headers).forEach((key) => {
    config.headers.set(key, headers[key]);
  });
  return config;
});

export const chatApi = {
  // 会话相关
  async getSessions(): Promise<{ sessions: Session[] }> {
    const { data } = await api.get("/sessions");
    return data;
  },

  async createSession(
    roleName?: string,
    systemPrompt?: string
  ): Promise<Session> {
    const { data } = await api.post("/session", {
      roleName,
      systemPrompt,
    });
    return data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await api.post(`/sessions/${sessionId}/delete`);
  },

  // 消息相关
  async getMessages(sessionId: string): Promise<{ messages: Message[] }> {
    const { data } = await api.get(`/sessions/${sessionId}/messages`);
    return data;
  },

  async sendMessage(sessionId: string, content: string): Promise<Message> {
    const params = new URLSearchParams();
    params.append("message", content);
    params.append("sessionId", sessionId);

    const { data } = await api.get("/stream", { params });
    return data;
  },

  // 文件相关
  async uploadFile(file: File): Promise<FileInfo> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/files/upload", formData);
    return data;
  },

  async getFiles(): Promise<FileInfo[]> {
    const { data } = await api.get("/files");
    return data;
  },

  async deleteFile(fileId: string): Promise<void> {
    await api.delete(`/files/${fileId}`);
  },

  // 流式聊天
  async streamChat(
    sessionId: string,
    content: string,
    signal: AbortSignal,
    onMessage: (message: string) => void
  ) {
    const params = new URLSearchParams();
    params.append("message", content);
    params.append("sessionId", sessionId);

    const response = await fetch(
      `${API_BASE_URL}/stream?${params.toString()}`,
      {
        method: "GET",
        headers: {
          ...getClientIdHeader(),
        },
        signal,
      }
    );

    if (!response.ok) {
      throw new Error("Stream chat failed");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Failed to get reader");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      onMessage(chunk);
    }
  },
};
