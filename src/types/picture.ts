import { File } from './file'

export interface PictiureStatus {
  pictureList: File[];
  currentPicture: File | null;
}

export interface PictureAction {
  updatePictureList: (pictureList: PictiureStatus['pictureList']) => void;
  updateCurrentPicture: (currentPicture: PictiureStatus['currentPicture']) => void;
}