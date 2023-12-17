import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import useUser from '../hooks/graph/useUser'
import { useTranslation } from 'react-i18next'
import useTheme from '../hooks/ui/useTheme'
import { licenses } from '../data/licenses'
import { useState } from 'react'
import useLocalMetaDataStore from '../store/useLocalMetaDataStore'

const Setting = () => {
  const { accounts, logout } = useUser()
  const { t } = useTranslation()
  const { styles } = useTheme()

  const { getAllLocalMetaData, clearLocalMetaData } = useLocalMetaDataStore()

  const [localMetaDataSize, setLocalMetaDataSize] = useState<string | null>(null)
  const [localMetaDataButton, setLocalMetaDataButton] = useState<'calculate' | 'clear'>('calculate')

  const getLocalMetaDataSize = async () => {
    const allLocalMetaData = await getAllLocalMetaData()
    if (allLocalMetaData) {
      const blob = new Blob([JSON.stringify(allLocalMetaData)], { type: 'application/json' })
      return (blob.size / 1024 / 1024).toFixed(2)
    }
  }

  const handleLocalMetaDataButton = async () => {
    if (localMetaDataButton === 'calculate') {
      const size = await getLocalMetaDataSize()
      setLocalMetaDataSize(size || null)
      setLocalMetaDataButton('clear')
    }
    if (localMetaDataButton === 'clear') {
      clearLocalMetaData()
      setLocalMetaDataSize(null)
      setLocalMetaDataButton('calculate')
    }

  }

  return (
    <List>
      <ListItem>
        <ListItemAvatar></ListItemAvatar>
        <ListItemText sx={{ color: styles.color.primary }} primary={t('account.account')} />
      </ListItem>
      <ListItem
        secondaryAction={
          <Button onClick={() => logout()}>
            {t('account.signOut')}
          </Button>
        }
      >
        <ListItemAvatar>
          <Avatar aria-label={accounts[0].name}>{accounts[0].name?.split(' ')[0]}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={accounts[0].name} secondary={accounts[0].username} />
      </ListItem>

      <Divider sx={{ mt: 1, mb: 1 }} />

      <ListItem>
        <ListItemAvatar></ListItemAvatar>
        <ListItemText sx={{ color: styles.color.primary }} primary={t('data.data')} />
      </ListItem>
      <ListItem
        secondaryAction={
          <Button onClick={() => handleLocalMetaDataButton()}>
            {localMetaDataButton === 'calculate' ? t('common.calculate') : t('common.clear')}
          </Button>
        }
      >
        <ListItemAvatar></ListItemAvatar>
        <ListItemText primary={t('data.localMetaDataCache')} secondary={localMetaDataSize ? `${localMetaDataSize} MB` : ' '} />
      </ListItem>

      <Divider sx={{ mt: 1, mb: 1 }} />

      <ListItem>
        <ListItemAvatar></ListItemAvatar>
        <ListItemText sx={{ color: styles.color.primary }} primary={t('common.about')} />
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton onClick={() => window.open('https://github.com/nini22P/omp', '_blank')}>
          <ListItemAvatar></ListItemAvatar>
          <ListItemText primary='OMP - OneDrive Media Player' secondary='AGPL-3.0' />
        </ListItemButton>
      </ListItem>

      <Divider sx={{ mt: 1, mb: 1 }} />

      <ListItem>
        <ListItemAvatar></ListItemAvatar>
        <ListItemText sx={{ color: styles.color.primary }} primary={t('common.openSourceDependencies')} />
      </ListItem>

      {
        licenses.map((license) =>
          <ListItem key={license.name} disablePadding>
            <ListItemButton onClick={() => window.open(license.link, '_blank')}>
              <ListItemAvatar></ListItemAvatar>
              <ListItemText primary={license.name} secondary={license.licenseType} />
            </ListItemButton>
          </ListItem>
        )
      }

    </List>

  )
}
export default Setting