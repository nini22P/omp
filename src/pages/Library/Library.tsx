import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { useLingui } from '@lingui/react/macro'
import { CircularProgress, Grid, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import SetLibraryFolderDialog from './SetLibraryFolderDialog'
import useFileNodeSyncStore from '@/store/useFileNodeSyncStore'
import Loading from '../Loading'
import { useMemo } from 'react'

const Library = () => {
  const { t } = useLingui()
  const { account } = useUser()
  const db = useDb(account)

  const settings = useLiveQuery(() => db?.settings.get('settings'), [db])
  const libraryRootId = useMemo(() => settings?.libraryRootId, [settings])

  const totalNodes = useLiveQuery(async () => await db?.nodes.count(), [db])
  const audioNodes = useLiveQuery(async () => await db?.nodes.where('type').equals('audio').count(), [db])

  const isLoadingSettings = settings === undefined

  const status = useFileNodeSyncStore.use.status()
  const error = useFileNodeSyncStore.use.error()

  if (!account || !db) {
    return <Loading />
  }

  if (isLoadingSettings) {
    return <Loading />
  }

  return libraryRootId
    ?
    status === 'success'
      ?
      <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
        <Typography variant='h6'>{t`Library`}</Typography>
        <Typography variant='body1'>{`Total nodes: ${totalNodes}`}</Typography>
        <Typography variant='body1'>{`Audio nodes: ${audioNodes}`}</Typography>
      </Grid>
      :
      <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
        <CircularProgress />
        <Typography variant='body1'>
          {
            (() => {
              switch (status) {
                case 'idle': return t`Idle`
                case 'syncing': return t`Syncing`
                case 'error': return t`Error`
              }
            })()
          }
        </Typography>
        {
          error && <Typography variant='body1'>{error}</Typography>
        }
      </Grid>
    :
    <Grid container direction='column' justifyContent='center' alignItems='center' style={{ height: '100%' }} gap={2}>
      <Typography variant='h6'>{t`Library folder not set`}</Typography>
      <SetLibraryFolderDialog />
    </Grid>
}

export default Library