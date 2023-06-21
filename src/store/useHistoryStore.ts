import { create } from 'zustand'
import { HistoryStatus, HistoryAction } from '../type'

const useHistoryStore = create<HistoryStatus & HistoryAction>((set) => ({
  historyList: [],
  updateHistoryList: (historyList) => set(() => ({ historyList: historyList })),
  insertHistoryItem: (historyItem) => set((state) => ({ historyList: [historyItem, ...state.historyList.filter((item) => item.filePath !== historyItem.filePath)] })),
  removeHistoryItem: (path) => set((state) => ({ historyList: state.historyList.filter((item) => item.filePath !== path) })),
  clearHistoryList: () => set({ historyList: [] }),
}))

export default useHistoryStore