import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLingui } from '@lingui/react/macro'
import { Box, CircularProgress, Grid, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material'
import AlbumIcon from '@mui/icons-material/Album'
import PersonIcon from '@mui/icons-material/Person'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FolderIcon from '@mui/icons-material/Folder'
import { useLiveQuery } from 'dexie-react-hooks'
import SetLibraryFolderDialog from '../../components/Dialog/SetLibraryFolderDialog'
import useFileNodeSyncStore from '@/store/useFileNodeSyncStore'
import Loading from '../Loading'
import AlbumView from './AlbumView'
import ArtistView from './ArtistView'
import SongView from './SongView'
import FolderView from './FolderView'
import { useMemo, useState } from 'react'

const Library = () => {
  const { t } = useLingui()
  const theme = useTheme()
  const { account } = useUser()
  const db = useDb(account)

  const settings = useLiveQuery(() => db?.settings.get('settings'), [db])
  const libraryRootId = useMemo(() => settings?.libraryRootId, [settings])

  const isLoadingSettings = settings === undefined

  const status = useFileNodeSyncStore.use.status()
  const error = useFileNodeSyncStore.use.error()

  const [currentTab, setCurrentTab] = useState(0)

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const iconPosition = useMemo(() => isMobile ? 'top' : 'start', [isMobile])

  const tabStyle = useMemo(() => ({
    minHeight: '48px',
    padding: '6px 12px',
  }), [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  if (!account || !db) {
    return <Loading />
  }

  if (isLoadingSettings) {
    return <Loading />
  }

  return libraryRootId
    ?
    status === 'success'
      ?
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<AlbumIcon />}
              iconPosition={iconPosition}
              label={t`Album`}
              sx={tabStyle}
            />
            <Tab
              icon={<PersonIcon />}
              iconPosition={iconPosition}
              label={t`Artist`}
              sx={tabStyle}
            />
            <Tab
              icon={<MusicNoteIcon />}
              iconPosition={iconPosition}
              label={t`Song`}
              sx={tabStyle}
            />
            <Tab
              icon={<FolderIcon />}
              iconPosition={iconPosition}
              label={t`Folder`}
              sx={tabStyle}
            />
          </Tabs>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {currentTab === 0 && <AlbumView />}
          {currentTab === 1 && <ArtistView />}
          {currentTab === 2 && <SongView />}
          {currentTab === 3 && <FolderView />}
        </Box>
      </Box>
      :
      <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
        <CircularProgress />
        <Typography variant='body1'>
          {
            (() => {
              switch (status) {
                case 'idle': return t`Idle`
                case 'syncing': return t`Syncing`
                case 'error': return t`Error`
              }
            })()
          }
        </Typography>
        {
          error && <Typography variant='body1'>{error}</Typography>
        }
      </Grid>
    :
    <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
      <Typography variant='h6'>{t`Library folder not set`}</Typography>
      <SetLibraryFolderDialog />
    </Grid>
}

export default Library