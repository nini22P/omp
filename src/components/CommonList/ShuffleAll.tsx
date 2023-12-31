import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import ShuffleRoundedIcon from '@mui/icons-material/ShuffleRounded'

const ShuffleAll = ({ handleClickShuffleAll }: { handleClickShuffleAll: () => void }) => {

  const { t } = useTranslation()

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
        <ListItemText primary={t('playlist.shuffleAll')} />
      </ListItemButton>
    </ListItem>
  )
}

export default ShuffleAll