import { get, getMany, set, clear, entries, createStore } from 'idb-keyval'
import { RemoteItem } from '../types/file'

export interface deltaDataCache {
  items: RemoteItem[];
  url?: string;        // @odata.deltaLink
}

const useLocalDeltaDataStore = () => {

  const deltaDataStore = createStore('deltadata', 'deltadata-store')

  const getLocalDeltaData = async (filePath: string) => {
    if (!filePath || filePath.length === 0) return null
    else {
      const deltaData = await get(filePath, deltaDataStore)
      return deltaData ? JSON.parse(deltaData) as deltaDataCache : null
    }
  }

  const getManyLocalDeltaData = async (filePaths: string[]) => {
    if (!filePaths || filePaths.length === 0) return null
    else {
      const deltaData = await getMany(filePaths, deltaDataStore)
      return deltaData.map(deltaData => deltaData ? JSON.parse(deltaData) as deltaDataCache : null)
    }
  }

  const setLocalDeltaData = async (path: string, deltaData: deltaDataCache) => {
    await set(path, JSON.stringify(deltaData), deltaDataStore)
  }

  const getAllLocalDeltaData = async () => await entries(deltaDataStore)

  const clearLocalDeltaData = async () => await clear(deltaDataStore)

  return { getLocalDeltaData, getManyLocalDeltaData, setLocalDeltaData, getAllLocalDeltaData, clearLocalDeltaData }

}

export default useLocalDeltaDataStore