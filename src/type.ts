import { IPicture } from "music-metadata-browser";

type FileItem = {
  name: string;
  size: number;
  fileType: string;
}

type playListItem = {
  title: string;
  size: number;
  path: string;
}

type PlayListStatus = {
  type: 'audio' | 'video' | null;
  playList: playListItem[] | null;
  index: number;
  total: number;
}

type PlayListAction = {
  updateType: (type: PlayListStatus['type']) => void,
  updatePlayList: (playList: PlayListStatus['playList']) => void;
  updateIndex: (index: PlayListStatus['index']) => void;
  updateTotal: (total: PlayListStatus['total']) => void;
}

type MetaData = {
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

type MetaDataListStatus = {
  metaDataList: MetaData[] | [];
}

type MetaDataListAction = {
  updateMetaDataList: (metaDataList: MetaDataListStatus['metaDataList']) => void
  insertMetaDataList: (metaData: MetaData) => void
}

type PLayerStatus = {
  url: string;
  playing: boolean;
  loop: boolean;
  light: boolean | string;
  muted: boolean;
  currentTime: number;
  duration: number;
  containerIsHiding: boolean;
}

type PLayerAction = {
  updateUrl: (url: PLayerStatus['url']) => void;
  updatePlaying: (playing: PLayerStatus['playing']) => void;
  updateLoop: (loop: PLayerStatus['loop']) => void;
  updateCurrentTime: (currentTime: PLayerStatus['currentTime']) => void;
  updateDuration: (duration: PLayerStatus['duration']) => void;
  updateContainerIsHiding: (containerIsHiding: PLayerStatus['containerIsHiding']) => void;
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
  PLayerAction
}