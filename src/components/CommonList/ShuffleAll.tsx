import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { t } from '@lingui/macro'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'

const ShuffleAll = ({ handleClickShuffleAll }: { handleClickShuffleAll: () => void }) => {

  return (
    <ListItem
      disablePadding
      sx={{
        '& .MuiListItemButton-root': {
          paddingLeft: 4,
        },
        '& .MuiListItemIcon-root': {
          minWidth: 0,
          marginRight: 3,
        },
      }}
    >
      <ListItemButton onClick={handleClickShuffleAll}>
        <ListItemIcon>
          <ShuffleRoundedIcon />
        </ListItemIcon>
        <ListItemText primary={t`Shuffle all`} />
      </ListItemButton>
    </ListItem>
  )
}

export default ShuffleAll