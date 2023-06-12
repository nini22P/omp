import { create } from 'zustand'
import { UiAction, UiStatus } from '../type'

const useUiStore = create<UiStatus & UiAction>((set) => ({
  audioViewIsShow: false,
  videoViewIsShow: false,
  playListIsShow: false,
  updateAudioViewIsShow: (audioViewIsShow) => set(() => ({ audioViewIsShow: audioViewIsShow })),
  updateVideoViewIsShow: (videoViewIsShow) => set(() => ({ videoViewIsShow: videoViewIsShow })),
  updatePlayListIsShow: (playListIsShow) => set(() => ({ playListIsShow: playListIsShow })),
}))

export default useUiStore