import { PlayerStatus, PlayerAction } from '../types/player'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

const initialState: PlayerStatus = {
  currentMetaData: null,
  metadataUpdate: false,
  playStatu: 'paused',
  isLoading: false,
  cover: './cover.svg',
  currentTime: 0,
  duration: 0,
}

const usePlayerStore = createWithEqualityFn<PlayerStatus & PlayerAction>(
  (set) => ({
    ...initialState,
    updateCurrentMetaData: (currentMetaData) => set(() => ({ currentMetaData: currentMetaData })),
    updateMetadataUpdate: () => set((state) => ({ metadataUpdate: !state.metadataUpdate })),
    updatePlayStatu: (playStatu) => set(() => ({ playStatu: playStatu })),
    updateIsLoading: (isLading) => set(() => ({ isLoading: isLading })),
    updateCover: (cover) => set(() => (({ cover: cover }))),
    updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
    updateDuration: (duration) => set(() => ({ duration: duration })),
    resetPlayer: () => set(() => ({ ...initialState })),
  }),
  shallow
)

export default usePlayerStore