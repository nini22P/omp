import { Button, Container, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import useUser from '../hooks/graph/useUser'

const SignIn = () => {
  const { t } = useTranslation()
  const { login } = useUser()

  return (
    <Container
      style={{
        height: 'calc(100dvh)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        textAlign: 'center',
      }}>
      <div>{/* Don't delete this */}</div>
      <div>
        <Typography variant="h5" pb={2} >
          {t('account.signInAlert')}
        </Typography>
        <Button size="large" onClick={() => login()}>{t('account.signIn')}</Button>
      </div>
      <footer>
        Made with ❤ from <Link underline='none' href='https://github.com/nini22P'>22</Link>
      </footer>
    </Container>
  )
}

export default SignIn 