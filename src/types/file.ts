export interface File {
  fileName: string;
  filePath: string[];
  fileSize: number;
  fileType: 'folder' | 'audio' | 'video' | 'picture' | 'other';
}