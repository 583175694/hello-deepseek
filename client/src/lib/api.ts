import axios from "axios";
import type { ChatRequest, ChatResponse } from "@/types/api";

export const baseURL = "http://localhost:3030/api";
const api = axios.create({
  baseURL,
});

export const chatService = {
  chat: async (data: ChatRequest) => {
    const response = await api.post<ChatResponse>("/chat", data);
    return response.data;
  },
};
