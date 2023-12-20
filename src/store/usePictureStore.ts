import { PictiureStatus, PictureAction } from '@/types/picture'
import { create } from 'zustand'

const usePictureStore = create<PictiureStatus & PictureAction>(
  (set) => ({
    pictureList: [],
    currentPicture: null,
    updatePictureList: (pictureList) => set(() => ({ pictureList: pictureList })),
    updateCurrentPicture: (currentPicture) => set(() => ({ currentPicture: currentPicture })),
  })
)

export default usePictureStore