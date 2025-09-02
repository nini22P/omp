import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { sizeConv } from '@/utils'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'

const FolderView = () => {
  const { account } = useUser()
  const db = useDb(account)
  const navigate = useNavigate()

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
                <ListItemButton onClick={() => navigate(`/library/folders/${folders[index].id}`)}>
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
  )
}

export default FolderView