import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { useMediaQuery } from '@mui/material'
import createTheme from '@mui/material/styles/createTheme'
import { extractColors } from 'extract-colors'
import { useEffect, useMemo, useState } from 'react'
import Color from 'color'
import { useShallow } from 'zustand/shallow'
const useCustomTheme = () => {
  const [
    coverColor,
    CoverThemeColor,
    colorMode,
    updateCoverColor,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.coverColor,
        state.CoverThemeColor,
        state.colorMode,
        state.updateCoverColor,
      ]
    )
  )

  const cover = usePlayerStore((state) => state.cover)

  useEffect(
    () => {
      if (colorMode === 'dark' || colorMode === 'light')
        document.documentElement.setAttribute('data-theme', colorMode)
      if (colorMode === 'auto')
        document.documentElement.removeAttribute('data-theme')
      return () => {
        document.documentElement.removeAttribute('data-theme')
      }
    },
    [colorMode]
  )

  const prefersColorSchemeDark = useMediaQuery('(prefers-color-scheme: dark)')
  const prefersDarkMode = useMemo(() => colorMode === 'light' ? false : prefersColorSchemeDark || colorMode === 'dark', [colorMode, prefersColorSchemeDark])
  const [coverColors, setCoverColors] = useState<{ lightMode: string, darkMode: string } | null>(null)

  // 从专辑封面提取颜色
  useEffect(
    () => {
      (async () => {
        if (cover !== './cover.svg') {
          const color = (await extractColors(cover))[0]
          const getLightModeColor = (color: Color): Color => color.isDark() ? color : getLightModeColor(color.lightness(color.lightness() - 1))
          const lightModeColor = getLightModeColor(Color(color.hex)).hex()
          const getDarkModeColor = (color: Color): Color => color.isLight() ? color : getDarkModeColor(color.lightness(color.lightness() + 1))
          const darkModeColor = getDarkModeColor(Color(color.hex)).hex()
          setCoverColors({ lightMode: lightModeColor, darkMode: darkModeColor })
        }
      })()
    },
    [cover]
  )

  useEffect(() => {
    if (coverColors) {
      updateCoverColor(prefersDarkMode ? coverColors.darkMode : coverColors.lightMode)
    }
  }, [coverColors, prefersDarkMode, updateCoverColor])

  const colors = useMemo(() => ({
    primary: CoverThemeColor ? coverColor : prefersDarkMode ? '#df7ef9' : '#8e24aa',
  }), [CoverThemeColor, coverColor, prefersDarkMode])

  const customTheme = useMemo(() => createTheme({
    palette: {
      mode: prefersDarkMode ? 'dark' : 'light',
      background: {
        default: prefersDarkMode ? '#3b3b3b' : '#f7f7f7',
        paper: prefersDarkMode ? '#121212' : '#ffffff',
      },
      primary: {
        main: colors.primary,
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
            top: 'calc(env(titlebar-area-height, 0rem) + 0.25rem)',
            bottom: '0.25rem',
            height: 'auto',
            border: `${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'} solid 1px`,
            boxShadow: `0px 5px 5px -3px ${prefersDarkMode ? '#f7f7f733' : '#3b3b3b33'}, 0px 8px 10px 1px ${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'}, 0px 3px 14px 2px ${prefersDarkMode ? '#f7f7f720' : '#3b3b3b20'}`,
          },
          paperAnchorLeft: {
            left: '0.25rem',
          },
          paperAnchorRight: {
            right: '0.25rem',
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
      MuiList: {
        styleOverrides: {
          root: {
            padding: '0.25rem',
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
              backgroundColor: prefersDarkMode ? '#f7f7f711' : '#3b3b3b11',
            },
            '&.active .MuiListItemIcon-root': {
              color: colors.primary,
            },
            '&.active .MuiListItemText-root': {
              color: colors.primary,
            }
          },
        },
      },
      MuiListItemIcon: {
        styleOverrides: {
          root: {
            minWidth: '0px !important',
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
      MuiListItemSecondaryAction: {
        styleOverrides: {
          root: {
            right: '0.5rem',
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: `${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'} solid 1px`,
            boxShadow: `5px 5px 10px 0px ${prefersDarkMode ? '#f7f7f722' : '#3b3b3b22'}`,
          },
          root: {
            ' .MuiBackdrop-root': {
              background: `${prefersDarkMode ? '#121212' : '#ffffff'}33`,
              backdropFilter: 'blur(0.5px)',
            },
          }
        }
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: '0.5rem',
          }
        }
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            borderRadius: '0.5rem',
            padding: '0.25rem',
            ':focus': {
              borderRadius: '0.5rem',
              backgroundColor: '#00000000',
            }
          },
        }
      },
    },
  }),
    [colors.primary, prefersDarkMode]
  )

  return customTheme
}

export default useCustomTheme