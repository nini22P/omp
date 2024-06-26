import { FileItem } from './file'

export interface PictiureStatus {
  pictureList: FileItem[],
  currentPicture: FileItem | null,
}

export interface PictureAction {
  updatePictureList: (pictureList: PictiureStatus['pictureList']) => void,
  updateCurrentPicture: (currentPicture: PictiureStatus['currentPicture']) => void,
}