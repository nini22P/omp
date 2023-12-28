import { createTheme, useMediaQuery } from '@mui/material'

const useTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const color = {
    primary: prefersDarkMode ? '#df7ef9' : '#8e24aa',
  }

  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      background: {
        default: prefersDarkMode ? '#3b3b3b' : '#f7f7f7',
        paper: prefersDarkMode ? '#121212' : '#ffffff',
      },
      primary: {
        main: color.primary,
      },
      secondary: {
        main: '#ff3d00',
      },
      error: {
        main: '#ff1744',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            top: 'calc(env(titlebar-area-height, 0.25rem) + 0.25rem)',
            bottom: '0.25rem',
            height: 'auto',
            border: `${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'} solid 1px`,
          },
          paperAnchorLeft: {
            left: '0.25rem',
            boxShadow: `5px 5px 10px 0px ${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'}`,
          },
          paperAnchorRight: {
            right: '0.25rem',
            boxShadow: `-5px 5px 10px 0px ${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'}`,
          }
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem',
          }
        }
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            '&.active': {
              color: color.primary,
              backgroundColor: prefersDarkMode ? '#f7f7f711' : '#3b3b3b11',
            },
            '&.active .MuiListItemIcon-root': {
              color: color.primary,
            },
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: 0,
            marginRight: '1rem',
          },
        }
      },
      MuiListItemText: {
        styleOverrides: {
          primary: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          secondary: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: 'lighter',
          },
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: `${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'} solid 1px`,
            boxShadow: `5px 5px 10px 0px ${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'}`,
          }
        }
      }
    },
  })

  return theme
}

export default useTheme