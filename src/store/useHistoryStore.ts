import { HistoryActions, HistoryState } from '../types/history'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const useHistoryStoreBase = create<HistoryState & HistoryActions>(
  (set) => ({
    historys: null,
    updateHistoryList: (historys) => set(() => ({ historys })),
    insertHistory: (file) => set(
      (state) => (
        (state.historys !== null)
          ? {
            historys:
              [
                file,
                ...state.historys.filter((item) => item.path.join('/') !== file.path.join('/'))
              ].slice(0, 200)
          }
          : { historys: [file] }
      )),
    removeHistory: (indexArray) => set((state) => ({ historys: state.historys?.filter((_, index) => !indexArray.includes(index)) })),
    clearHistoryList: () => set({ historys: [] }),
  })
)

const useHistoryStore = createSelectors(useHistoryStoreBase)

export default useHistoryStore