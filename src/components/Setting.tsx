import { Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import useUser from '../hooks/useUser'
import { useTranslation } from 'react-i18next'
import useTheme from '../hooks/useTheme'

const Setting = () => {
  const { accounts, logout } = useUser()
  const { t } = useTranslation()
  const { styles } = useTheme()

  return (
    <List>
      {/* 账号 */}
      <ListItem>
        <ListItemAvatar>
        </ListItemAvatar>
        <ListItemText sx={{ color: styles.color.primary }}>
          {t('account.account')}
        </ListItemText>
      </ListItem>

      <ListItem
        secondaryAction={
          <Button onClick={() => logout()}>
            {t('account.signOut')}
          </Button>
        }
      >
        <ListItemAvatar>
          <Avatar aria-label={accounts[0].name}>
            {accounts[0].name?.split(' ')[0]}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={accounts[0].name}
          secondary={accounts[0].username}
        />
      </ListItem>

      <Divider sx={{ mt: 1, mb: 1 }} />

    </List>

  )
}
export default Setting