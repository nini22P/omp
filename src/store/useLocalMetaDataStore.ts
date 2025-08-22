import { clear, createStore } from 'idb-keyval'

const useLocalMetaDataStore = () => {

  const metaDataStore = createStore('metadata', 'metadata-store')

  const clearLocalMetaData = async () => await clear(metaDataStore)

  return {
    clearLocalMetaData,
  }

}

export default useLocalMetaDataStore