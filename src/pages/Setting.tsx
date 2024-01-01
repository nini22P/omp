import { Avatar, Button, Checkbox, Divider, FormControl, FormControlLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Select, SelectChangeEvent, useTheme } from '@mui/material'
import useUser from '../hooks/graph/useUser'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

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
        <ListItemTitle title={t('account.account')} />
        <ListItem
          secondaryAction={
            account
              ? <Button onClick={() => logout()}>{t('account.signOut')}</Button>
              : <Button onClick={() => login()}>{t('account.signIn')}</Button>
          }
        >
          <ListItemAvatar>
            {account && <Avatar aria-label={account.name}>{account.name?.split(' ')[0]}</Avatar>}
          </ListItemAvatar>
          {
            account
              ? <ListItemText primary={account.name} secondary={account.username} />
              : <ListItemText primary={t('account.signInAlert')} secondary={' '} />
          }

        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t('data.data')} />
        <ListItem
          secondaryAction={
            <Button onClick={() => clearLocalMetaData()}>
              {t('common.clear')}
            </Button>
          }
        >
          <ListItemText inset primary={t('data.localMetaDataCache')} secondary=' ' />
        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t('customize.customize')} />
        <ListItem
          secondaryAction={
            <FormControl variant="standard">
              <Select
                labelId="color-mode-select-label"
                id="color-mode-select"
                value={colorMode}
                onChange={(event: SelectChangeEvent) => updateColorMode(event.target.value as UiStatus['colorMode'])}
              >
                <MenuItem value={'auto'}> {t('customize.auto')} </MenuItem>
                <MenuItem value={'light'}> {t('customize.light')} </MenuItem>
                <MenuItem value={'dark'}> {t('customize.dark')} </MenuItem>
              </Select>
            </FormControl>
          }
        >
          <ListItemText inset primary={t('customize.colorMode')} secondary=' ' />
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
          <ListItemText inset primary={t('customize.CoverThemeColor')} secondary=' ' />
        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t('common.about')} />
        <ListItem disablePadding>
          <ListItemButton onClick={() => window.open('https://github.com/nini22P/omp', '_blank')}>
            <ListItemText inset primary='OMP - OneDrive Media Player' secondary='AGPL-3.0' />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ m: 1 }} />

        <ListItemTitle title={t('common.openSourceDependencies')} />
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