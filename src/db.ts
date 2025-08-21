import { FileNode, Settings } from '@/types/library'
import Dexie, { type EntityTable } from 'dexie'

export type LibraryDB = Dexie & {
  settings: EntityTable<Settings, 'id'>,
  nodes: EntityTable<FileNode, 'id'>,
}

const dbInstances = new Map<string, LibraryDB>()

export function getDbForUser(userId: string): LibraryDB {
  if (dbInstances.has(userId)) {
    return dbInstances.get(userId)!
  }

  const dbName = `library_${userId}`
  const db = new Dexie(dbName) as LibraryDB

  db.version(1).stores({
    settings: '&id',
    nodes: [
      '&id, parentId, [parentId+name]',
      'type, [type+name], [type+size], [type+lastModifiedDateTime]',
      'metadataState',
    ].join(', ')
  })

  db.on('populate', async () => {
    await db.settings.add({
      id: 'settings',
      deltaLink: undefined,
      libraryRootId: undefined,
    })
  })

  dbInstances.set(userId, db)

  return db
}