import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLingui } from '@lingui/react/macro'
import { Box, CircularProgress, Grid, Tab, Tabs, Typography, useMediaQuery, useTheme } from '@mui/material'
import AlbumIcon from '@mui/icons-material/Album'
import PersonIcon from '@mui/icons-material/Person'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FolderIcon from '@mui/icons-material/Folder'
import { useLiveQuery } from 'dexie-react-hooks'
import Loading from '../Loading'
import { useMemo } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import useFileNodeSyncStore from '@/store/useFileNodeSyncStore'
import useMetadataSyncStore from '@/store/useMetadataSyncStore'
import SetLibraryFolderDialog from '@/components/Dialog/SetLibraryFolderDialog'

const Library = () => {
  const { t } = useLingui()
  const theme = useTheme()
  const { account } = useUser()
  const db = useDb(account)
  const location = useLocation()

  const settings = useLiveQuery(() => db?.settings.get('settings'), [db])
  const libraryRootId = useMemo(() => settings?.libraryRootId, [settings])

  const status = useFileNodeSyncStore.use.status()
  const error = useFileNodeSyncStore.use.error()
  const metadataStatus = useMetadataSyncStore.use.status()

  const isLoadingSettings = settings === undefined

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const iconPosition = useMemo(() => isMobile ? 'top' : 'start', [isMobile])

  const tabStyle = useMemo(() => ({
    minHeight: '48px',
    padding: '6px 12px',
  }), [])

  if (!account || !db) {
    return <Loading />
  }

  if (isLoadingSettings) {
    return <Loading />
  }

  return (
    libraryRootId
      ?
      status === 'success'
        ?
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
            <Tabs
              value={`/library/${location.pathname.split('/')[2] ?? 'albums'}`}
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              <Tab
                icon={<AlbumIcon />}
                iconPosition={iconPosition}
                label={t`Album`}
                sx={tabStyle}
                component={Link}
                to="albums"
                value="/library/albums"
              />
              <Tab
                icon={<PersonIcon />}
                iconPosition={iconPosition}
                label={t`Artist`}
                sx={tabStyle}
                component={Link}
                to="artists"
                value="/library/artists"
              />
              <Tab
                icon={<MusicNoteIcon />}
                iconPosition={iconPosition}
                label={t`Song`}
                sx={tabStyle}
                component={Link}
                to="songs"
                value="/library/songs"
              />
              <Tab
                icon={<FolderIcon />}
                iconPosition={iconPosition}
                label={t`Folder`}
                sx={tabStyle}
                component={Link}
                to="folders"
                value="/library/folders"
              />
            </Tabs>
            <Box sx={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
              {metadataStatus === 'fetching' && <CircularProgress size={20} />}
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            <Outlet />
          </Box>
        </Box>
        :
        <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
          {status === 'syncing' && <CircularProgress />}
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
            error && <Typography variant='body1' color='error' padding={4}>{error}</Typography>
          }
        </Grid>
      :
      <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
        <Typography variant='h6'>{t`Library folder not set`}</Typography>
        <SetLibraryFolderDialog />
      </Grid>
  )
}

export default Library
