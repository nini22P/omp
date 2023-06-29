import { create } from 'zustand'
import { HistoryStatus, HistoryAction } from '../type'
import { filePathConvert } from '../util'

const useHistoryStore = create<HistoryStatus & HistoryAction>((set) => ({

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
            ].slice(0, 50)
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

}))

export default useHistoryStore