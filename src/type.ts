import { IPicture } from 'music-metadata-browser'

export interface PlayQueueItem {
  index: number;
  title: string;
  size: number;
  path: string;
}

export interface PlayQueueStatus {
  type: 'audio' | 'video' | string;
  playQueue: PlayQueueItem[] | null;
  current: number;
}

export interface PlayQueueAction {
  updateType: (type: PlayQueueStatus['type']) => void,
  updatePlayQueue: (PlayQueue: PlayQueueStatus['playQueue']) => void;
  updateCurrent: (index: PlayQueueStatus['current']) => void;
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
  metaDataList: MetaData[];
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
  playQueueIsShow: boolean;
  fullscreen: boolean;
  mobileSideBarOpen: boolean;
}

export interface UiAction {
  updateAudioViewIsShow: (audioViewIsShow: UiStatus['audioViewIsShow']) => void;
  updateVideoViewIsShow: (videoViewIsShow: UiStatus['videoViewIsShow']) => void;
  updateControlIsShow: (controlIsShow: UiStatus['controlIsShow']) => void;
  updatePlayQueueIsShow: (PlayQueueIsShow: UiStatus['playQueueIsShow']) => void;
  updateFullscreen: (fullscreen: UiStatus['fullscreen']) => void;
  updateMobileSideBarOpen: (mobileSideBarOpen: UiStatus['mobileSideBarOpen']) => void,
}

export interface HistoryItem {
  fileName: string;
  filePath: string;
  fileSize: number;
  lastTime: string;
}

export interface HistoryStatus {
  historyList: HistoryItem[] | null;
}

export interface HistoryAction {
  updateHistoryList: (historyList: HistoryStatus['historyList']) => void;
  insertHistoryItem: (historyItem: HistoryItem) => void;
  removeHistoryItem: (path: HistoryItem['filePath']) => void;
  clearHistoryList: () => void;
}

export interface PlayListItem {
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: 'audio' | 'video' | string;
}

export interface PlayListsItem {
  id: string;
  title: string;
  playList: PlayListItem[];
}

export interface PlayListsStatus {
  playLists: PlayListsItem[] | null;
}

export interface PlayListsAction {
  updatePlayLists: (playLists: PlayListsStatus['playLists']) => void;
  insertPlayListsItem: (playListsItem: PlayListsItem) => void;
  updatePlayListsItem: (playListsItem: PlayListsItem) => void;
  removePlayListsItem: (id: PlayListsItem['id']) => void;
}