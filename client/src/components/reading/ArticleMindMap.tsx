import { MindMapViewer } from "./MindMapViewer";

interface ArticleMindMapProps {
  isLoading: boolean;
  mindMap: string | null;
}

export function ArticleMindMap({ isLoading, mindMap }: ArticleMindMapProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold mb-4">脑图</h2>

      {isLoading && !mindMap && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">正在生成脑图...</span>
        </div>
      )}

      {mindMap && (
        <div className="flex-1">
          <MindMapViewer markdown={mindMap} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}
