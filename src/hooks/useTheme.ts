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
    listItemActive: {
      '&.active': {
        color: theme.palette.primary.main,
      },
      '&.active .MuiListItemIcon-root': {
        color: theme.palette.primary.main,
      },
    },
    color: {
      primary: theme.palette.primary.main,
      shadow: theme.palette.divider,
    }
  }

  return { theme, styles }
}

export default useTheme