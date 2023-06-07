import { create } from 'zustand'
import { PLayerStatus, Action } from './type'

const usePlayerStore = create<PLayerStatus & Action>((set) => ({
  type: 'audio',
  playList: null,
  index: 0,
  total: 0,
  url: '',
  playing: false,
  loop: false,
  light: true,
  muted: false,
  currentTime: 0,
  duration: 0,
  containerIsHiding: true,
  updateType: (type) => set(() => ({ type: type })),
  updatePlayList: (playList) => set(() => ({ playList: playList })),
  updateIndex: (index) => set(() => ({ index: index })),
  updateTotal: (total) => set(() => ({ total: total })),
  updateUrl: (url) => set(() => ({ url: url })),
  updatePlaying: (playing) => set(() => ({ playing: playing })),
  updateLoop: (loop) => set(() => ({ loop: loop })),
  updateCurrentTime: (currentTime) => set(() => ({ currentTime: currentTime })),
  updateDuration: (duration) => set(() => ({ duration: duration })),
  updateContainerIsHiding: (containerIsHiding) => set(() => ({ containerIsHiding: containerIsHiding }))
}))

export default usePlayerStore