import { useState } from "react";
import { ArticleSummary } from "./ArticleSummary";
import { ArticleDeepReading } from "./ArticleDeepReading";
import { ArticleMindMap } from "./ArticleMindMap";

type AnalysisTab = "summary" | "deepReading" | "mindMap";

interface ArticleAnalysisProps {
  isLoading: boolean;
  summary: string | null;
  deepReading: string | null;
  mindMap: string | null;
}

export function ArticleAnalysis({
  isLoading,
  summary,
  deepReading,
  mindMap,
}: ArticleAnalysisProps) {
  const [activeTab, setActiveTab] = useState<AnalysisTab>("summary");

  const tabs = [
    { id: "summary" as const, name: "摘要" },
    { id: "deepReading" as const, name: "精读" },
    { id: "mindMap" as const, name: "脑图" },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4 pb-4 h-full overflow-y-auto scrollbar-none">
        <div className={activeTab === "summary" ? "block" : "hidden"}>
          <ArticleSummary isLoading={isLoading} summary={summary} />
        </div>
        <div className={activeTab === "deepReading" ? "block" : "hidden"}>
          <ArticleDeepReading isLoading={isLoading} deepReading={deepReading} />
        </div>
        <div className={activeTab === "mindMap" ? "block" : "hidden"}>
          <ArticleMindMap isLoading={isLoading} mindMap={mindMap} />
        </div>
      </div>
    </div>
  );
}
