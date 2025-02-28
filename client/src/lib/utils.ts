import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 复制文本到剪贴板
 * @param text 要复制的文本
 * @returns Promise<boolean> 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    toast.success("已复制到剪贴板");
    return true;
  } catch (err) {
    console.error("复制失败:", err);
    toast.error("复制失败");
    return false;
  }
}

/**
 * 下载文本内容为文件
 * @param content 文件内容
 * @param filename 文件名
 * @param mimeType 文件类型
 */
export function downloadAsFile(
  content: string,
  filename: string,
  mimeType: string = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
) {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("下载失败:", error);
    toast.error("下载失败");
  }
}

/**
 * 生成带时间戳的文件名
 * @param prefix 文件名前缀
 * @param extension 文件扩展名
 * @returns 带时间戳的文件名
 */
export function generateTimestampFilename(
  prefix: string,
  extension: string
): string {
  const now = new Date();
  const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
    .getHours()
    .toString()
    .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;
  return `${prefix}_${timestamp}.${extension}`;
}

/**
 * 格式化 URL 域名（移除 www 前缀）
 * @param url URL 字符串
 * @returns 格式化后的域名
 */
export function formatUrlHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "未知来源";
  }
}
