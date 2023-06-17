import { IPicture } from 'music-metadata-browser'

interface FileItem {
  name: string;
  size: number;
  fileType: string;
}

interface playListItem {
  index: number;
  title: string;
  size: number;
  path: string;
}

interface PlayListStatus {
  type: 'audio' | 'video' | string;
  playList: playListItem[] | null;
  current: number;
}

interface PlayListAction {
  updateType: (type: PlayListStatus['type']) => void,
  updatePlayList: (playList: PlayListStatus['playList']) => void;
  updateCurrent: (index: PlayListStatus['current']) => void;
}

interface MetaData {
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

interface MetaDataListStatus {
  metaDataList: MetaData[] | [];
}

interface MetaDataListAction {
  updateMetaDataList: (metaDataList: MetaDataListStatus['metaDataList']) => void
  insertMetaDataList: (metaData: MetaData) => void
}

interface PLayerStatus {
  isPlaying: boolean;
  cover: string;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'all' | 'one';
}

interface PLayerAction {
  updateIsPlaying: (isPlaying: PLayerStatus['isPlaying']) => void;
  updateCover: (cover: PLayerStatus['cover']) => void;
  updateCurrentTime: (currentTime: PLayerStatus['currentTime']) => void;
  updateDuration: (duration: PLayerStatus['duration']) => void;
  updateShuffle: (shuffle: PLayerStatus['shuffle']) => void;
  updateRepeat: (loop: PLayerStatus['repeat']) => void;
}

interface UiStatus {
  audioViewIsShow: boolean;
  videoViewIsShow: boolean;
  controlIsShow: boolean;
  playListIsShow: boolean;
  fullscreen: boolean;
  mobileSideBarOpen: boolean;
}

interface UiAction {
  updateAudioViewIsShow: (audioViewIsShow: UiStatus['audioViewIsShow']) => void;
  updateVideoViewIsShow: (videoViewIsShow: UiStatus['videoViewIsShow']) => void;
  updateControlIsShow: (controlIsShow: UiStatus['controlIsShow']) => void;
  updatePlayListIsShow: (playListIsShow: UiStatus['playListIsShow']) => void;
  updateFullscreen: (fullscreen: UiStatus['fullscreen']) => void;
  updateMobileSideBarOpen: (mobileSideBarOpen: UiStatus['mobileSideBarOpen']) => void,
}

export type {
  FileItem,
  playListItem,
  MetaData,
  MetaDataListStatus,
  MetaDataListAction,
  PlayListStatus,
  PlayListAction,
  PLayerStatus,
  PLayerAction,
  UiStatus,
  UiAction,
}