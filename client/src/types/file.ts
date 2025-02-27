export interface FileInfo {
  id: string;
  filename: string;
  originalFilename: string;
  size: number;
  createdAt: string;
  type: string;
  knowledgeBaseId: string;
}

export interface KnowledgeBase {
  id: string;
  name: string;
  createdAt: string;
  documentsCount: number;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  file?: FileInfo;
}
