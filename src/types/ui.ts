export interface UiState {
  currentAccount: number
  folderTree: string[]
  audioViewIsShow: boolean
  audioViewTheme: 'classic' | 'modern'
  videoViewIsShow: boolean
  controlIsShow: boolean
  playQueueIsShow: boolean
  fullscreen: boolean
  mobileSideBarOpen: boolean
  backgroundIsShow: boolean
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'
  volume: number
  playbackRate: number
  CoverThemeColor: boolean
  colorMode: 'auto' | 'light' | 'dark'
  display: 'list' | 'multicolumnList' | 'grid'
  sortBy: 'name' | 'size' | 'datetime'
  orderBy: 'asc' | 'desc'
  foldersFirst: boolean
  mediaOnly: boolean
  hdThumbnails: boolean
  lyricsIsShow: boolean
}

export interface UiActions {
  updateCurrentAccount: (currentAccount: UiState['currentAccount']) => void
  updateFolderTree: (folderTree: UiState['folderTree']) => void
  updateAudioViewIsShow: (audioViewIsShow: UiState['audioViewIsShow']) => void
  updateAudioViewTheme: (audioViewTheme: UiState['audioViewTheme']) => void
  updateVideoViewIsShow: (videoViewIsShow: UiState['videoViewIsShow']) => void
  updateControlIsShow: (controlIsShow: UiState['controlIsShow']) => void
  updatePlayQueueIsShow: (PlayQueueIsShow: UiState['playQueueIsShow']) => void
  updateFullscreen: (fullscreen: UiState['fullscreen']) => void
  updateMobileSideBarOpen: (mobileSideBarOpen: UiState['mobileSideBarOpen']) => void
  updateBackgroundIsShow: (backgroundIsShow: UiState['backgroundIsShow']) => void
  updateShuffle: (shuffle: UiState['shuffle']) => void
  updateRepeat: (loop: UiState['repeat']) => void
  updateVolume: (volume: UiState['volume']) => void
  updatePlaybackRate: (playbackRate: UiState['playbackRate']) => void
  updateCoverThemeColor: (CoverThemeColor: UiState['CoverThemeColor']) => void
  updateColorMode: (colorMode: UiState['colorMode']) => void
  updateDisplay: (display: UiState['display']) => void
  updateSortBy: (sortBy: UiState['sortBy']) => void
  updateOrderBy: (orderBy: UiState['orderBy']) => void
  updateFoldersFirst: (foldersFirst: UiState['foldersFirst']) => void
  updateMediaOnly: (mediaOnly: UiState['mediaOnly']) => void
  updateHDThumbnails: (hdThumbnails: UiState['hdThumbnails']) => void
  updateLyricsIsShow: (lyricsIsShow: UiState['lyricsIsShow']) => void
}