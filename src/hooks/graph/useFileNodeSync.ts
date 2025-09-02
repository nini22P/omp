import { LibraryDB } from '@/db'
import { useMsal } from '@azure/msal-react'
import { useLiveQuery } from 'dexie-react-hooks'
import useGraph from './useGraph'
import useUser from './useUser'
import useFileNodeSyncStore from '@/store/useFileNodeSyncStore'
import { useShallow } from 'zustand/shallow'
import { useEffect } from 'react'
import useDb from '../useDb'
import { FileNode } from '@/types/file'
import { remoteItemToFileNode } from '@/utils/remote'

const useFileNodeSync = () => {

  const { instance } = useMsal()
  const { account } = useUser()

  const db = useDb(account)

  const { getDeltaData } = useGraph(instance, account)

  const libraryRootId = useLiveQuery(async () => (await db?.settings.get('settings'))?.libraryRootId, [db])

  const [
    status,
    syncRequested,
    startSync,
    setSyncSuccess,
    setSyncError,
    clearSyncRequest,
  ] = useFileNodeSyncStore(
    useShallow((state) => [
      state.status,
      state.syncRequested,
      state.startSync,
      state.setSyncSuccess,
      state.setSyncError,
      state.clearSyncRequest,
    ])
  )

  const runSync = async (db: LibraryDB) => {
    if (status === 'syncing') return
    startSync()

    const rootId = libraryRootId
    if (!rootId) {
      setSyncError('未设置媒体库根目录。')
      return
    }

    try {
      const deltaLink = (await db.settings.get('settings'))?.deltaLink

      if (!deltaLink) {
        await performFullSync(db, rootId)
      } else {
        await applyDeltaChanges(db, rootId, deltaLink)
      }

      setSyncSuccess()
      console.log('文件结构同步成功！')

    } catch (error: unknown) {
      if (error instanceof Error) {
        setSyncError(error.message || '发生未知错误')
        console.error('文件结构同步失败:', error)
      } else {
        setSyncError('发生未知错误')
        console.error('文件结构同步失败:', error)
      }
    }
  }

  const performFullSync = async (db: LibraryDB, libraryRootId: string) => {
    const res = await getDeltaData(libraryRootId)

    const remoteItems = [...res.value]

    const fileNodes: FileNode[] = []

    for (const item of remoteItems) {
      if (!item.deleted) {
        const node = remoteItemToFileNode(item)
        fileNodes.push(node)
      }
    }

    await db.transaction('rw', db.nodes, db.settings, async () => {
      await db.nodes.clear()
      await db.nodes.bulkPut(fileNodes)
      await db.settings.update('settings', { deltaLink: res['@odata.deltaLink'] })
    })
  }

  const applyDeltaChanges = async (db: LibraryDB, libraryRootId: string, deltaLink: string) => {
    const res = await getDeltaData(libraryRootId, deltaLink)
    const remoteChanges = res.value

    const nodesToPut: FileNode[] = []
    const idsToDelete = new Set<string>()
    const changedIds = remoteChanges.filter(item => !item.deleted).map(item => item.id)

    const existingNodes = await db.nodes.bulkGet(changedIds)
    const existingNodesMap = new Map(existingNodes.filter(Boolean).map(node => [node!.id, node!]))

    for (const item of remoteChanges) {
      if (item.deleted) {
        idsToDelete.add(item.id)
      } else {
        const existingNode = existingNodesMap.get(item.id)
        const newNodeData = remoteItemToFileNode(item)

        if (existingNode && existingNode.cTag !== item.cTag) {
          newNodeData.metadataState = 'pending'
        }
        nodesToPut.push(newNodeData)
      }
    }

    await db.transaction('rw', db.nodes, db.settings, async () => {
      if (idsToDelete.size > 0) {
        for (const id of idsToDelete) {
          await deleteNodeAndDescendants(db, id)
        }
      }

      if (nodesToPut.length > 0) {
        await db.nodes.bulkPut(nodesToPut)
      }

      await db.settings.update('settings', { deltaLink: res['@odata.deltaLink'] })
    })
  }

  async function deleteNodeAndDescendants(db: LibraryDB, nodeId: string) {
    const children = await db.nodes.where('parentId').equals(nodeId).toArray()
    for (const child of children) {
      await deleteNodeAndDescendants(db, child.id)
    }
    await db.nodes.delete(nodeId)
  }

  useEffect(
    () => {
      if (syncRequested && db) {
        clearSyncRequest()
        runSync(db)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [db, syncRequested]
  )
}

export default useFileNodeSync