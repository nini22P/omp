import { t } from '@lingui/macro'
import { Box, IconButton, InputAdornment, InputBase, Paper, Popper, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useFilesData from '@/hooks/graph/useFilesData'
import useUser from '@/hooks/graph/useUser'

const SearchBar = () => {
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const searchOpen = Boolean(searchQuery.length)
  const handleCloseSearh = () => setSearchQuery('')
  const searchRef = useRef<HTMLElement | null>(null)

  useEffect(() => setAnchorEl(searchRef.current), [])

  const { account } = useUser()

  const { getSearchData } = useFilesData()

  useEffect(
    () => {
      if (searchQuery.length > 0)
        getSearchData(account, searchQuery).then(res => console.log(res))
    },
    [account, getSearchData, searchQuery]
  )

  return (
    <>
      <Box
        sx={{
          padding: '0.125rem 0 0.125rem 0.5rem',
          background: `${theme.palette.background.paper}99`,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '0.5rem',
        }}
        ref={searchRef}
      >
        <InputBase
          placeholder={t`Search`}
          sx={{ width: '100%' }}
          value={searchQuery}
          onChange={(ev) => setSearchQuery(ev.target.value)}
          endAdornment={
            searchOpen &&
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleCloseSearh}
              >
                <CloseRoundedIcon fontSize='small' />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
      <Popper
        open={searchOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <Paper sx={{ width: '240px', maxHeight: '300px', padding: '0.75rem' }}>
          {searchQuery}
        </Paper>
      </Popper>
    </>
  )
}

export default SearchBar