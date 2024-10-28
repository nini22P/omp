import useUiStore from '@/store/useUiStore'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import SyncAltRoundedIcon from '@mui/icons-material/SyncAltRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded'
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import PlaylistAddRoundedIcon from '@mui/icons-material/PlaylistAddRounded'
import ListRoundedIcon from '@mui/icons-material/ListRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import PlaylistPlayRoundedIcon from '@mui/icons-material/PlaylistPlayRounded'
import CloseFullscreenRoundedIcon from '@mui/icons-material/CloseFullscreenRounded'
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded'
import CloudDownloadRoundedIcon from '@mui/icons-material/CloudDownloadRounded'
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { useMemo, useState } from 'react'
import { t } from '@lingui/macro'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import { useNavigate } from 'react-router-dom'
import usePlaylistsStore from '@/store/usePlaylistsStore'
import shortUUID from 'short-uuid'
import useFullscreen from '@/hooks/ui/useFullscreen'
import { useShallow } from 'zustand/shallow'
import usePlayerStore from '@/store/usePlayerStore'
import useLocalMetaDataStore from '@/store/useLocalMetaDataStore'
import { getNetMetaData } from '@/utils'

const PlayerMenu = ({ player }: { player: HTMLVideoElement | null }) => {

  const navigate = useNavigate()

  const [
    currentMetaData,
    updateMetadataUpdate,
  ] = usePlayerStore(
    useShallow(
      (state) => [
        state.currentMetaData,
        state.updateMetadataUpdate,
      ]
    )
  )

  const { setLocalMetaData } = useLocalMetaDataStore()

  const [
    playQueue,
    currentIndex,
  ] = usePlayQueueStore(
    useShallow(
      (state) => [
        state.playQueue,
        state.currentIndex,
      ]
    )
  )

  const currentFile = useMemo(() => playQueue?.find((item) => item.index === currentIndex), [currentIndex, playQueue])

  const [
    audioViewTheme,
    playbackRate,
    audioViewIsShow,
    fullscreen,
    updateFolderTree,
    updateAudioViewTheme,
    updatePlaybackRate,
    updateAudioViewIsShow,
    updateVideoViewIsShow,
    updatePlayQueueIsShow,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.audioViewTheme,
        state.playbackRate,
        state.audioViewIsShow,
        state.fullscreen,
        state.updateFolderTree,
        state.updateAudioViewTheme,
        state.updatePlaybackRate,
        state.updateAudioViewIsShow,
        state.updateVideoViewIsShow,
        state.updatePlayQueueIsShow,
      ]
    )
  )

  const [
    playlists,
    insertPlaylist,
    insertFilesToPlaylist,
  ] = usePlaylistsStore(
    useShallow(
      (state) => [
        state.playlists,
        state.insertPlaylist,
        state.insertFilesToPlaylist,
      ]
    )
  )

  const { handleClickFullscreen } = useFullscreen()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuStatus, setMenuStatus] = useState<null | 'playbackRate' | 'audioViewTheme'>(null)
  const [addToPlaylistDialogOpen, setAddToPlaylistDialogOpen] = useState(false)

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setMenuOpen(true)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setMenuOpen(false)
    setMenuStatus(null)
  }

  const handleClickOpenPlayQueue = () => {
    setMenuOpen(false)
    updatePlayQueueIsShow(true)
  }

  // 打开所在文件夹
  const handleClickOpenInFolder = () => {
    if (currentFile) {
      updateFolderTree(currentFile.filePath.slice(0, -1))
      navigate('/')
      setMenuOpen(false)
      updateAudioViewIsShow(false)
      updateVideoViewIsShow(false)
    }
  }

  // 新建播放列表
  const addNewPlaylist = () => {
    const id = shortUUID().generate()
    insertPlaylist({ id, title: t`New playlist`, fileList: [] })
  }

  // 添加到播放列表
  const addToPlaylist = (id: string) => {
    if (currentFile) {
      insertFilesToPlaylist(id, [{
        fileName: currentFile.fileName,
        filePath: currentFile.filePath,
        fileSize: currentFile.fileSize,
        fileType: currentFile.fileType,
      }])
      setAddToPlaylistDialogOpen(false)
    }
  }

  const handleClickSwitchFullscreen = () => {
    setMenuOpen(false)
    handleClickFullscreen()
  }

  const reFetchMetadata = async () => {
    handleCloseMenu()
    if (!currentMetaData?.path || !player?.src) return
    const netMetaData = await getNetMetaData(currentMetaData?.path, player?.src)
    if (netMetaData) {
      setLocalMetaData(netMetaData).then(() => updateMetadataUpdate())
    }
  }

  return (
    <>
      <Box>
        <IconButton onClick={(event) => handleClickMenu(event)}>
          <MoreVertRoundedIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: audioViewIsShow ? 'bottom' : 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: audioViewIsShow ? 'top' : 'bottom',
            horizontal: 'center',
          }}
        >
          {
            // 菜单
            (!menuStatus) &&
            <div>
              {
                audioViewIsShow &&
                <MenuItem onClick={() => setMenuStatus('audioViewTheme')}>
                  <ListItemIcon>
                    <SyncAltRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t`Switch theme`} />
                  <NavigateNextRoundedIcon />
                </MenuItem>}

              <MenuItem onClick={() => setMenuStatus('playbackRate')}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <ListItemIcon>
                    <SpeedRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t`Playback rate`} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
                  {playbackRate.toFixed(2)} <NavigateNextRoundedIcon />
                </Box>
              </MenuItem>

              {
                currentFile &&
                <MenuItem onClick={handleClickOpenInFolder}>
                  <ListItemIcon>
                    <FolderOpenRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t`Open in folder`} />
                </MenuItem>
              }

              <MenuItem onClick={handleClickOpenPlayQueue}>
                <ListItemIcon>
                  <PlaylistPlayRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={t`Play queue`} />
              </MenuItem>

              {
                currentFile &&
                <MenuItem onClick={() => {
                  setAddToPlaylistDialogOpen(true)
                  handleCloseMenu()
                }}>
                  <ListItemIcon>
                    <PlaylistAddRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary={t`Add to playlist`} />
                </MenuItem>
              }

              <MenuItem onClick={handleClickSwitchFullscreen} >
                <ListItemIcon>
                  {fullscreen ? <CloseFullscreenRoundedIcon /> : <OpenInFullRoundedIcon />}
                </ListItemIcon>
                <ListItemText primary={t`Switch fullscreen`} />
              </MenuItem>

              <MenuItem onClick={() => reFetchMetadata()}>
                <ListItemIcon>
                  <CloudDownloadRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={t`Re-fetch metadata`} />
              </MenuItem>
            </div>
          }

          {
            // 主题
            (menuStatus === 'audioViewTheme') &&
            <div>
              <MenuItem onClick={() => setMenuStatus(null)}>
                <ListItemIcon>
                  <NavigateBeforeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={t`Switch theme`} />
              </MenuItem>

              <MenuItem
                onClick={() => {
                  updateAudioViewTheme('modern')
                  setMenuStatus(null)
                }}
              >
                <ListItemIcon>
                  <CheckRoundedIcon sx={{ visibility: audioViewTheme === 'modern' ? 'visible' : 'hidden' }} />
                </ListItemIcon>
                {t`Modern`}
              </MenuItem>

              <MenuItem
                onClick={() => {
                  updateAudioViewTheme('classic')
                  setMenuStatus(null)
                }}
              >
                <ListItemIcon>
                  <CheckRoundedIcon sx={{ visibility: audioViewTheme === 'classic' ? 'visible' : 'hidden' }} />
                </ListItemIcon>
                {t`Classic`}
              </MenuItem>
            </div>
          }

          {
            // 播放速度
            (menuStatus === 'playbackRate') &&
            <div>
              <MenuItem onClick={() => setMenuStatus(null)}>
                <ListItemIcon>
                  <NavigateBeforeRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={t`Playback rate`} />
              </MenuItem>
              {
                [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4].map((speed) => (
                  <MenuItem
                    key={speed}
                    onClick={() => {
                      updatePlaybackRate(speed)
                      setMenuStatus(null)
                    }}
                  >
                    <ListItemIcon>
                      <CheckRoundedIcon sx={{ visibility: speed === playbackRate ? 'visible' : 'hidden' }} />
                    </ListItemIcon>
                    {speed.toFixed(2)}
                  </MenuItem>
                ))
              }
            </div>
          }

        </Menu>
      </Box>

      <Dialog
        open={addToPlaylistDialogOpen}
        onClose={() => setAddToPlaylistDialogOpen(false)}
        fullWidth
        maxWidth='xs'
      >
        <DialogTitle>{t`Add to playlist`}</DialogTitle>
        <List>
          {playlists?.map((item, index) =>
            <ListItem
              disablePadding
              key={index}
            >
              <ListItemButton
                sx={{ pl: 3 }}
                onClick={() => addToPlaylist(item.id)}
              >
                <ListItemIcon>
                  <ListRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          )}
          <ListItem disablePadding>
            <ListItemButton
              sx={{ pl: 3 }}
              onClick={addNewPlaylist}
            >
              <ListItemIcon>
                <PlaylistAddRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={t`Add playlist`} />
            </ListItemButton>
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={() => setAddToPlaylistDialogOpen(false)}>{t`Cancel`}</Button>
        </DialogActions>
      </Dialog>
    </>

  )
}

export default PlayerMenu