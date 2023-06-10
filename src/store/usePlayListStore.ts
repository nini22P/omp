import { create } from 'zustand'
import { PlayListAction, PlayListStatus } from '../type'

const usePlayListStore = create<PlayListStatus & PlayListAction>((set) => ({
  type: 'audio',
  playList: null,
  index: 0,
  total: 0,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayList: (playList) => set(() => ({ playList: playList })),
  updateIndex: (index) => set(() => ({ index: index })),
  updateTotal: (total) => set(() => ({ total: total })),
}))

export default usePlayListStore