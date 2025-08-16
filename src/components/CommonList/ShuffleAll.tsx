import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'
import { useLingui } from '@lingui/react/macro'

const ShuffleAll = ({ handleClickShuffleAll }: { handleClickShuffleAll: () => void }) => {
  const { t } = useLingui()

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