import axios, { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/config";
import { getClientIdHeader } from "./clientId";
import type { GetSessionMessagesResponse } from "@/types/api";

// 将baseURL改为从配置中导入
export const baseURL = API_BASE_URL;

// 创建 axios 实例
const api = axios.create({
  baseURL,
});

// 添加请求拦截器，注入 clientId
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers = getClientIdHeader();
  Object.keys(headers).forEach((key) => {
    config.headers.set(key, headers[key]);
  });
  return config;
});

interface CreateSessionParams {
  roleName?: string;
  systemPrompt?: string;
}

export const chatService = {
  // 创建新会话
  async createSession(params?: CreateSessionParams) {
    const response = await api.post("/chat/session", params);
    return response.data;
  },

  // 删除会话
  async deleteSession(sessionId: string) {
    const response = await api.post(`/chat/sessions/${sessionId}/delete`);
    return response.data;
  },

  // 获取所有会话
  async getSessions() {
    const response = await api.get("/chat/sessions");
    return response.data;
  },

  // 流式聊天
  async streamChat(
    message: string,
    sessionId?: string,
    useWebSearch?: boolean,
    useVectorSearch?: boolean,
    useTempDocSearch?: boolean,
    modelId: string = "bytedance_deepseek_r1",
    knowledgeBaseId?: string
  ) {
    const params = new URLSearchParams();
    params.append("message", message);
    if (sessionId) {
      params.append("sessionId", sessionId);
    }
    if (useWebSearch) {
      params.append("useWebSearch", "true");
    }
    if (useVectorSearch) {
      params.append("useVectorSearch", "true");
    }
    if (useTempDocSearch) {
      params.append("useTempDocSearch", "true");
    }
    if (knowledgeBaseId) {
      params.append("knowledgeBaseId", knowledgeBaseId);
    }
    params.append("modelId", modelId);

    const response = await api.get("/chat/stream", {
      params,
      responseType: "stream",
    });
    return response.data;
  },

  // 获取会话消息历史
  async getSessionMessages(
    sessionId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<GetSessionMessagesResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const response = await api.get(`/chat/sessions/${sessionId}/messages`, {
      params,
    });
    return response.data;
  },

  // 获取可用模型列表
  async getModels() {
    const response = await api.get("/chat/models");
    return response.data;
  },

  // 删除消息
  async deleteMessage(messageId: string) {
    const response = await api.post(`/chat/messages/${messageId}/delete`);
    return response.data;
  },
};

export const fileService = {
  // 创建知识库
  async createKnowledgeBase(name: string) {
    const response = await api.post("/knowledge-bases", { name });
    return response.data;
  },

  // 获取知识库列表
  async getKnowledgeBases() {
    const response = await api.get("/knowledge-bases");
    return response.data;
  },

  // 上传文件到知识库
  async uploadFile(
    file: File,
    knowledgeBaseId: string,
    chunkSize: number = 1000
  ) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chunkSize", chunkSize.toString());

    const response = await api.post(
      `/knowledge-bases/${knowledgeBaseId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // 获取知识库中的文件列表
  async getFiles(knowledgeBaseId: string) {
    const response = await api.get(
      `/knowledge-bases/${knowledgeBaseId}/documents`
    );
    return { files: response.data };
  },

  // 删除知识库中的文件
  async deleteFile(filename: string, knowledgeBaseId: string) {
    const response = await api.delete(
      `/knowledge-bases/${knowledgeBaseId}/documents/${filename}`
    );
    return response.data;
  },

  // 删除知识库
  async deleteKnowledgeBase(knowledgeBaseId: string) {
    const response = await api.delete(`/knowledge-bases/${knowledgeBaseId}`);
    return response.data;
  },

  // 上传临时文件
  async uploadTempFile(sessionId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(
      `/chat/sessions/${sessionId}/temp-files`,
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
    const response = await api.delete(`/chat/sessions/${sessionId}/temp-files`);
    return response.data;
  },
};

export const pptService = {
  // 生成PPT大纲
  async generateOutline(title: string): Promise<string> {
    const response = await api.post("/ppt/generate-outline", { title });
    return response.data.outline;
  },

  // 生成PPT内容
  async generateContent(title: string, outline: string): Promise<string> {
    const response = await api.post("/ppt/generate-content", {
      title,
      outline,
    });
    return response.data.content;
  },

  // 获取认证码
  async getAuthCode() {
    const response = await api.get("/ppt/auth/code");
    return response.data;
  },
};
