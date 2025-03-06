import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface TextViewerProps {
  fileUrl: string;
  fileType: "txt" | "md";
}

const ErrorComponent = () => (
  <div className="flex flex-col items-center justify-center h-full text-destructive gap-2">
    <AlertCircle className="w-8 h-8" />
    <p>文件预览失败</p>
    <p className="text-sm text-muted-foreground">请尝试下载文件后查看</p>
  </div>
);

const LoadingComponent = () => (
  <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
    <p>正在加载文档...</p>
  </div>
);

export function TextViewer({ fileUrl, fileType }: TextViewerProps) {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(fileUrl);
        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error("Error loading document:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [fileUrl]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="h-full w-full bg-background">
      <ScrollArea className="h-full">
        <div className="p-6 prose prose-sm max-w-none dark:prose-invert scrollbar-none">
          {fileType === "md" ? (
            <ReactMarkdown>{content}</ReactMarkdown>
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm">
              {content}
            </pre>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
