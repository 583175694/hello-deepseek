// 优先使用环境变量中的配置，如果没有则使用默认值
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "http://pipishrimp.cn/api"
    : "http://localhost:3030/api");
