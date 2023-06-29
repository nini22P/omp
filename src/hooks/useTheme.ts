import { useMemo } from 'react'
import { createTheme, useMediaQuery } from '@mui/material'

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: '#8e24aa',
          },
          secondary: {
            main: '#ff3d00',
          },
          error: {
            main: '#ff1744',
          },
        },
      }),
    [prefersDarkMode],
  )

  const styles = {
    color: {
      primary: theme.palette.primary.main,
      shadow: theme.palette.divider,
    },
    listItemActive: {
      '&.active': {
        color: theme.palette.primary.main,
      },
      '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
    },
    listItemPrimary: {
      // '.MuiListItemIcon-root': {
      //   color: theme.palette.primary.main,
      // },
      '.MuiListItemText-root': {
        color: theme.palette.primary.main,
      },
      '.MuiListItemText-secondary': {
        color: theme.palette.primary.main,
      }
    },
    listItemTextNoWrap: {
      style: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    }
  }

  return { theme, styles }
}

export default useTheme