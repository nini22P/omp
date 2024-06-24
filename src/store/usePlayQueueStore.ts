import { PlayQueueStatus, PlayQueueAction } from '../types/playQueue'
import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { createJSONStorage, persist } from 'zustand/middleware'

const initialState: PlayQueueStatus = {
  type: 'audio',
  playQueue: null,
  currentIndex: 0,
}

const usePlayQueueStore = createWithEqualityFn<PlayQueueStatus & PlayQueueAction>()(
  persist((set) => ({
    ...initialState,
    updateType: (type) => set(() => ({ type: type })),
    updatePlayQueue: (playQueue) => set(() => ({ playQueue: playQueue })),
    updateCurrentIndex: (currentIndex) => set(() => ({ currentIndex: currentIndex })),
    resetPlayQueue: () => set(() => ({ ...initialState })),
  }),
    {
      name: 'playqueue-store',
      storage: createJSONStorage(() => localStorage),
    }
  ),
  shallow
)

export default usePlayQueueStore