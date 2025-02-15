import axios from "axios";
import type { ChatRequest, ChatResponse } from "@/types/api";
import { API_BASE_URL } from "@/config";

// 将baseURL改为从配置中导入
export const baseURL = API_BASE_URL;

// 创建 axios 实例
const api = axios.create({
  baseURL,
});

// 创建通用的请求拦截器
const request = {
  async fetch(url: string, options?: RequestInit) {
    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        // 这里可以添加其他通用的 headers
      },
      ...options,
    };

    const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`;

    try {
      const response = await fetch(fullUrl, defaultOptions);
      if (!response.ok) {
        throw new Error(`请求失败: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      console.error("请求错误:", error);
      throw error;
    }
  },
};

interface CreateSessionParams {
  roleName?: string;
  systemPrompt?: string;
}

export const chatService = {
  chat: async (data: ChatRequest) => {
    const response = await api.post<ChatResponse>("/chat", data);
    return response.data;
  },

  // 创建新会话
  async createSession(params?: CreateSessionParams) {
    const response = await request.fetch("/chat/session", {
      method: "POST",
      body: params ? JSON.stringify(params) : undefined,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // 删除会话
  async deleteSession(sessionId: string) {
    const response = await request.fetch(`/chat/sessions/${sessionId}/delete`, {
      method: "POST",
    });
    return response.json();
  },

  // 获取所有会话
  async getSessions() {
    const response = await request.fetch("/chat/sessions");
    return response.json();
  },

  // 流式聊天
  async streamChat(message: string, sessionId?: string) {
    const url = new URL("/api/chat/stream", baseURL);
    url.searchParams.append("message", message);
    if (sessionId) {
      url.searchParams.append("sessionId", sessionId);
    }

    const response = await request.fetch(url.toString());
    return response.body;
  },

  // 获取会话消息历史
  async getSessionMessages(sessionId: string) {
    const response = await request.fetch(
      `/chat/sessions/${sessionId}/messages`
    );
    return response.json();
  },
};

export const fileService = {
  // 上传文件
  async uploadFile(file: File, chunkSize: number = 1000) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chunkSize", chunkSize.toString());

    const response = await request.fetch("/chat/files/upload", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header when sending FormData
      headers: {},
    });
    return response.json();
  },

  // 获取文件列表
  async getFiles() {
    const response = await request.fetch("/chat/files");
    return response.json();
  },

  // 删除文件
  async deleteFile(filename: string) {
    const response = await request.fetch(`/chat/files/${filename}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // 上传临时文件
  async uploadTempFile(sessionId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await request.fetch(
      `/chat/sessions/${sessionId}/temp-files`,
      {
        method: "POST",
        body: formData,
        headers: {},
      }
    );
    return response.json();
  },

  // 清理临时文件
  async cleanupTempFiles(sessionId: string) {
    const response = await request.fetch(
      `/chat/sessions/${sessionId}/temp-files`,
      {
        method: "DELETE",
      }
    );
    return response.json();
  },
};
