import { get, getMany, set, clear, entries, createStore } from 'idb-keyval'
import { RemoteItem } from '../types/file'
import { pathConv } from '@/utils';

export interface DeltaDataCache {
  items: RemoteItem[];
  deltaLink: string;
}

const useLocalDeltaDataStore = () => {

  const deltaDataStore = createStore('deltadata', 'deltadata-store')

  const getLocalDeltaData = async (path: string[]) => {
    if (path.length === 0)
      return null
    else {
      const deltaData = await get(pathConv(path), deltaDataStore)
      return deltaData ? JSON.parse(deltaData) as DeltaDataCache : null
    }
  }

  const getManyLocalDeltaData = async (paths: string[][]) => {
    if (paths.length === 0)
      return null
    else {
      const deltaData = await getMany(paths.map(pathConv), deltaDataStore)
      return deltaData.map(deltaData => deltaData ? JSON.parse(deltaData) as DeltaDataCache : null)
    }
  }

  const setLocalDeltaData = async (path: string[], deltaData: DeltaDataCache) =>
    await set(pathConv(path), JSON.stringify(deltaData), deltaDataStore)

  const getAllLocalDeltaData = async () => await entries(deltaDataStore)

  const clearLocalDeltaData = async () => await clear(deltaDataStore)

  return {
    getLocalDeltaData,
    getManyLocalDeltaData,
    setLocalDeltaData,
    getAllLocalDeltaData,
    clearLocalDeltaData,
  }

}

export default useLocalDeltaDataStore