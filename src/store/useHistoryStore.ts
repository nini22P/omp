import { HistoryActions, HistoryState } from '../types/history'
import { Track } from '../types/file'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const hasSameNonEmptyPath = (a: Track, b: Track) => (
  Array.isArray(a.path)
  && a.path.length > 0
  && Array.isArray(b.path)
  && b.path.length > 0
  && a.path.join('/') === b.path.join('/')
)

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
                ...state.historys.filter((item) => !hasSameNonEmptyPath(item, file)),
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