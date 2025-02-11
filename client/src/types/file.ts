export interface FileInfo {
  filename: string;
  size: number;
  uploadedAt: string;
  type: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  file?: FileInfo;
}
