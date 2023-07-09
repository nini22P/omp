import { Avatar, CardHeader, IconButton, Tooltip, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import useUser from '../hooks/useUser'
import { useTranslation } from 'react-i18next'

const Setting = () => {
  const { accounts, logout } = useUser()
  console.log(accounts)
  const { t } = useTranslation()
  return (
    <div>
      <Typography variant="subtitle1" sx={{ pl: 2.5, pt: 2 }}>
        {t('account.account')}
      </Typography>
      <CardHeader
        avatar={
          <Avatar aria-label={accounts[0].name}>
            {accounts[0].name?.split(' ')[0]}
          </Avatar>
        }
        action={
          <Tooltip title={t('account.signOut')}>
            <IconButton onClick={() => logout()}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        }
        title={accounts[0].name}
        subheader={accounts[0].username}
      />
    </div>
  )
}
export default Setting