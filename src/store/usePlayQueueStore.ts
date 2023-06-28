import { create } from 'zustand'
import { PlayQueueAction, PlayQueueStatus } from '../type'

const usePlayQueueStore = create<PlayQueueStatus & PlayQueueAction>((set) => ({
  type: 'audio',
  playQueue: null,
  currentIndex: 0,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayQueue: (playQueue) => set(() => ({ playQueue: playQueue })),
  updateCurrentIndex: (currentIndex) => set(() => ({ currentIndex: currentIndex })),
}))

export default usePlayQueueStore