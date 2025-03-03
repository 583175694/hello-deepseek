import axios, { InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/config";
import { getClientIdHeader } from "./clientId";
import type { GetSessionMessagesResponse } from "@/types/api";
import { toast } from "sonner";

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

// 添加响应拦截器，处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 获取错误信息
    const errorMessage =
      error.response?.data?.message || error.message || "请求失败";

    // 根据状态码显示不同的错误提示
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error("未授权，请重新登录");
          break;
        case 403:
          toast.error("拒绝访问");
          break;
        case 404:
          toast.error("请求的资源不存在");
          break;
        case 500:
          toast.error("服务器错误");
          break;
        default:
          toast.error(errorMessage);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      toast.error("网络错误，请检查网络连接");
    } else {
      // 请求配置出错
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

interface CreateSessionParams {
  roleName?: string;
  systemPrompt?: string;
}

interface GeneratePromptResponse {
  systemPrompt: string;
}

export const chatService = {
  // 创建新会话
  async createSession(params?: CreateSessionParams) {
    const response = await api.post("/chat/session", params);
    return response.data;
  },

  // 生成系统提示词
  async generatePrompt(roleName: string): Promise<GeneratePromptResponse> {
    const response = await api.post("/chat/generate-prompt", { roleName });
    return response.data;
  },

  // 更新会话
  async updateSession(sessionId: string, updates: any) {
    const response = await api.post(
      `/chat/sessions/${sessionId}/update`,
      updates
    );
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
    modelId: string = "bytedance_deepseek_r1"
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

// 添加 Reader 服务
export const readerService = {
  // 上传 PDF 文件
  async uploadPDF(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/reader/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 删除 PDF 文件
  async deletePDF(filename: string) {
    const response = await api.delete(`/reader/file/${filename}`);
    return response.data;
  },

  // 获取上传的PDF文件列表
  async getUploadedFiles() {
    const response = await api.get("/reader/files");
    return response.data;
  },

  // 获取PDF文件内容
  async getPDFFile(filename: string) {
    const response = await api.get(`/reader/file/${filename}`, {
      responseType: "blob",
    });
    return response.data;
  },
};
