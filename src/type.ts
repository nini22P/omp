import { IPicture } from 'music-metadata-browser'

export interface FileItem {
  name: string;
  size: number;
  fileType: string;
}

export interface playListItem {
  index: number;
  title: string;
  size: number;
  path: string;
}

export interface PlayListStatus {
  type: 'audio' | 'video' | string;
  playList: playListItem[] | null;
  current: number;
}

export interface PlayListAction {
  updateType: (type: PlayListStatus['type']) => void,
  updatePlayList: (playList: PlayListStatus['playList']) => void;
  updateCurrent: (index: PlayListStatus['current']) => void;
}

export interface MetaData {
  path: string;
  size?: number;
  title: string;
  artist?: string | undefined;
  albumArtist?: string | undefined;
  album?: string | undefined;
  year?: number | undefined;
  genre?: string[] | undefined;
  cover?: IPicture[] | undefined;
}

export interface MetaDataListStatus {
  metaDataList: MetaData[] | [];
}

export interface MetaDataListAction {
  updateMetaDataList: (metaDataList: MetaDataListStatus['metaDataList']) => void
  insertMetaDataList: (metaData: MetaData) => void
}

export interface PLayerStatus {
  isPlaying: boolean;
  cover: string;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

export interface PLayerAction {
  updateIsPlaying: (isPlaying: PLayerStatus['isPlaying']) => void;
  updateCover: (cover: PLayerStatus['cover']) => void;
  updateCurrentTime: (currentTime: PLayerStatus['currentTime']) => void;
  updateDuration: (duration: PLayerStatus['duration']) => void;
  updateShuffle: (shuffle: PLayerStatus['shuffle']) => void;
  updateRepeat: (loop: PLayerStatus['repeat']) => void;
}

export interface UiStatus {
  audioViewIsShow: boolean;
  videoViewIsShow: boolean;
  controlIsShow: boolean;
  playListIsShow: boolean;
  fullscreen: boolean;
  mobileSideBarOpen: boolean;
}

export interface UiAction {
  updateAudioViewIsShow: (audioViewIsShow: UiStatus['audioViewIsShow']) => void;
  updateVideoViewIsShow: (videoViewIsShow: UiStatus['videoViewIsShow']) => void;
  updateControlIsShow: (controlIsShow: UiStatus['controlIsShow']) => void;
  updatePlayListIsShow: (playListIsShow: UiStatus['playListIsShow']) => void;
  updateFullscreen: (fullscreen: UiStatus['fullscreen']) => void;
  updateMobileSideBarOpen: (mobileSideBarOpen: UiStatus['mobileSideBarOpen']) => void,
}

export interface HistoryItem {
  filePath: string;
  fileType: PlayListStatus['type'];
  fileName: string;
  fileSize: number;
  lastTime: string;
}

export interface HistoryStatus {
  historyList: HistoryItem[];
}

export interface HistoryAction {
  updateHistoryList: (historyList: HistoryStatus['historyList']) => void;
  insertHistoryItem: (historyItem: HistoryItem) => void;
  removeHistoryItem: (path: HistoryItem['filePath']) => void;
  clearHistoryList: () => void;
}