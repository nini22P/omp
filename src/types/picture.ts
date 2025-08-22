import { FileNode } from './file'

export interface PictiureState {
  pictureList: FileNode[]
  currentPicture: FileNode | null
}

export interface PictureActions {
  updatePictureList: (pictureList: PictiureState['pictureList']) => void
  updateCurrentPicture: (currentPicture: PictiureState['currentPicture']) => void
}