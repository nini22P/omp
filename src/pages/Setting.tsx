import { Avatar, Button, Checkbox, Divider, FormControl, FormControlLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material'
import useUser from '../hooks/graph/useUser'
import { t } from '@lingui/macro'
import { licenses } from '../data/licenses'
import useLocalMetaDataStore from '../store/useLocalMetaDataStore'
import useUiStore from '@/store/useUiStore'
import { UiStatus } from '@/types/ui'

const ListItemTitle = ({ title }: { title: string }) => {
  const theme = useTheme()
  return (
    <ListItem>
      <ListItemText inset sx={{ color: theme.palette.primary.main }} primary={title} />
    </ListItem>
  )
}

const Setting = () => {
  const { account, login, logout } = useUser()

  const { clearLocalMetaData } = useLocalMetaDataStore()

  const [
    CoverThemeColor,
    colorMode,
    updateCoverThemeColor,
    updateColorMode,
  ] = useUiStore(
    state => [
      state.CoverThemeColor,
      state.colorMode,
      state.updateCoverThemeColor,
      state.updateColorMode
    ]
  )

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>

      <List>
        <ListItemTitle title={t`Account`} />
        <ListItem
          secondaryAction={
            account
              ? <Button onClick={() => logout()}>{t`Sign out`}</Button>
              : <Button onClick={() => login()}>{t`Sign in`}</Button>
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


    </div>

  )
}
export default Setting