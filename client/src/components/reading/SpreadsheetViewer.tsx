import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";

interface SpreadsheetViewerProps {
  fileUrl: string;
  fileType: "csv" | "xlsx" | "xls";
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

export function SpreadsheetViewer({
  fileUrl,
  fileType,
}: SpreadsheetViewerProps) {
  const [data, setData] = useState<Array<Array<string | number>>>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();

        // 读取文件
        const options = {
          type: fileType === "csv" ? ("string" as const) : ("array" as const),
        };
        const workbook = XLSX.read(arrayBuffer, options);

        // 获取第一个工作表
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // 转换为数组格式，并确保类型正确
        const jsonData = XLSX.utils.sheet_to_json<Array<string | number>>(
          worksheet,
          {
            header: 1,
            raw: false, // 返回格式化的字符串
          }
        );

        setData(jsonData as Array<Array<string | number>>);
      } catch (err) {
        console.error("Error loading document:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [fileUrl, fileType]);

  if (loading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="h-full w-full bg-background">
      <ScrollArea className="h-full">
        <div className="p-6">
          <table className="w-full border-collapse overflow-x-auto">
            <thead>
              <tr>
                {data[0]?.map((header, index) => (
                  <th
                    key={index}
                    className="border border-border bg-muted px-4 py-2 text-left text-sm font-medium"
                  >
                    {String(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border border-border px-4 py-2 text-sm"
                    >
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </div>
  );
}
