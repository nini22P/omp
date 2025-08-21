type FileNodeSyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface FileNodeSyncState {
  status: FileNodeSyncStatus
  lastSync: Date | null
  error: string | null
  isSyncingEnabled: boolean
  syncRequested: boolean
}

export interface FileNodeSyncActions {
  startSync: () => void
  setSyncSuccess: () => void
  setSyncError: (error: string) => void
  enableSyncing: () => void
  disableSyncing: () => void
  requestSync: () => void
  clearSyncRequest: () => void
}