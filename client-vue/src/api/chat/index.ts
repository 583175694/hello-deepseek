import axios from "axios";
import type { CreateSessionParams, SendMessageParams } from "@/types/chat";

const api = axios.create({
  baseURL: "http://localhost:3030",
});

export const chatApi = {
  // 发送消息
  async sendMessage(params: SendMessageParams) {
    const formData = new FormData();
    formData.append("content", params.content);
    if (params.sessionId) {
      formData.append("sessionId", params.sessionId);
    }
    if (params.files?.length) {
      params.files.forEach((file) => {
        formData.append("files", file);
      });
    }
    if (params.useWeb !== undefined) {
      formData.append("useWeb", String(params.useWeb));
    }
    if (params.useKnowledge !== undefined) {
      formData.append("useKnowledge", String(params.useKnowledge));
    }

    const response = await api.post("/chat", formData);
    return response.data;
  },

  // 流式聊天
  async streamChat(message: string, sessionId?: string) {
    const params = new URLSearchParams();
    params.append("message", message);
    if (sessionId) {
      params.append("sessionId", sessionId);
    }

    const response = await api.get("/chat/stream", {
      params,
      responseType: "stream",
    });
    return response.data;
  },

  // 创建新会话
  async createSession(params?: CreateSessionParams) {
    const response = await api.post("/chat/session", params);
    return response.data;
  },

  // 删除会话
  async deleteSession(sessionId: string) {
    const response = await api.post(`/chat/session/${sessionId}/delete`);
    return response.data;
  },

  // 获取所有会话
  async getSessions() {
    const response = await api.get("/chat/session");
    return response.data;
  },

  // 获取会话消息历史
  async getSessionMessages(sessionId: string) {
    const response = await api.get(`/chat/session/${sessionId}/messages`);
    return response.data;
  },
};

export const fileApi = {
  // 上传文件
  async uploadFile(file: File, chunkSize: number = 1000) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chunkSize", chunkSize.toString());

    const response = await api.post("/chat/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 获取文件列表
  async getFiles() {
    const response = await api.get("/chat/files");
    return response.data;
  },

  // 删除文件
  async deleteFile(filename: string) {
    const response = await api.delete(`/chat/files/${filename}`);
    return response.data;
  },

  // 上传临时文件
  async uploadTempFile(sessionId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/chat/session/${sessionId}/temp-files`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // 清理临时文件
  async cleanupTempFiles(sessionId: string) {
    const response = await api.delete(`/chat/session/${sessionId}/temp-files`);
    return response.data;
  },
};
