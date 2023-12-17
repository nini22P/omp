import { PictiureStatus, PictureAction } from '@/types/picture'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const usePictureStore = create<PictiureStatus & PictureAction>()(
  persist(
    (set) => ({
      pictureList: [],
      currentPicture: null,
      updatePictureList: (pictureList) => set(() => ({ pictureList: pictureList })),
      updateCurrentPicture: (currentPicture) => set(() => ({ currentPicture: currentPicture })),
    }),
    {
      name: 'picture-store',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default usePictureStore