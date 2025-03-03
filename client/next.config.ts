import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // 解决pdfjs-dist中的canvas依赖问题
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },

  // 添加以下优化配置
  swcMinify: true, // 使用 SWC 进行压缩
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,

  // 配置构建缓存
  experimental: {
    // turbotrace: {
    //   logLevel: "error",
    // },
  },
};

export default nextConfig;
