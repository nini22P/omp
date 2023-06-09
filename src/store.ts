import { create } from 'zustand'
import { PLayerStatus, PLayerAction, PlayListStatus, PlayListAction, MetaDataListStatus, MetaDataListAction } from './type'

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

const useMetaDataListStore = create<MetaDataListStatus & MetaDataListAction>((set) => ({
  metaDataList: [],
  updateMetaDataList: (metaDataList) => set(() => ({ metaDataList: metaDataList })),
  insertMetaDataList: (metaData) => set((state) => ({ metaDataList: [...state.metaDataList, metaData] }))
}))

const usePlayerStore = create<PLayerStatus & PLayerAction>((set) => ({
  url: '',
  playing: false,
  loop: false,
  light: true,
  muted: false,
  currentTime: 0,
  duration: 0,
  containerIsHiding: true,
  updateUrl: (url) => set(() => ({ url: url })),
  updatePlaying: (playing) => set(() => ({ playing: playing })),
  updateLoop: (loop) => set(() => ({ loop: loop })),
  updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
  updateDuration: (duration) => set(() => ({ duration: duration })),
  updateContainerIsHiding: (containerIsHiding) => set(() => ({ containerIsHiding: containerIsHiding }))
}))

export { usePlayListStore, useMetaDataListStore, usePlayerStore }