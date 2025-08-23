import { Track } from './file'

export interface HistoryState {
  historys: Track[] | null
}

export interface HistoryActions {
  updateHistoryList: (historys: HistoryState['historys']) => void
  insertHistory: (file: Track) => void
  removeHistory: (indexArray: number[]) => void
  clearHistoryList: () => void
}