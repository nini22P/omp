import { CircularProgress } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Refresh = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/')
    location.reload()
  })
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </div>
  )
}

export default Refresh