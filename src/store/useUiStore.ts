import { createWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import { UiStatus, UiAction } from '../types/ui'
import { createJSONStorage, persist } from 'zustand/middleware'

const useUiStore = createWithEqualityFn<UiStatus & UiAction>()(
  persist(
    (set) => ({
      folderTree: ['/'],
      audioViewIsShow: false,
      audioViewTheme: 'classic',
      videoViewIsShow: false,
      controlIsShow: true,
      playQueueIsShow: false,
      fullscreen: false,
      mobileSideBarOpen: false,
      backgroundIsShow: true,
      shuffle: false,
      repeat: 'off',
      color: '#ffffff',
      display: 'list',
      sortBy: 'name',
      orderBy: 'asc',
      foldersFirst: true,
      mediaOnly: true,
      hdThumbnails: false,
      updateFolderTree: (folderTree) => set(() => ({ folderTree: folderTree })),
      updateAudioViewIsShow: (audioViewIsShow) => set(() => ({ audioViewIsShow: audioViewIsShow })),
      updateAudioViewTheme: (audioViewTheme) => set(() => ({ audioViewTheme: audioViewTheme })),
      updateVideoViewIsShow: (videoViewIsShow) => set(() => ({ videoViewIsShow: videoViewIsShow })),
      updateControlIsShow: (controlIsShow) => set(() => ({ controlIsShow: controlIsShow })),
      updatePlayQueueIsShow: (playQueueIsShow) => set(() => ({ playQueueIsShow: playQueueIsShow })),
      updateFullscreen: (fullscreen) => set(() => ({ fullscreen: fullscreen })),
      updateMobileSideBarOpen: (mobileSideBarOpen) => set(() => ({ mobileSideBarOpen: mobileSideBarOpen })),
      updateBackgroundIsShow: (backgroundIsShow) => set(() => ({ backgroundIsShow: backgroundIsShow })),
      updateShuffle: (shuffle) => set(() => ({ shuffle: shuffle })),
      updateRepeat: (repeat) => set(() => ({ repeat: repeat })),
      updateColor: (color) => set(() => ({ color: color })),
      updateDisplay: (display) => set(() => ({ display: display })),
      updateSortBy: (sortBy) => set(() => ({ sortBy: sortBy })),
      updateOrderBy: (orderBy) => set(() => ({ orderBy: orderBy })),
      updateFoldersFirst: (foldersFirst) => set(() => ({ foldersFirst: foldersFirst })),
      updateMediaOnly: (mediaOnly) => set(() => ({ mediaOnly: mediaOnly })),
      updateHDThumbnails: (hdThumbnails) => set(() => ({ hdThumbnails: hdThumbnails })),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
    }
  ), shallow)

export default useUiStore