import { Button, Container, IconButton, Link, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'
import { t } from '@lingui/macro'
import useUser from '../hooks/graph/useUser'

const LogIn = () => {
  const { login } = useUser()
  return (
    <Container
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        textAlign: 'center',
      }}>
      <IconButton component={Link} href='https://github.com/nini22P/omp'>
        <GitHubIcon />
      </IconButton>
      <div>
        <Typography variant="h5" pb={2} >
          {t`Please use Microsoft account authorization to log in`}
        </Typography>
        <Button size="large" onClick={() => login()}>{t`Sign in`}</Button>
      </div>
      <footer>
        Made with ❤ from <Link underline='none' href='https://github.com/nini22P'>22</Link>
      </footer>
    </Container>
  )
}

export default LogIn 