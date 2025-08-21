import { FileItem } from './file'

export interface HistoryState {
  historyList: FileItem[] | null
}

export interface HistoryActions {
  updateHistoryList: (historyList: HistoryState['historyList']) => void
  insertHistory: (file: FileItem) => void
  removeHistory: (indexArray: number[]) => void
  clearHistoryList: () => void
}