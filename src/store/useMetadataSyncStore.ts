import { create } from 'zustand'
import createSelectors from './createSelectors'

type MetadataSyncStatus = 'idle' | 'fetching'

interface MetadataSyncStore {
  status: MetadataSyncStatus
  start: () => void
  finish: () => void
}

const useMetadataSyncStoreBase = create<MetadataSyncStore>((set) => ({
  status: 'idle',
  start: () => set({ status: 'fetching' }),
  finish: () => set({ status: 'idle' }),
}))

const useMetadataSyncStore = createSelectors(useMetadataSyncStoreBase)

export default useMetadataSyncStore
