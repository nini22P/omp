import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { UiStatus, UiAction } from '../types/ui'
import { createJSONStorage, persist } from 'zustand/middleware'

const useUiStore = createWithEqualityFn<UiStatus & UiAction>()(
  persist(
    (set) => ({
      folderTree: ['/'],
      audioViewIsShow: false,
      videoViewIsShow: false,
      controlIsShow: true,
      playQueueIsShow: false,
      fullscreen: false,
      mobileSideBarOpen: false,
      backgroundIsShow: true,
      shuffle: false,
      repeat: 'off',
      color: '#ffffff',
      updateFolderTree: (folderTree) => set(() => ({ folderTree: folderTree })),
      updateAudioViewIsShow: (audioViewIsShow) => set(() => ({ audioViewIsShow: audioViewIsShow })),
      updateVideoViewIsShow: (videoViewIsShow) => set(() => ({ videoViewIsShow: videoViewIsShow })),
      updateControlIsShow: (controlIsShow) => set(() => ({ controlIsShow: controlIsShow })),
      updatePlayQueueIsShow: (playQueueIsShow) => set(() => ({ playQueueIsShow: playQueueIsShow })),
      updateFullscreen: (fullscreen) => set(() => ({ fullscreen: fullscreen })),
      updateMobileSideBarOpen: (mobileSideBarOpen) => set(() => ({ mobileSideBarOpen: mobileSideBarOpen })),
      updateBackgroundIsShow: (backgroundIsShow) => set(() => ({ backgroundIsShow: backgroundIsShow })),
      updateShuffle: (shuffle) => set(() => ({ shuffle: shuffle })),
      updateRepeat: (repeat) => set(() => ({ repeat: repeat })),
      updateColor: (color) => set(() => ({ color: color })),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
    }
  ), shallow)

export default useUiStore