import { useMemo } from 'react'
import { createTheme, useMediaQuery } from '@mui/material'

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: prefersDarkMode ? 'dark' : 'light',
        background: {
          default: prefersDarkMode ? '#3b3b3b' : '#f7f7f7',
          paper: prefersDarkMode ? '#121212' : '#ffffff',
        },
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

  return theme
}

export default useTheme