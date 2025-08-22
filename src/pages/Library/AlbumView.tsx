import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { Cover, MetaData } from '@/types/metaData'

const getCoverUrl = (cover?: Cover[]): string => {
  if (cover && cover.length > 0) {
    const blob = new Blob([cover[0].data as unknown as ArrayBuffer], { type: cover[0].format })
    return URL.createObjectURL(blob)
  }
  return './cover.svg'
}


const AlbumView = () => {
  const { account } = useUser()
  const db = useDb(account)

  const albums = useLiveQuery(async () => {
    if (!db) return []

    const allSongs = await db.metadata.orderBy('album').toArray()
    if (!allSongs) return []

    const albumMap = new Map<string, MetaData>()
    for (const song of allSongs) {
      if (song.album && !albumMap.has(song.album)) {
        albumMap.set(song.album, song)
      }
    }

    return Array.from(albumMap.values())
  }, [db])

  return (
    <Grid container spacing={2} padding={2}>
      {albums?.map(albumInfo => (
        <Grid key={albumInfo.album} size={{ xs: 6, sm: 3, md: 3, lg: 2 }}>
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