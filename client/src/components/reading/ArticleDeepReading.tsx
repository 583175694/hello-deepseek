import ReactMarkdown from "react-markdown";
import { CodeBlock } from "../chat/CodeBlock";
import remarkGfm from "remark-gfm";

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

      {deepReading && (
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
            {deepReading}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
