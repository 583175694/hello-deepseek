declare module "react-file-viewer" {
  interface FileViewerProps {
    fileType: string;
    filePath: string;
    onError?: (error: Error) => void;
    errorComponent?: React.ComponentType<any>;
    unsupportedComponent?: React.ComponentType<any>;
  }

  const FileViewer: React.FC<FileViewerProps>;
  export default FileViewer;
}
