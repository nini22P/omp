import { create } from 'zustand'
import { UiActions, UiState } from '../types/ui'
import { createJSONStorage, persist } from 'zustand/middleware'
import createSelectors from './createSelectors'

const initialState: UiState = {
  currentAccount: 0,
  folderTree: ['/'],
  audioViewIsShow: false,
  audioViewTheme: 'modern',
  videoViewIsShow: false,
  controlIsShow: true,
  playQueueIsShow: false,
  fullscreen: false,
  mobileSideBarOpen: false,
  backgroundIsShow: true,
  shuffle: false,
  repeat: 'off',
  volume: 100,
  playbackRate: 1,
  CoverThemeColor: true,
  colorMode: 'auto',
  display: 'multicolumnList',
  sortBy: 'name',
  orderBy: 'asc',
  foldersFirst: true,
  mediaOnly: true,
  hdThumbnails: false,
  lyricsIsShow: false,
}

const useUiStoreBase = create<UiState & UiActions>()(
  persist(
    (set) => ({
      ...initialState,
      updateCurrentAccount: (currentAccount) => set(() => ({ currentAccount: currentAccount })),
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
      updateVolume: (volume) => set(() => ({ volume: volume })),
      updatePlaybackRate: (playbackRate) => set(() => ({ playbackRate })),
      updateCoverThemeColor: (CoverThemeColor) => set(() => ({ CoverThemeColor: CoverThemeColor })),
      updateColorMode: (colorMode) => set(() => ({ colorMode: colorMode })),
      updateDisplay: (display) => set(() => ({ display: display })),
      updateSortBy: (sortBy) => set(() => ({ sortBy: sortBy })),
      updateOrderBy: (orderBy) => set(() => ({ orderBy: orderBy })),
      updateFoldersFirst: (foldersFirst) => set(() => ({ foldersFirst: foldersFirst })),
      updateMediaOnly: (mediaOnly) => set(() => ({ mediaOnly: mediaOnly })),
      updateHDThumbnails: (hdThumbnails) => set(() => ({ hdThumbnails: hdThumbnails })),
      updateLyricsIsShow: (lyricsIsShow) => set(() => ({ lyricsIsShow: lyricsIsShow })),
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
    }
  ))

const useUiStore = createSelectors(useUiStoreBase)

export default useUiStore