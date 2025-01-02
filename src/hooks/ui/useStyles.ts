import { Theme } from '@mui/material'
import { useMemo } from 'react'

const useStyles = (theme: Theme) => {

  const scrollbar = useMemo(() => ({
    '& ::-webkit-scrollbar': {
      width: '12px',
      height: '12px',
    },
    '& ::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '& ::-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main,
      borderRadius: '16px',
      border: '3.5px solid transparent',
      backgroundClip: 'content-box',
      visibility: 'hidden',
    },
    '& :hover::-webkit-scrollbar-thumb': {
      visibility: 'visible',
    },
  }),
    [theme.palette.primary.main]
  )

  return { scrollbar }
}

export default useStyles