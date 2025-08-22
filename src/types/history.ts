import { PlaylistItem } from './file'

export interface HistoryState {
  historys: PlaylistItem[]
}

export interface HistoryActions {
  updateHistoryList: (historys: HistoryState['historys']) => void
  insertHistory: (file: PlaylistItem) => void
  removeHistory: (indexArray: number[]) => void
  clearHistoryList: () => void
}