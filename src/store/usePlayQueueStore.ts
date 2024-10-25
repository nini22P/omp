import { PlayQueueStatus, PlayQueueAction } from '../types/playQueue'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'

const initialState: PlayQueueStatus = {
  playQueue: null,
  currentIndex: 0,
}

const usePlayQueueStore = create<PlayQueueStatus & PlayQueueAction>()(
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

export default usePlayQueueStore