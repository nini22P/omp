import { PlayerStatus, PlayerAction } from '../types/player'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'

const usePlayerStore = createWithEqualityFn<PlayerStatus & PlayerAction>((set) => ({
  isPlaying: false,
  cover: './cover.png',
  currentTime: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',
  updateIsPlaying: (isPlaying) => set(() => ({ isPlaying: isPlaying })),
  updateCover: (cover) => set(() => (({ cover: cover }))),
  updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
  updateDuration: (duration) => set(() => ({ duration: duration })),
  updateShuffle: (shuffle) => set(() => ({ shuffle: shuffle })),
  updateRepeat: (repeat) => set(() => ({ repeat: repeat })),
}), shallow)

export default usePlayerStore