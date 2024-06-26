import { FileItem } from './file'

export interface HistoryStatus {
  historyList: FileItem[] | null,
}

export interface HistoryAction {
  updateHistoryList: (historyList: HistoryStatus['historyList']) => void,
  insertHistory: (file: FileItem) => void,
  removeHistory: (indexArray: number[]) => void,
  clearHistoryList: () => void,
}