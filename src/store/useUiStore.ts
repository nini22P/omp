import { create } from 'zustand'
import { UiStatus, UiAction } from '../types/ui'

const useUiStore = create<UiStatus & UiAction>((set) => ({
  folderTree: ['/'],
  audioViewIsShow: false,
  videoViewIsShow: false,
  controlIsShow: true,
  playQueueIsShow: false,
  fullscreen: false,
  mobileSideBarOpen: false,
  updateFolderTree: (folderTree) => set(() => ({ folderTree: folderTree })),
  updateAudioViewIsShow: (audioViewIsShow) => set(() => ({ audioViewIsShow: audioViewIsShow })),
  updateVideoViewIsShow: (videoViewIsShow) => set(() => ({ videoViewIsShow: videoViewIsShow })),
  updateControlIsShow: (controlIsShow) => set(() => ({ controlIsShow: controlIsShow })),
  updatePlayQueueIsShow: (playQueueIsShow) => set(() => ({ playQueueIsShow: playQueueIsShow })),
  updateFullscreen: (fullscreen) => set(() => ({ fullscreen: fullscreen })),
  updateMobileSideBarOpen: (mobileSideBarOpen) => set(() => ({ mobileSideBarOpen: mobileSideBarOpen })),
}))

export default useUiStore