import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, useTheme } from '@mui/material'
import useUser from '../hooks/graph/useUser'
import { useTranslation } from 'react-i18next'
import { licenses } from '../data/licenses'
import { useState } from 'react'
import useLocalMetaDataStore from '../store/useLocalMetaDataStore'

const ListItemTitle = ({ title }: { title: string }) => {
  const theme = useTheme()
  return (
    <ListItem>
      <ListItemText inset sx={{ color: theme.palette.primary.main }} primary={title} />
    </ListItem>
  )
}

const Setting = () => {
  const { accounts, logout } = useUser()
  const account = accounts[0]
  const { t } = useTranslation()

  const { clearLocalMetaData } = useLocalMetaDataStore()

  const [localMetaDataSize, setLocalMetaDataSize] = useState<string | null>(null)
  const [localMetaDataButton, setLocalMetaDataButton] = useState<'calculate' | 'clear'>('calculate')

  const handleClickClearLocalMetaData = () => {
    if (localMetaDataButton === 'clear') {
      clearLocalMetaData()
      setLocalMetaDataSize(null)
      setLocalMetaDataButton('calculate')
    }
  }

  return (
    <List>
      <ListItemTitle title={t('account.account')} />
      <ListItem
        secondaryAction={
          <Button onClick={() => logout()}>
            {t('account.signOut')}
          </Button>
        }
      >
        <ListItemAvatar>
          <Avatar aria-label={account.name && account.name}>{account.name && account.name.split(' ')[0]}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={account.username} secondary={account.username} />
      </ListItem>

      <Divider sx={{ m: 1 }} />

      <ListItemTitle title={t('data.data')} />
      <ListItem
        secondaryAction={
          <Button onClick={() => handleClickClearLocalMetaData()}>
            {t('common.clear')}
          </Button>
        }
      >
        <ListItemText inset primary={t('data.localMetaDataCache')} secondary={localMetaDataSize ? `${localMetaDataSize} MB` : ' '} />
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

  )
}
export default Setting