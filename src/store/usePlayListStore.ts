import { create } from 'zustand'
import { PlayListAction, PlayListStatus } from '../type'

const usePlayListStore = create<PlayListStatus & PlayListAction>((set) => ({
  type: 'audio',
  playList: null,
  index: 0,
  playListIsShow: false,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayList: (playList) => set(() => ({ playList: playList })),
  updateIndex: (index) => set(() => ({ index: index })),
}))

export default usePlayListStore