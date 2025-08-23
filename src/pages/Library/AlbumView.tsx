import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { MetaData } from '@/types/metaData'
import { getCoverUrl } from '@/utils'
import { useLingui } from '@lingui/react/macro'

const AlbumView = () => {
  const { account } = useUser()
  const db = useDb(account)
  const { t } = useLingui()

  const albums = useLiveQuery(async () => {
    if (!db) return []

    const allSongs = await db.metadata.orderBy('album').toArray()
    if (!allSongs) return []

    const albumMap = new Map<string, MetaData>()

    for (const song of allSongs) {
      if (song.album) {
        const albumArtist = song.albumArtist || song.artist || t`Unknown Artist`
        const compositeKey = `${song.album}::${albumArtist}`

        const existingAlbumInfo = albumMap.get(compositeKey)

        if (!existingAlbumInfo) {
          const albumInfo: MetaData = {
            ...song,
            artist: albumArtist,
          }
          albumMap.set(compositeKey, albumInfo)
        }
        else if (!existingAlbumInfo.cover && song.cover) {
          const betterAlbumInfo: MetaData = {
            ...song,
            artist: albumArtist,
          }
          albumMap.set(compositeKey, betterAlbumInfo)
        }

      }
    }

    return Array.from(albumMap.values())
  }, [db, t])

  return (
    <Grid container spacing={2} padding={2}>
      {albums?.map(albumInfo => (
        <Grid key={`${albumInfo.album}::${albumInfo.artist}`} size={{ xs: 6, sm: 3, md: 3, lg: 2 }}>
          <Card sx={{ width: '100%' }}>
            <CardActionArea onClick={() => console.log(albumInfo)}>
              <CardMedia
                component='img'
                sx={{ aspectRatio: '1/1' }}
                image={getCoverUrl(albumInfo.cover)}
                alt={albumInfo.album}
              />
              <Typography
                variant="caption"
                sx={{
                  padding: 1,
                  display: 'block',
                  textAlign: 'center',
                  textWrap: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {albumInfo.album}
              </Typography>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default AlbumView