import { pathConvert } from '../utils'
import { PlayQueueStatus, PlayQueueAction } from '../types/playQueue'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { createJSONStorage, persist } from 'zustand/middleware'

const usePlayQueueStore = createWithEqualityFn<PlayQueueStatus & PlayQueueAction>()(
  persist((set) => ({
    type: 'audio',
    playQueue: null,
    currentIndex: 0,
    updateType: (type) => set(() => ({ type: type })),
    updatePlayQueue: (playQueue) => set(() => ({ playQueue: playQueue })),
    updateCurrentIndex: (currentIndex) => set(() => ({ currentIndex: currentIndex })),
    removeFilesFromPlayQueue: (filePathArray) => set(
      (state) => {
        const currentFile = state.playQueue?.find((item) => item.index === state.currentIndex)
        let newCurrentIndex = 0
        return {
          playQueue:
            state.playQueue
              ?.filter((item) => filePathArray.find(filePath => pathConvert(filePath) !== pathConvert(item.filePath)))
              .map((item, index) => {
                if (currentFile && pathConvert(item.filePath) === pathConvert(currentFile?.filePath))
                  newCurrentIndex = index
                return { ...item, index }
              }),
          currentIndex: newCurrentIndex,
        }
      }
    )
  }),
    {
      name: 'playqueue-store',
      storage: createJSONStorage(() => localStorage),
    }
  ), shallow)

export default usePlayQueueStore