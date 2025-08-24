import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLingui } from '@lingui/react/macro'
import { Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material'
import AlbumIcon from '@mui/icons-material/Album'
import PersonIcon from '@mui/icons-material/Person'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import FolderIcon from '@mui/icons-material/Folder'
import { useLiveQuery } from 'dexie-react-hooks'
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

  const isLoadingSettings = settings === undefined

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

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
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
  )
}

export default Library