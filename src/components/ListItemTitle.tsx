import { ListItem, ListItemText, useTheme } from '@mui/material'

const ListItemTitle = ({ title }: { title: string }) => {
  const theme = useTheme()
  return (
    <ListItem>
      <ListItemText inset sx={{ color: theme.palette.primary.main }} primary={title} />
    </ListItem>
  )
}

export default ListItemTitle