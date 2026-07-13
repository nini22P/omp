import { useEffect, useRef } from 'react'
import useUser from './useUser'
import useDb from '../useDb'
import useGraph from './useGraph'
import { useMsal } from '@azure/msal-react'
import useFileNodeSyncStore from '@/store/useFileNodeSyncStore'
import useMetadataSyncStore from '@/store/useMetadataSyncStore'
import { graphAudioToMetadata } from '@/utils/graphAudioMetadata'
import type { FileNode } from '@/types/file'
import { getRangeMetadata } from '@/utils/rangeMetadata'
import { RangeRequestError } from '@/utils/rangeReader'
import pLimit from 'p-limit'

const MAX_ATTEMPTS = 3
const RETRY_BASE_DELAY_MS = 1_000
const metadataTaskLimit = pLimit(2)

const getAbortReason = (signal: AbortSignal) =>
  signal.reason ?? new DOMException('Aborted', 'AbortError')

const throwIfAborted = (signal: AbortSignal) => {
  if (signal.aborted) throw getAbortReason(signal)
}

const wait = (ms: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
  throwIfAborted(signal)

  const timeout = window.setTimeout(() => {
    signal.removeEventListener('abort', handleAbort)
    resolve()
  }, ms)

  const handleAbort = () => {
    window.clearTimeout(timeout)
    reject(getAbortReason(signal))
  }

  signal.addEventListener('abort', handleAbort, { once: true })
})

const useMetadataSync = () => {
  const { instance } = useMsal()
  const { account } = useUser()
  const db = useDb(account)
  const { getFileData } = useGraph(instance, account)
  const fileSyncStatus = useFileNodeSyncStore.use.status()
  const start = useMetadataSyncStore.use.start()
  const finish = useMetadataSyncStore.use.finish()
  const running = useRef<symbol | null>(null)

  useEffect(() => {
    if (!db || !account || fileSyncStatus !== 'success' || running.current) return

    const controller = new AbortController()
    const { signal } = controller
    const runToken = Symbol('metadata-sync')
    let started = false
    running.current = runToken

    const isCurrentRun = () => running.current === runToken && !signal.aborted

    const fetchWithRetry = async (node: FileNode) => {
      let lastError: unknown

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        throwIfAborted(signal)
        try {
          return await getFileData(node.id, undefined, signal, 'low', false)
        } catch (error) {
          throwIfAborted(signal)
          lastError = error
          if (attempt < MAX_ATTEMPTS - 1) {
            await wait(RETRY_BASE_DELAY_MS * (2 ** attempt), signal)
          }
        }
      }

      throw lastError
    }

    const run = async () => {
      try {
        const nodes = await db.nodes
          .where('metadataState')
          .anyOf(['pending', 'failed'])
          .and(node => node.type === 'audio')
          .toArray()

        if (nodes.length === 0 || !isCurrentRun()) return

        start()
        started = true

        await Promise.allSettled(nodes.map(node => metadataTaskLimit(async () => {
          if (!isCurrentRun()) return

          try {
            const remoteItem = await fetchWithRetry(node)
            if (!isCurrentRun()) return

            const graphTitle = typeof remoteItem.audio?.title === 'string' && remoteItem.audio.title.trim()
            let metadata

            if (graphTitle) {
              metadata = graphAudioToMetadata(node, remoteItem.audio)
            } else if (remoteItem['@microsoft.graph.downloadUrl']) {
              try {
                // Range requests must target the short-lived download URL.
                // https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0#partial-range-downloads
                metadata = await getRangeMetadata(node, remoteItem['@microsoft.graph.downloadUrl'], signal)
              } catch (error) {
                if (!isCurrentRun()) return
                if (error instanceof RangeRequestError) throw error
                console.warn(`Falling back to filename metadata for ${node.name}:`, error)
                metadata = graphAudioToMetadata(node)
              }
            } else {
              throw new Error('No download URL returned for metadata extraction.')
            }

            if (!isCurrentRun()) return
            await db.transaction('rw', db.metadata, db.nodes, async transaction => {
              const handleAbort = () => transaction.abort()
              signal.addEventListener('abort', handleAbort, { once: true })
              try {
                throwIfAborted(signal)
                await db.metadata.put(metadata)
                throwIfAborted(signal)
                await db.nodes.update(node.id, { metadataState: 'completed' })
              } finally {
                signal.removeEventListener('abort', handleAbort)
              }
            })
          } catch (error) {
            if (!isCurrentRun()) return
            console.error(`Failed to get metadata for ${node.name}:`, error)
            try {
              await db.transaction('rw', db.nodes, async transaction => {
                const handleAbort = () => transaction.abort()
                signal.addEventListener('abort', handleAbort, { once: true })
                try {
                  throwIfAborted(signal)
                  await db.nodes.update(node.id, { metadataState: 'failed' })
                } finally {
                  signal.removeEventListener('abort', handleAbort)
                }
              })
            } catch (dbError) {
              if (isCurrentRun()) {
                console.error(`Failed to update metadataState to failed for ${node.name}:`, dbError)
              }
            }
          }
        })))
      } catch (error) {
        if (isCurrentRun()) console.error('Failed to start metadata sync:', error)
      } finally {
        if (running.current === runToken) {
          running.current = null
          if (started) finish()
        }
      }
    }

    void run()

    return () => {
      controller.abort()
      if (running.current === runToken) {
        running.current = null
        if (started) finish()
      }
    }
    // Graph helpers close over the current account and are recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, db, fileSyncStatus, finish, start])
}

export default useMetadataSync
