import SetLibraryFolderDialog from '@/components/Dialog/SetLibraryFolderDialog'
import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import useFileNodeSyncStore from '@/store/useFileNodeSyncStore'
import { sizeConv } from '@/utils'
import { useLingui } from '@lingui/react/macro'
import { CircularProgress, Grid, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useMemo } from 'react'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'

const FolderView = () => {
  const { t } = useLingui()
  const { account } = useUser()
  const db = useDb(account)

  const settings = useLiveQuery(() => db?.settings.get('settings'), [db])
  const libraryRootId = useMemo(() => settings?.libraryRootId, [settings])

  const status = useFileNodeSyncStore.use.status()
  const error = useFileNodeSyncStore.use.error()

  const folders = useLiveQuery(async () => {
    if (!db) return []
    const audioFiles = await db.nodes.where('type').equals('audio').toArray()
    const parentIdsWithMusic = new Set(audioFiles.map(file => file.parentId).filter(Boolean))
    const folders = await db.nodes
      .where('id')
      .anyOf(Array.from(parentIdsWithMusic).filter((id): id is string => typeof id === 'string'))
      .sortBy('name')
    return folders
  }, [db])

  if (!folders)
    return <div />

  return (
    libraryRootId
      ?
      status === 'success'
        ?
        <List sx={{ width: '100%', height: '100%' }}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={folders.length}
                itemSize={72}
              >
                {({ index, style }) => (
                  <ListItem key={folders[index].id} disablePadding style={style}>
                    <ListItemButton onClick={() => console.log(folders[index])}>
                      <ListItemText
                        primary={folders[index].name}
                        secondary={[sizeConv(folders[index].size)].filter(Boolean).join(' • ')}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </FixedSizeList>
            )}
          </AutoSizer>
        </List>
        :
        <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
          <CircularProgress />
          <Typography variant='body1'>
            {
              (() => {
                switch (status) {
                  case 'idle': return t`Idle`
                  case 'syncing': return t`Syncing`
                  case 'error': return t`Error`
                }
              })()
            }
          </Typography>
          {
            error && <Typography variant='body1'>{error}</Typography>
          }
        </Grid>
      :
      <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
        <Typography variant='h6'>{t`Library folder not set`}</Typography>
        <SetLibraryFolderDialog />
      </Grid>
  )
}

export default FolderView