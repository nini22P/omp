import { IPicture } from 'music-metadata-browser'

export interface File {
  fileName: string;
  filePath: string[];
  fileSize: number;
  fileType: 'folder' | 'audio' | 'video' | 'other';
}

export interface PlayQueueItem {
  index: number;
  title: string;
  size: number;
  path: string[];
}

export interface PlayQueueStatus {
  type: 'audio' | 'video';
  playQueue: PlayQueueItem[] | null;
  currentIndex: number;
}

export interface PlayQueueAction {
  updateType: (type: PlayQueueStatus['type']) => void,
  updatePlayQueue: (PlayQueue: PlayQueueStatus['playQueue']) => void;
  updateCurrentIndex: (index: PlayQueueStatus['currentIndex']) => void;
}

export interface MetaData {
  path: string[];
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

export interface HistoryStatus {
  historyList: File[] | null;
}

export interface HistoryAction {
  updateHistoryList: (historyList: HistoryStatus['historyList']) => void;
  insertHistoryItem: (file: File) => void;
  removeHistoryItem: (filePathArray: File['filePath'][]) => void;
  clearHistoryList: () => void;
}


export interface Playlist {
  id: string;
  title: string;
  fileList: File[];
}

export interface PlaylistsStatus {
  playlists: Playlist[] | null;
}

export interface PlaylistsAction {
  updatePlaylists: (playlists: PlaylistsStatus['playlists']) => void;
  insertPlaylist: (playlist: Playlist) => void;
  renamePlaylist: (id: Playlist['id'], title: Playlist['title']) => void;
  removePlaylist: (id: Playlist['id']) => void;
  insertFilesToPlaylist: (id: Playlist['id'], files: File[]) => void;
  removeFilesFromPlaylist: (id: Playlist['id'], filePathArray: File['filePath'][]) => void;
}