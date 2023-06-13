import { create } from 'zustand'
import { PlayListAction, PlayListStatus } from '../type'

const usePlayListStore = create<PlayListStatus & PlayListAction>((set) => ({
  type: 'audio',
  playList: null,
  current: 0,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayList: (playList) => set(() => ({ playList: playList })),
  updateCurrent: (current) => set(() => ({ current: current })),
}))

export default usePlayListStore