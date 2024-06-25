import { File } from './file'

export interface HistoryStatus {
  historyList: File[] | null,
}

export interface HistoryAction {
  updateHistoryList: (historyList: HistoryStatus['historyList']) => void,
  insertHistory: (file: File) => void,
  removeHistory: (indexArray: number[]) => void,
  clearHistoryList: () => void,
}