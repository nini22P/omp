import { create } from 'zustand'
import { PlayQueueAction, PlayQueueStatus } from '../type'

const usePlayQueueStore = create<PlayQueueStatus & PlayQueueAction>((set) => ({
  type: 'audio',
  playQueue: null,
  current: 0,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayQueue: (playQueue) => set(() => ({ playQueue: playQueue })),
  updateCurrent: (current) => set(() => ({ current: current })),
}))

export default usePlayQueueStore