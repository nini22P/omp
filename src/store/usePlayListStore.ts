import { create } from 'zustand'
import { PlayListAction, PlayListStatus } from '../type'

const usePlayListStore = create<PlayListStatus & PlayListAction>((set) => ({
  type: 'audio',
  playList: null,
  index: 0,
  total: 0,
  playListIsShow: false,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayList: (playList) => set(() => ({ playList: playList })),
  updateIndex: (index) => set(() => ({ index: index })),
  updateTotal: (total) => set(() => ({ total: total })),
  updatePlayListIsShow: (playListIsShow) => set(() => ({ playListIsShow: playListIsShow }))
}))

export default usePlayListStore