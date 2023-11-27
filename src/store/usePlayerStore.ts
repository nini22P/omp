import { PlayerStatus, PlayerAction } from '../types/player'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

const usePlayerStore = createWithEqualityFn<PlayerStatus & PlayerAction>((set) => ({
  currentMetaData: null,
  metadataUpdate: false,
  playStatu: 'paused',
  isLoading: false,
  cover: './cover.png',
  currentTime: 0,
  duration: 0,
  updateCurrentMetaData: (currentMetaData) => set(() => ({ currentMetaData: currentMetaData })),
  updateMetadataUpdate: () => set((state) => ({ metadataUpdate: !state.metadataUpdate })),
  updatePlayStatu: (playStatu) => set(() => ({ playStatu: playStatu })),
  updateIsLoading: (isLading) => set(() => ({isLoading: isLading})),
  updateCover: (cover) => set(() => (({ cover: cover }))),
  updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
  updateDuration: (duration) => set(() => ({ duration: duration })),
}), shallow)

export default usePlayerStore