import { MetaData } from '../types/MetaData'
import { pathConvert } from '../utils'
import { get, getMany, set, clear, entries, createStore } from 'idb-keyval'

const useLocalMetaDataStore = () => {

  const metaDataStore = createStore('metadata', 'metadata-store')

  const getLocalMetaData = async (filePath: MetaData['path']) => {
    if (!filePath || filePath.length === 0) return null
    else {
      const metaData = await get(pathConvert(filePath), metaDataStore)
      return metaData ? JSON.parse(metaData) : null
    }
  }

  const getManyLocalMetaData = async (filePaths: MetaData['path'][]) => {
    if (!filePaths || filePaths.length === 0) return null
    else {
      const metaData = await getMany(filePaths.map(pathConvert), metaDataStore)
      return metaData.map(metaData => metaData ? JSON.parse(metaData) : null)
    }
  }

  const setLocalMetaData = async (metaData: MetaData) => await set(pathConvert(metaData.path), JSON.stringify(metaData), metaDataStore)

  const getAllLocalMetaData = async () => await entries(metaDataStore)

  const clearLocalMetaData = async () => await clear(metaDataStore)

  return { getLocalMetaData, getManyLocalMetaData, setLocalMetaData, getAllLocalMetaData, clearLocalMetaData }

}

export default useLocalMetaDataStore