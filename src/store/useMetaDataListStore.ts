import { create } from 'zustand'
import { MetaDataListStatus, MetaDataListAction } from '../types/MetaData'

const useMetaDataListStore = create<MetaDataListStatus & MetaDataListAction>((set) => ({
  metaDataList: [],
  updateMetaDataList: (metaDataList) => set(() => ({ metaDataList: metaDataList })),
  insertMetaDataList: (metaData) => set((state) => ({ metaDataList: [...state.metaDataList.filter((item) => item.path !== metaData.path), metaData] })),
  clearMetaDataList: () => set(() => ({ metaDataList: [] })),
})
)
export default useMetaDataListStore