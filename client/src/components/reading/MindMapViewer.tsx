import { useEffect, useRef, useState } from "react";
import { Transformer } from "markmap-lib";
import * as markmap from "markmap-view";
import { Loader2 } from "lucide-react";
const { Markmap, loadCSS, loadJS } = markmap;

interface MindMapViewerProps {
  markdown: string;
  isLoading?: boolean;
}

// 创建transformer实例
const transformer = new Transformer();

export function MindMapViewer({ markdown, isLoading }: MindMapViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<markmap.Markmap | null>(null);
  const [key, setKey] = useState(0); // 添加用于强制重新渲染的 key
  const option = useRef<Partial<markmap.IMarkmapOptions>>({
    zoom: true,
    duration: 500,
  });

  useEffect(() => {
    if (!svgRef.current || isLoading || !markdown.trim()) return;

    // 添加一个小延迟，确保 DOM 完全可见后再渲染
    const timer = setTimeout(() => {
      try {
        // 清理之前的实例
        if (mmRef.current) {
          mmRef.current.destroy();
        }

        const { root, features } = transformer.transform(markdown);
        const { styles, scripts } = transformer.getUsedAssets(features);

        if (styles) loadCSS(styles);
        if (scripts) loadJS(scripts, { getMarkmap: () => markmap });

        // 保存新实例
        if (!svgRef.current) return;
        mmRef.current = Markmap.create(
          svgRef.current as SVGElement,
          option.current,
          root
        );
      } catch (error) {
        console.error("Mindmap rendering error:", error);
        // 如果渲染失败，尝试重新渲染一次
        setKey((k) => k + 1);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (mmRef.current) {
        mmRef.current.destroy();
      }
    };
  }, [markdown, isLoading, key]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">正在生成思维导图...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <svg
        key={key}
        ref={svgRef}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ minHeight: "500px" }}
      />
    </div>
  );
}
