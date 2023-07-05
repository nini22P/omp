import { File } from './file'

export interface HistoryStatus {
  historyList: File[] | null;
}

export interface HistoryAction {
  updateHistoryList: (historyList: HistoryStatus['historyList']) => void;
  insertHistory: (file: File) => void;
  removeHistory: (filePathArray: File['filePath'][]) => void;
  clearHistoryList: () => void;
}