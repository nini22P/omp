import { create } from 'zustand'
import { filePathConvert } from '../util'
import { PlayQueueStatus, PlayQueueAction } from '../types/playQueue'

const usePlayQueueStore = create<PlayQueueStatus & PlayQueueAction>((set) => ({
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
            ?.filter((item) => filePathArray.find(filePath => filePathConvert(filePath) !== filePathConvert(item.filePath)))
            .map((item, index) => {
              if (currentFile && filePathConvert(item.filePath) === filePathConvert(currentFile?.filePath))
                newCurrentIndex = index
              return { ...item, index }
            }),
        currentIndex: newCurrentIndex,
      }
    }

  )
}))

export default usePlayQueueStore