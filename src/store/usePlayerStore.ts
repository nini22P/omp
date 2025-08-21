import { create } from 'zustand'
import { PlayerActions, PlayerState } from '../types/player'
import createSelectors from './createSelectors'

const initialState: PlayerState = {
  currentMetaData: null,
  metadataUpdate: false,
  autoPlay: false,
  isLoading: false,
  cover: './cover.svg',
  currentTime: 0,
  duration: 0,
}

const usePlayerStoreBase = create<PlayerState & PlayerActions>(
  (set) => ({
    ...initialState,
    updateCurrentMetaData: (currentMetaData) => set(() => ({ currentMetaData: currentMetaData })),
    updateMetadataUpdate: () => set((state) => ({ metadataUpdate: !state.metadataUpdate })),
    updateAutoPlay: (autoPlay) => set(() => ({ autoPlay })),
    updateIsLoading: (isLading) => set(() => ({ isLoading: isLading })),
    updateCover: (cover) => set(() => (({ cover: cover }))),
    updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
    updateDuration: (duration) => set(() => ({ duration: duration })),
    resetPlayer: () => set(() => ({ ...initialState })),
  })
)

const usePlayerStore = createSelectors(usePlayerStoreBase)

export default usePlayerStore