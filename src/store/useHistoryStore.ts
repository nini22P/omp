import { pathConvert } from '../utils'
import { HistoryStatus, HistoryAction } from '../types/history'
import { create } from 'zustand'

const useHistoryStore = create<HistoryStatus & HistoryAction>(
  (set) => ({
    historyList: null,
    updateHistoryList: (historyList) => set(() => ({ historyList: historyList })),
    insertHistory: (file) => set(
      (state) => (
        (state.historyList !== null)
          ? {
            historyList:
              [
                file,
                ...state.historyList.filter((item) =>
                  pathConvert(item.filePath) !== pathConvert(file.filePath))
              ].slice(0, 200)
          }
          : { historyList: [file] }
      )),
    removeHistory: (indexArray) => set((state) => ({ historyList: state.historyList?.filter((_, index) => !indexArray.includes(index)) })),
    clearHistoryList: () => set({ historyList: [] }),
  })
)

export default useHistoryStore