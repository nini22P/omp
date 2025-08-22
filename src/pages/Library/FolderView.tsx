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

  const folders = useLiveQuery(async () => await db?.nodes.where('folder').equals(1).sortBy('name'), [db])

  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {folders?.map(folder => (
          <ListItem key={folder.name} disablePadding>
            <ListItemButton onClick={() => console.log(folder)}>
              <ListItemText
                primary={folder.name}
                secondary={`${sizeConv(folder.size)} • ${folder.childCount}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default FolderView