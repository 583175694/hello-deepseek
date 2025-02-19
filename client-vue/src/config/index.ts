// 根据环境变量设置 API 基础 URL
const API_HOST = import.meta.env.VITE_API_URL || "http://localhost:3030/api";
export const API_BASE_URL = `${API_HOST}/chat`;
