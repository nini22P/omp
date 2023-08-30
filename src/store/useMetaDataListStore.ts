import { shallow } from 'zustand/shallow'
import { MetaDataListStatus, MetaDataListAction } from '../types/MetaData'
import { createWithEqualityFn } from 'zustand/traditional'

const useMetaDataListStore = createWithEqualityFn<MetaDataListStatus & MetaDataListAction>((set) => ({
  metaDataList: [],
  updateMetaDataList: (metaDataList) => set(() => ({ metaDataList: metaDataList })),
  insertMetaDataList: (metaData) => set((state) => ({ metaDataList: [...state.metaDataList.filter((item) => item.path !== metaData.path), metaData] })),
  clearMetaDataList: () => set(() => ({ metaDataList: [] })),
}), shallow)
export default useMetaDataListStore