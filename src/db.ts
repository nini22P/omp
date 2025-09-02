import { Settings } from '@/types/library'
import Dexie, { type EntityTable } from 'dexie'
import { FileNode } from './types/file'
import { MetaData } from './types/metaData'

export type LibraryDB = Dexie & {
  settings: EntityTable<Settings, 'id'>,
  nodes: EntityTable<FileNode, 'id'>,
  metadata: EntityTable<MetaData, 'id'>,
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
      '&id',
      'parentId',
      '[parentId+name]',
      'name',
      'size',
      'lastModifiedDateTime',
      'folder',
      'type',
      'metadataState',
      '[type+name]',
      '[type+lastModifiedDateTime]',
    ].join(', '),
    metadata: [
      '&id',
      'common.title',
      'common.artist',
      'common.albumartist',
      'common.album',
      '*common.genre',
      '[common.albumartist+common.album]',
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