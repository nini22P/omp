import { IPicture } from 'music-metadata-browser'

export interface Cover extends IPicture {
  width: number;
  height: number;
}

interface LocalStorageCover extends Omit<Cover, 'data'> {
  data: { type: 'Buffer', data: string[] },
}

export interface MetaData {
  path: string[];
  size?: number;
  title: string;
  artist?: string;
  albumArtist?: string;
  album?: string;
  year?: number;
  genre?: string[];
  cover?: Cover[] | LocalStorageCover[];
}

export interface MetaDataListStatus {
  metaDataList: MetaData[];
}

export interface MetaDataListAction {
  updateMetaDataList: (metaDataList: MetaDataListStatus['metaDataList']) => void
  insertMetaDataList: (metaData: MetaData) => void
  clearMetaDataList: () => void
}