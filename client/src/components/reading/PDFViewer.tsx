"use client";

import React from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import {
  thumbnailPlugin,
  ThumbnailDirection,
} from "@react-pdf-viewer/thumbnail";

// 导入样式
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface PDFViewerProps {
  fileUrl: string;
}

export const PDFViewer = React.memo(({ fileUrl }: PDFViewerProps) => {
  // 创建默认布局插件实例
  const thumbnailPluginInstance = thumbnailPlugin({
    thumbnailWidth: 100,
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <div className="flex flex-row h-full">
        <div className="w-1/6">
          <thumbnailPluginInstance.Thumbnails
            thumbnailDirection={ThumbnailDirection.Vertical}
          />
        </div>
        <div className="w-5/6">
          <Viewer
            fileUrl={fileUrl}
            plugins={[thumbnailPluginInstance]}
            defaultScale={SpecialZoomLevel.PageWidth}
          />
        </div>
      </div>
    </Worker>
  );
});

PDFViewer.displayName = "PDFViewer";
