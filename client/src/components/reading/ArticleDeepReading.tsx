import ReactMarkdown from "react-markdown";

interface ArticleDeepReadingProps {
  isLoading: boolean;
  deepReading: string | null;
}

export function ArticleDeepReading({
  isLoading,
  deepReading,
}: ArticleDeepReadingProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4">精读分析</h2>

      {isLoading && !deepReading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">正在生成精读分析...</span>
        </div>
      )}

      {isLoading && deepReading && (
        <div className="flex items-center mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          <span className="text-sm">正在生成精读分析...</span>
        </div>
      )}

      {deepReading && (
        <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto">
          <ReactMarkdown>{deepReading}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
