import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import useUser from '../hooks/useUser'
import { useTranslation } from 'react-i18next'
import useTheme from '../hooks/useTheme'
import { licenses } from '../data/licenses'
import useMetaDataListStore from '../store/useMetaDataListStore'

const Setting = () => {
  const { accounts, logout } = useUser()
  const { t } = useTranslation()
  const { styles } = useTheme()

  const [metaDataList, clearMetaDataList] = useMetaDataListStore((state) => [state.metaDataList, state.clearMetaDataList])

  const size = metaDataList.length ? (Buffer.byteLength(JSON.stringify(metaDataList)) / 1024 / 1024).toFixed(2) : null

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
          <Button onClick={() => clearMetaDataList()}>
            {t('common.clear')}
          </Button>
        }
      >
        <ListItemAvatar></ListItemAvatar>
        <ListItemText primary={t('data.localMetaDataCache')} secondary={size ? `${size} MB` : null} />
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