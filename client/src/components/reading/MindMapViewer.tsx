import { useEffect, useRef } from "react";
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
  const option = useRef<Partial<markmap.IMarkmapOptions>>({});

  console.log(markdown);

  useEffect(() => {
    if (svgRef.current) {
      const { root, features } = transformer.transform(markdown);
      const { styles, scripts } = transformer.getUsedAssets(features);
      if (styles) loadCSS(styles);
      if (scripts) loadJS(scripts, { getMarkmap: () => svgRef.current });
      Markmap.create(svgRef.current, option.current, root);
    }
  }, [markdown]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <svg
        ref={svgRef}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      />
    </div>
  );
}
