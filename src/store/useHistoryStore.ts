import { create } from 'zustand'
import { HistoryStatus, HistoryAction } from '../type'
import { filePathConvert } from '../util'

const useHistoryStore = create<HistoryStatus & HistoryAction>((set) => ({
  historyList: null,
  updateHistoryList: (historyList) => set(() => ({ historyList: historyList })),
  insertHistoryItem: (historyItem) => set((state) => (
    (state.historyList !== null)
      ? { historyList: [historyItem, ...state.historyList.filter((item) => filePathConvert(item.filePath) !== filePathConvert(historyItem.filePath))].slice(0, 50) }
      : { historyList: [historyItem] }
  )),
  removeHistoryItem: (filePathArray) => set((state) => (
    (state.historyList !== null)
      ? { historyList: state.historyList.filter((item) => filePathArray.find(filePath => filePathConvert(filePath) !== filePathConvert(item.filePath))) }
      : {}
  )),
  clearHistoryList: () => set({ historyList: [] }),
}))

export default useHistoryStore