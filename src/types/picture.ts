import { FileItem } from './file'

export interface PictiureState {
  pictureList: FileItem[]
  currentPicture: FileItem | null
}

export interface PictureActions {
  updatePictureList: (pictureList: PictiureState['pictureList']) => void
  updateCurrentPicture: (currentPicture: PictiureState['currentPicture']) => void
}