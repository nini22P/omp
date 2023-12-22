import { createWithEqualityFn } from 'zustand/traditional'
import { pathConvert } from '../utils'
import { HistoryStatus, HistoryAction } from '../types/history'
import { shallow } from 'zustand/shallow'

const useHistoryStore = createWithEqualityFn<HistoryStatus & HistoryAction>((set) => ({

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

  removeHistory: (filePathArray) => set(
    (state) => (
      {
        historyList:
          state.historyList?.filter((item) =>
            filePathArray.find(filePath =>
              pathConvert(filePath) !== pathConvert(item.filePath)
            )
          )
      }
    )),

  clearHistoryList: () => set({ historyList: [] }),

}), shallow)

export default useHistoryStore