export interface UiStatus {
  folderTree: string[];
  audioViewIsShow: boolean;
  videoViewIsShow: boolean;
  controlIsShow: boolean;
  playQueueIsShow: boolean;
  fullscreen: boolean;
  mobileSideBarOpen: boolean;
  backgroundIsShow: boolean;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
  color: string;
}

export interface UiAction {
  updateFolderTree: (folderTree: UiStatus['folderTree']) => void;
  updateAudioViewIsShow: (audioViewIsShow: UiStatus['audioViewIsShow']) => void;
  updateVideoViewIsShow: (videoViewIsShow: UiStatus['videoViewIsShow']) => void;
  updateControlIsShow: (controlIsShow: UiStatus['controlIsShow']) => void;
  updatePlayQueueIsShow: (PlayQueueIsShow: UiStatus['playQueueIsShow']) => void;
  updateFullscreen: (fullscreen: UiStatus['fullscreen']) => void;
  updateMobileSideBarOpen: (mobileSideBarOpen: UiStatus['mobileSideBarOpen']) => void;
  updateBackgroundIsShow: (backgroundIsShow: UiStatus['backgroundIsShow']) => void;
  updateShuffle: (shuffle: UiStatus['shuffle']) => void;
  updateRepeat: (loop: UiStatus['repeat']) => void;
  updateColor: (color: UiStatus['color']) => void;
}