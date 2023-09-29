import { createWithEqualityFn } from 'zustand/traditional'
import { filePathConvert } from '../utils'
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
                filePathConvert(item.filePath) !== filePathConvert(file.filePath))
            ].slice(0, 100)
        }
        : { historyList: [file] }
    )),

  removeHistory: (filePathArray) => set(
    (state) => (
      {
        historyList:
          state.historyList?.filter((item) =>
            filePathArray.find(filePath =>
              filePathConvert(filePath) !== filePathConvert(item.filePath)
            )
          )
      }
    )),

  clearHistoryList: () => set({ historyList: [] }),

}), shallow)

export default useHistoryStore