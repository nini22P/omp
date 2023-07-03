export interface UiStatus {
  folderTree: string[];
  audioViewIsShow: boolean;
  videoViewIsShow: boolean;
  controlIsShow: boolean;
  playQueueIsShow: boolean;
  fullscreen: boolean;
  mobileSideBarOpen: boolean;
}

export interface UiAction {
  updateFolderTree: (folderTree: UiStatus['folderTree']) => void;
  updateAudioViewIsShow: (audioViewIsShow: UiStatus['audioViewIsShow']) => void;
  updateVideoViewIsShow: (videoViewIsShow: UiStatus['videoViewIsShow']) => void;
  updateControlIsShow: (controlIsShow: UiStatus['controlIsShow']) => void;
  updatePlayQueueIsShow: (PlayQueueIsShow: UiStatus['playQueueIsShow']) => void;
  updateFullscreen: (fullscreen: UiStatus['fullscreen']) => void;
  updateMobileSideBarOpen: (mobileSideBarOpen: UiStatus['mobileSideBarOpen']) => void,
}