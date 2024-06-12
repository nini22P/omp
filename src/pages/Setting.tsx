import { Avatar, Button, Checkbox, Dialog, DialogActions, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent, Tooltip, useTheme } from '@mui/material'
import useUser from '../hooks/graph/useUser'
import { t } from '@lingui/macro'
import { licenses } from '../data/licenses'
import useLocalMetaDataStore from '../store/useLocalMetaDataStore'
import useUiStore from '@/store/useUiStore'
import { UiStatus } from '@/types/ui'
import { useState } from 'react'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import useHistoryStore from '@/store/useHistoryStore'
import usePlaylistsStore from '@/store/usePlaylistsStore'
import { AccountInfo } from '@azure/msal-browser'

const ListItemTitle = ({ title }: { title: string }) => {
  const theme = useTheme()
  return (
    <ListItem>
      <ListItemText inset sx={{ color: theme.palette.primary.main }} primary={title} />
    </ListItem>
  )
}

const Setting = () => {

  const { accounts, account, login, logout } = useUser()

  const { clearLocalMetaData } = useLocalMetaDataStore()

  const [
    currentAccount,
    CoverThemeColor,
    colorMode,
    updateFolderTree,
    updateCurrentAccount,
    updateCoverThemeColor,
    updateColorMode,
  ] = useUiStore(
    state => [
      state.currentAccount,
      state.CoverThemeColor,
      state.colorMode,
      state.updateFolderTree,
      state.updateCurrentAccount,
      state.updateCoverThemeColor,
      state.updateColorMode
    ]
  )

  const resetPlayQueue = usePlayQueueStore(state => state.resetPlayQueue)
  const resetPlayer = usePlayerStore(state => state.resetPlayer)
  const updateHistoryList = useHistoryStore((state) => state.updateHistoryList)
  const updatePlaylists = usePlaylistsStore((state) => state.updatePlaylists)

  const [accountsDialogOpen, setAccountsDialogOpen] = useState(false)

  const handleCloseAccountsDialog = () => setAccountsDialogOpen(false)

  const handleChangeAccount = (index: number) => {
    updateCurrentAccount(index)
    updateFolderTree(['/'])
    updateHistoryList(null)
    updatePlaylists(null)
    resetPlayQueue()
    resetPlayer()
    handleCloseAccountsDialog()
  }

  const handleLogout = (account: AccountInfo) => {
    if (account.username === accounts[currentAccount].username) {
      resetPlayQueue()
      resetPlayer()
      updateHistoryList(null)
      updatePlaylists(null)
      updateFolderTree(['/'])
    }
    if (currentAccount === accounts.length - 1) {
      updateCurrentAccount((accounts.length - 1) <= 1 ? 0 : (accounts.length - 1))
      updateFolderTree(['/'])
    }
    logout(account)
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>

      <List>
        <ListItemTitle title={t`Account`} />
        <ListItem
          secondaryAction={
            <Button onClick={() => setAccountsDialogOpen(true)}>{t`Manage`}</Button>
          }
        >
          <ListItemAvatar>
            {account && <Avatar aria-label={account.name}>{account.name?.split(' ')[0]}</Avatar>}
          </ListItemAvatar>
          {
            account
              ? <ListItemText primary={account.name} secondary={account.username} />
              : <ListItemText primary={t`Please use Microsoft account authorization to log in`} secondary={' '} />
          }

        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t`Data`} />
        <ListItem
          secondaryAction={
            <Button onClick={() => clearLocalMetaData()}>
              {t`Clear`}
            </Button>
          }
        >
          <ListItemText inset primary={t`Local metaData cache`} secondary=' ' />
        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t`Customize`} />
        <ListItem
          secondaryAction={
            <FormControl variant="standard">
              <Select
                labelId="color-mode-select-label"
                id="color-mode-select"
                value={colorMode}
                onChange={(event: SelectChangeEvent) => updateColorMode(event.target.value as UiStatus['colorMode'])}
              >
                <MenuItem value={'auto'}> {t`Auto`} </MenuItem>
                <MenuItem value={'light'}> {t`Light`} </MenuItem>
                <MenuItem value={'dark'}> {t`Dark`} </MenuItem>
              </Select>
            </FormControl>
          }
        >
          <ListItemText inset primary={t`Color mode`} secondary=' ' />
        </ListItem>

        <ListItem
          secondaryAction={
            <FormControlLabel
              control={<Checkbox checked={CoverThemeColor} />}
              label={false}
              onChange={() => updateCoverThemeColor(!CoverThemeColor)}
            />
          }
        >
          <ListItemText inset primary={t`Use album cover theme color`} secondary=' ' />
        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t`About`} />
        <ListItem disablePadding>
          <ListItemButton onClick={() => window.open('https://github.com/nini22P/omp', '_blank')}>
            <ListItemText inset primary='OMP - OneDrive Media Player' secondary='AGPL-3.0' />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t`Open source dependencies`} />
        {
          licenses.map((license) =>
            <ListItem key={license.name} disablePadding>
              <ListItemButton onClick={() => window.open(license.link, '_blank')}>
                <ListItemText inset primary={license.name} secondary={license.licenseType} />
              </ListItemButton>
            </ListItem>
          )
        }

      </List>

      <Dialog open={accountsDialogOpen} onClose={handleCloseAccountsDialog} >
        <DialogTitle>{t`Select account`}</DialogTitle>
        <List>
          {
            accounts.map((account, index) =>
              <ListItem
                disablePadding
                secondaryAction={
                  <Tooltip title={t`Sign out`}>
                    <IconButton onClick={() => handleLogout(account)}>
                      <LogoutRoundedIcon />
                    </IconButton>
                  </Tooltip>
                }>
                <ListItemButton onClick={() => handleChangeAccount(index)}>
                  <ListItemAvatar>
                    <Avatar aria-label={account.name}>{account.name?.split(' ')[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={account.name} secondary={account.username} sx={{ paddingRight: 2 }} />
                </ListItemButton>
              </ListItem>)
          }
          <ListItem disablePadding>
            <ListItemButton onClick={() => login()}>
              <ListItemAvatar>
                <Avatar>
                  <AddRoundedIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={t`Add account`} />
            </ListItemButton>
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={handleCloseAccountsDialog}>{t`Cancel`}</Button>
        </DialogActions>
      </Dialog>

    </div>

  )
}
export default Setting