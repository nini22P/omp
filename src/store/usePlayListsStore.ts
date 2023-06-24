import { create } from 'zustand'
import { PlayListsStatus, PlayListsAction } from '../type'
const usePlayListsStore = create<PlayListsStatus & PlayListsAction>((set) => ({
  playLists: null,
  updatePlayLists: (playLists) => set(() => ({ playLists: playLists })),
  insertPlayListsItem: (playListsItem) => set((state) => ({
    playLists: (state.playLists) ? [playListsItem, ...state.playLists] : [playListsItem]
  })),
  updatePlayListsItem: (playListsItem) => set((state) => ({
    playLists: state.playLists?.map((item) =>
      (item.id === playListsItem.id)
        ? { id: item.id, title: playListsItem.title, playList: playListsItem.playList }
        : item
    )
  })),
  removePlayListsItem: (id) => set((state) => ({ playLists: state.playLists?.filter(item => item.id !== id) })),
}))

export default usePlayListsStore