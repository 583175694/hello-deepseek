import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "量子皮皮虾 - QUANTUM SHRIMP",
  description: "量子皮皮虾 - QUANTUM SHRIMP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
        <Script
          strategy="afterInteractive" // 推荐策略：页面加载完成后执行
          src="https://api-static.aippt.cn/aippt-iframe-sdk.js"
        />
      </body>
    </html>
  );
}
