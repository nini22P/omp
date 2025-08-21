import { pathConv } from '../utils'
import { HistoryActions, HistoryState } from '../types/history'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const useHistoryStoreBase = create<HistoryState & HistoryActions>(
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
                  pathConv(item.filePath) !== pathConv(file.filePath))
              ].slice(0, 200)
          }
          : { historyList: [file] }
      )),
    removeHistory: (indexArray) => set((state) => ({ historyList: state.historyList?.filter((_, index) => !indexArray.includes(index)) })),
    clearHistoryList: () => set({ historyList: [] }),
  })
)

const useHistoryStore = createSelectors(useHistoryStoreBase)

export default useHistoryStore