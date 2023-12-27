import { useTheme } from '@mui/material'

const useStyles = () => {
  const theme = useTheme()

  const styles = {
    color: {
      primary: theme.palette.primary.main,
      shadow: theme.palette.divider,
    },
    navListItem: {
      '&.MuiListItemButton-root': {
        paddingLeft: 2,
        paddingRight: 2,
      },
      '& .MuiListItemIcon-root': {
        minWidth: 0,
        marginRight: 2,
      },
      '&.active': {
        color: theme.palette.primary.main,
      },
      '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
    },
    listItemTextNoWrap: {
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    }
  }

  return styles
}

export default useStyles