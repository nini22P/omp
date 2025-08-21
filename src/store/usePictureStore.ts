import { PictiureState, PictureActions } from '@/types/picture'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const usePictureStoreBase = create<PictiureState & PictureActions>(
  (set) => ({
    pictureList: [],
    currentPicture: null,
    updatePictureList: (pictureList) => set(() => ({ pictureList: pictureList })),
    updateCurrentPicture: (currentPicture) => set(() => ({ currentPicture: currentPicture })),
  })
)

const usePictureStore = createSelectors(usePictureStoreBase)

export default usePictureStore