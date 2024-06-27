import { t } from '@lingui/macro'
import { Box, ButtonBase, Dialog, DialogContent, IconButton, InputAdornment, InputBase, LinearProgress, MenuItem, Select, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useFilesData from '@/hooks/graph/useFilesData'
import useUser from '@/hooks/graph/useUser'
import useUiStore from '@/store/useUiStore'
import { remoteItemToFile, pathConvert } from '@/utils'
import { RemoteItem } from '@/types/file'
import useSWR from 'swr'
import useDebounce from '@/hooks/useDebounce'
import CommonList from '@/components/CommonList/CommonList'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useLocation, useNavigate } from 'react-router-dom'
import useCustomTheme from '@/hooks/ui/useCustomTheme'
import { animated, useSpring } from '@react-spring/web'

type SearchScope = 'global' | 'current'

const Search = ({ type = 'icon' }: { type?: 'icon' | 'bar' }) => {
  const theme = useTheme()
  const { scrollbarStyle } = useCustomTheme()

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, searchQuery.length > 0 ? 1000 : 0)
  const [folderTree, updateFolderTree] = useUiStore(state => [state.folderTree, state.updateFolderTree])
  const [searchScope, setSearchScope] = useState<SearchScope>('current')

  const location = useLocation()
  const navigate = useNavigate()

  const isFileView = location.pathname === '/'

  useEffect(() => isFileView ? setSearchScope('current') : setSearchScope('global'), [isFileView, location.pathname])

  const path = searchScope === 'global' ? '/' : pathConvert(folderTree)

  const [searchOpen, setSearchOpen] = useState(false)

  const handleCloseSearh = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  const { account } = useUser()

  const { getFilesData, getSearchData } = useFilesData()

  const fileListFetcher = async (path: string) => {
    const res: RemoteItem[] = await getFilesData(account, path)
    return remoteItemToFile(res).filter(item => ['folder', 'audio', 'video'].includes(item.fileType))
  }

  const { data: filesData } = useSWR(
    account ? `${account.username}/${path}` : null,
    () => fileListFetcher(path),
  )

  const searchFetcher = async (path: string, searchQuery: string) => {
    const res: RemoteItem[] = await getSearchData(account, path, searchQuery)
    return remoteItemToFile(res).filter(item => ['folder', 'audio', 'video'].includes(item.fileType))
  }

  const { data: searchData, isLoading: searchIsLoading } = useSWR(
    (debouncedSearchQuery.length > 0) && account ? `${account.username}/${path}/${debouncedSearchQuery}` : null,
    () => searchFetcher(path, debouncedSearchQuery),
  )

  const filteredFilesData = debouncedSearchQuery.length > 0 ? filesData?.filter(item => item.fileName.toLocaleLowerCase().includes(debouncedSearchQuery.toLocaleLowerCase())) : []
  const filteredData = [...filteredFilesData || [], ...searchData?.filter(searchItem => !filteredFilesData?.find(item => (pathConvert(item.filePath) === pathConvert(searchItem.filePath)))) || []]

  const open = (index: number) => {
    const currentFile = filteredData[index]
    if (currentFile.fileType === 'folder') {
      handleCloseSearh()
      updateFolderTree(currentFile.filePath)
      navigate('/')
    } else if (['audio', 'video'].includes(currentFile.fileType)) {
      handleCloseSearh()
      updateFolderTree(currentFile.filePath.slice(0, currentFile.filePath.length - 1))
      navigate('/')
    }
  }

  const isShow = filteredData && filteredData.length > 0

  const [{ height }] = useSpring(
    () => ({
      from: {
        height: isShow ? '0' : '100dvh',
      },
      to: {
        height: isShow ? '100dvh' : '0',
      },
      config: {
        mass: 1,
        tension: 190,
        friction: 20,
      }
    }),
    [isShow]
  )

  return (
    <>
      {
        type === 'icon' &&
        <IconButton
          onClick={() => setSearchOpen(true)}
          aria-label={t`Search`}
          sx={{
            borderRadius: '0.2rem',
            '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
              borderRadius: '0.2rem',
            },
          }}
        >
          <SearchRoundedIcon />
        </IconButton>
      }
      {
        type === 'bar' &&
        <ButtonBase
          sx={{
            background: `${theme.palette.background.paper}99`,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '0.5rem',
            width: '100%',
            height: '100%',
            color: theme.palette.text.secondary,
          }}
          onClick={() => setSearchOpen(true)}
          aria-label={t`Search`}
        >
          {t`Search`}
        </ButtonBase>
      }

      <Dialog
        open={searchOpen}
        onClose={handleCloseSearh}
        maxWidth='xs'
        fullWidth
        disableRestoreFocus
        sx={{
          ...scrollbarStyle,
        }}
      >
        <Box
          sx={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
          }}
        >
          <InputBase
            autoFocus
            placeholder={t`Search`}
            sx={{ width: '100%', fontSize: '1rem' }}
            value={searchQuery}
            onChange={(ev) => setSearchQuery(ev.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <Select
                  value={searchScope}
                  onChange={(event) => setSearchScope(event.target.value as SearchScope)}
                  size='small'
                  variant='standard'
                  disableUnderline
                  disabled={!isFileView}
                  sx={{ margin: '0 0.5rem' }}
                >
                  <MenuItem value='global'>{t`Global`}</MenuItem>
                  <MenuItem value='current'>{t`Current`}</MenuItem>
                </Select>
              </InputAdornment>
            }
            endAdornment={
              searchQuery.length > 0 &&
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setSearchQuery('')}
                >
                  <CloseRoundedIcon fontSize='small' />
                </IconButton>
              </InputAdornment>
            }
          />
          {searchIsLoading && <LinearProgress sx={{ borderRadius: '0.5rem', height: '2px' }} />}
        </Box>

        <animated.div style={{ height: height, overflow: 'hidden' }}>
          <DialogContent sx={{ padding: '0.125rem', height: '100%', borderTop: `1px solid ${theme.palette.divider}` }}>
            <CommonList listData={filteredData} listType='files' disableFAB func={{ open }} />
          </DialogContent>
        </animated.div>

      </Dialog>
    </>
  )
}

export default Search