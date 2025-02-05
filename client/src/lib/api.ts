import axios from 'axios';
import type { ChatRequest, ChatResponse } from '@/types/api';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const chatService = {
  chat: async (data: ChatRequest) => {
    const response = await api.post<ChatResponse>('/chat', data);
    return response.data;
  },
}; 