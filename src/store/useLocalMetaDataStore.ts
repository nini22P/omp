import { MetaData } from '../types/MetaData'
import { pathConv } from '../utils'
import { get, getMany, set, clear, entries, createStore } from 'idb-keyval'

const useLocalMetaDataStore = () => {

  const metaDataStore = createStore('metadata', 'metadata-store')

  const getLocalMetaData = async (filePath: string[]) => {
    if (filePath.length === 0)
      return null
    else {
      const metaData = await get(pathConv(filePath), metaDataStore)
      return metaData ? JSON.parse(metaData) : null
    }
  }

  const getManyLocalMetaData = async (filePaths: string[][]) => {
    if (filePaths.length === 0)
      return null
    else {
      const metaData = await getMany(filePaths.map(pathConv), metaDataStore)
      return metaData.map(metaData => metaData ? JSON.parse(metaData) : null)
    }
  }

  const setLocalMetaData = async (metaData: MetaData) =>
    await set(pathConv(metaData.path), JSON.stringify(metaData), metaDataStore)

  const getAllLocalMetaData = async () => await entries(metaDataStore)

  const clearLocalMetaData = async () => await clear(metaDataStore)

  return {
    getLocalMetaData,
    getManyLocalMetaData,
    setLocalMetaData,
    getAllLocalMetaData,
    clearLocalMetaData,
  }

}

export default useLocalMetaDataStore