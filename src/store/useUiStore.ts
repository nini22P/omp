import { create } from 'zustand'
import { UiAction, UiStatus } from '../type'

const useUiStore = create<UiStatus & UiAction>((set) => ({
  audioViewIsShow: false,
  videoViewIsShow: false,
  controlIsShow: true,
  playListIsShow: false,
  fullscreen: false,
  mobileSideBarOpen: false,
  updateAudioViewIsShow: (audioViewIsShow) => set(() => ({ audioViewIsShow: audioViewIsShow })),
  updateVideoViewIsShow: (videoViewIsShow) => set(() => ({ videoViewIsShow: videoViewIsShow })),
  updateControlIsShow: (controlIsShow) => set(() => ({ controlIsShow: controlIsShow })),
  updatePlayListIsShow: (playListIsShow) => set(() => ({ playListIsShow: playListIsShow })),
  updateFullscreen: (fullscreen) => set(() => ({ fullscreen: fullscreen })),
  updateMobileSideBarOpen: (mobileSideBarOpen) => set(() => ({ mobileSideBarOpen: mobileSideBarOpen })),
}))

export default useUiStore