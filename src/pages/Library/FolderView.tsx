import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { sizeConv } from '@/utils'
import { useLingui } from '@lingui/react/macro'
import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'

const FolderView = () => {
  const { t } = useLingui()
  const { account } = useUser()
  const db = useDb(account)

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

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {folders?.map(folder => (
          <ListItem key={folder.id} disablePadding>
            <ListItemButton onClick={() => console.log(folder)}>
              <ListItemText
                primary={folder.name}
                secondary={[sizeConv(folder.size)].filter(Boolean).join(' • ')}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default FolderView