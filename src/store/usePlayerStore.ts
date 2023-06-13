import { create } from 'zustand'
import { PLayerStatus, PLayerAction } from '../type'

const usePlayerStore = create<PLayerStatus & PLayerAction>((set) => ({
  loop: false,
  currentTime: 0,
  duration: 0,
  updateLoop: (loop) => set(() => ({ loop: loop })),
  updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
  updateDuration: (duration) => set(() => ({ duration: duration })),
}))

export default usePlayerStore