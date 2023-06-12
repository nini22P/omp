import { IPicture } from 'music-metadata-browser'

interface FileItem {
  name: string;
  size: number;
  fileType: string;
}

interface playListItem {
  title: string;
  size: number;
  path: string;
}

interface PlayListStatus {
  type: 'audio' | 'video' | string;
  playList: playListItem[] | null;
  index: number;
}

interface PlayListAction {
  updateType: (type: PlayListStatus['type']) => void,
  updatePlayList: (playList: PlayListStatus['playList']) => void;
  updateIndex: (index: PlayListStatus['index']) => void;
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
  url: string;
  playing: boolean;
  loop: boolean;
  light: boolean | string;
  muted: boolean;
  currentTime: number;
  duration: number;
}

interface PLayerAction {
  updateUrl: (url: PLayerStatus['url']) => void;
  updatePlaying: (playing: PLayerStatus['playing']) => void;
  updateLoop: (loop: PLayerStatus['loop']) => void;
  updateCurrentTime: (currentTime: PLayerStatus['currentTime']) => void;
  updateDuration: (duration: PLayerStatus['duration']) => void;
}

interface UiStatus {
  audioViewIsShow: boolean;
  videoViewIsShow: boolean;
  playListIsShow: boolean;
}

interface UiAction {
  updateAudioViewIsShow: (audioViewIsShow: UiStatus['audioViewIsShow']) => void;
  updateVideoViewIsShow: (videoViewIsShow: UiStatus['videoViewIsShow']) => void;
  updatePlayListIsShow: (playListIsShow: UiStatus['playListIsShow']) => void;
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