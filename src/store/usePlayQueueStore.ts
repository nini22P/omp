import { PlayQueueActions, PlayQueueState } from '../types/playQueue'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const initialState: PlayQueueState = {
  playQueue: null,
  currentIndex: 0,
}

const usePlayQueueStoreBase = create<PlayQueueState & PlayQueueActions>()(
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