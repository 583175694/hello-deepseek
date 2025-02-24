import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/contexts/SessionContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          strategy="afterInteractive" // 推荐策略：页面加载完成后执行
          src="https://api-static.aippt.cn/aippt-iframe-sdk.js"
        />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
