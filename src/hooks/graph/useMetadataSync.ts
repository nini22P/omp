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

const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

const useMetadataSync = () => {
  const { instance } = useMsal()
  const { account } = useUser()
  const db = useDb(account)
  const { getFileData } = useGraph(instance, account)
  const fileSyncStatus = useFileNodeSyncStore.use.status()
  const start = useMetadataSyncStore.use.start()
  const finish = useMetadataSyncStore.use.finish()
  const running = useRef(false)

  useEffect(() => {
    if (!db || !account || fileSyncStatus !== 'success' || running.current) return

    const fetchWithRetry = async (node: FileNode) => {
      let lastError: unknown

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        try {
          return await getFileData(node.id, undefined, undefined, 'low', false)
        } catch (error) {
          lastError = error
          if (attempt < MAX_ATTEMPTS - 1) {
            await wait(RETRY_BASE_DELAY_MS * (2 ** attempt))
          }
        }
      }

      throw lastError
    }

    const run = async () => {
      running.current = true

      try {
        const nodes = await db.nodes
          .where('metadataState')
          .anyOf(['pending', 'failed'])
          .and(node => node.type === 'audio')
          .toArray()

        if (nodes.length === 0) return

        start()

        await Promise.all(nodes.map(node => metadataTaskLimit(async () => {
          try {
            const remoteItem = await fetchWithRetry(node)
            const graphTitle = typeof remoteItem.audio?.title === 'string' && remoteItem.audio.title.trim()
            let metadata

            if (graphTitle) {
              metadata = graphAudioToMetadata(node, remoteItem.audio)
            } else if (remoteItem['@microsoft.graph.downloadUrl']) {
              try {
                // Range requests must target the short-lived download URL.
                // https://learn.microsoft.com/en-us/graph/api/driveitem-get-content?view=graph-rest-1.0#partial-range-downloads
                metadata = await getRangeMetadata(node, remoteItem['@microsoft.graph.downloadUrl'])
              } catch (error) {
                if (error instanceof RangeRequestError) throw error
                console.warn(`Falling back to filename metadata for ${node.name}:`, error)
                metadata = graphAudioToMetadata(node)
              }
            } else {
              throw new Error('No download URL returned for metadata extraction.')
            }

            await db.transaction('rw', db.metadata, db.nodes, async () => {
              await db.metadata.put(metadata)
              await db.nodes.update(node.id, { metadataState: 'completed' })
            })
          } catch (error) {
            console.error(`Failed to get metadata for ${node.name}:`, error)
            await db.nodes.update(node.id, { metadataState: 'failed' })
          }
        })))
      } catch (error) {
        console.error('Failed to start metadata sync:', error)
      } finally {
        running.current = false
        finish()
      }
    }

    void run()
    // Graph helpers close over the current account and are recreated on render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, db, fileSyncStatus, finish, start])
}

export default useMetadataSync
