import ReactMarkdown from "react-markdown";

interface ArticleMindMapProps {
  isLoading: boolean;
  mindMap: string | null;
}

export function ArticleMindMap({ isLoading, mindMap }: ArticleMindMapProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4">脑图</h2>

      {isLoading && !mindMap && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">正在生成脑图...</span>
        </div>
      )}

      {isLoading && mindMap && (
        <div className="flex items-center mb-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
          <span className="text-sm">正在生成脑图...</span>
        </div>
      )}

      {mindMap && (
        <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto">
          <ReactMarkdown>{mindMap}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
