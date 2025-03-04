import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../chat/CodeBlock";
import remarkGfm from "remark-gfm";

// 定义文章摘要组件的Props接口
interface ArticleSummaryProps {
  isLoading: boolean;
  summary: string | null;
}

// 文章摘要组件
export function ArticleSummary({ isLoading, summary }: ArticleSummaryProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold mb-4">文章摘要</h2>

      {isLoading && !summary && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">正在生成摘要...</span>
        </div>
      )}

      {summary && (
        <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <CodeBlock language={match[1]}>{String(children)}</CodeBlock>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
