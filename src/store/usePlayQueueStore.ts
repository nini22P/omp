import { PlayQueueActions, PlayQueueState } from '../types/playQueue'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const initialState: PlayQueueState = {
  playQueue: [],
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
      version: 1,
      migrate: (persistedState, version: number) => {
        if (
          version < 1
          &&
          persistedState
          &&
          typeof persistedState === 'object'
          &&
          'playQueue' in persistedState
          &&
          Array.isArray(persistedState.playQueue)
          &&
          persistedState.playQueue.length > 0
          &&
          persistedState.playQueue[0].track === undefined
        ) {
          const newPlayQueue = persistedState.playQueue.map((item) => ({
            track: {
              id: item.id,
              name: item.name,
              path: item.path,
              size: item.size,
            },
            index: item.index,
          }))
          return {
            ...persistedState,
            playQueue: newPlayQueue,
          }
        }
        return persistedState
      },
    }
  )
)

const usePlayQueueStore = createSelectors(usePlayQueueStoreBase)

export default usePlayQueueStore