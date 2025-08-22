export interface Cover {
  data: Uint8Array;
  format: string;
  width?: number;
  height?: number;
  description?: string;
}

export interface MetaData {
  id: string
  title: string
  artist?: string
  albumArtist?: string
  album?: string
  year?: number
  genre?: string[]
  cover?: Cover[]
  lyrics?: string
}