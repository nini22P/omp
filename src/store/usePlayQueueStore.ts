import { PlayQueueStatus, PlayQueueAction } from '../types/playQueue'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const initialState: PlayQueueStatus = {
  playQueue: null,
  currentIndex: 0,
}

const usePlayQueueStoreBase = create<PlayQueueStatus & PlayQueueAction>()(
  persist((set) => ({
    ...initialState,
    updatePlayQueue: (playQueue) => set(() => ({ playQueue: playQueue })),
    updateCurrentIndex: (currentIndex) => set(() => ({ currentIndex: currentIndex })),
    resetPlayQueue: () => set(() => ({ ...initialState })),
  }),
    {
      name: 'playqueue-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

const usePlayQueueStore = createSelectors(usePlayQueueStoreBase)

export default usePlayQueueStore