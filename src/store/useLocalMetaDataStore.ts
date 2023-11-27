import { MetaData } from '../types/MetaData'
import { filePathConvert } from '../utils'
import { get, set, clear, entries, createStore } from 'idb-keyval'

const useLocalMetaDataStore = () => {

  const metaDataStore = createStore('metadata', 'metadata-store')

  const getLocalMetaData = async (filePath: MetaData['path']) => {
    if (!filePath || filePath.length === 0) return null
    else {
      const metaData = await get(filePathConvert(filePath), metaDataStore)
      return metaData ? JSON.parse(metaData) : null
    }
  }

  const setLocalMetaData = async (metaData: MetaData) => await set(filePathConvert(metaData.path), JSON.stringify(metaData), metaDataStore)

  const getAllLocalMetaData = async () => await entries(metaDataStore)

  const clearLocalMetaData = async () => await clear(metaDataStore)

  return { getLocalMetaData, setLocalMetaData, getAllLocalMetaData, clearLocalMetaData }

}

export default useLocalMetaDataStore