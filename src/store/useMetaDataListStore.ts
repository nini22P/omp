import { shallow } from 'zustand/shallow'
import { MetaDataListStatus, MetaDataListAction } from '../types/MetaData'
import { createWithEqualityFn } from 'zustand/traditional'
import { persist, createJSONStorage } from 'zustand/middleware'
import { indexedDBstorage } from './storage'

const useMetaDataListStore = createWithEqualityFn<MetaDataListStatus & MetaDataListAction>()(
  persist(
    (set) => ({
      metaDataList: [],
      updateMetaDataList: (metaDataList) => set(() => ({ metaDataList: metaDataList })),
      insertMetaDataList: (metaData) => set((state) => ({ metaDataList: [...state.metaDataList.filter((item) => item.path !== metaData.path), metaData] })),
      clearMetaDataList: () => set(() => ({ metaDataList: [] })),
    }),
    {
      name: 'metaDataList-storage',
      storage: createJSONStorage(() => indexedDBstorage),
    }), shallow)

export default useMetaDataListStore