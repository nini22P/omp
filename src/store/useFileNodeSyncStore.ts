import { FileNodeSyncActions, FileNodeSyncState } from '@/types/fileNodeSync'
import { create } from 'zustand'
import createSelectors from './createSelectors'

const initialState: FileNodeSyncState = {
  status: 'idle',
  lastSync: null,
  error: null,
  isSyncingEnabled: false,
  syncRequested: false,
}

const useFileNodeSyncStoreBase = create<FileNodeSyncState & FileNodeSyncActions>(
  (set, get) => ({
    ...initialState,
    startSync: () => {
      if (get().status === 'syncing') {
        return
      }
      set({ status: 'syncing', error: null })
    },
    setSyncSuccess: () => set({ status: 'success', lastSync: new Date() }),
    setSyncError: (error: string) => set({ status: 'error', error: error }),
    enableSyncing: () => set({ isSyncingEnabled: true }),
    disableSyncing: () => set({ isSyncingEnabled: false }),
    requestSync: () => {
      if (get().isSyncingEnabled && get().status !== 'syncing') {
        set({ syncRequested: true })
      }
    },
    clearSyncRequest: () => set({ syncRequested: false }),
  })
)

const useFileNodeSyncStore = createSelectors(useFileNodeSyncStoreBase)

export default useFileNodeSyncStore