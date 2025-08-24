import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Box, Card, CardActionArea, CardMedia, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { MetaData } from '@/types/metaData'
import { useLingui } from '@lingui/react/macro'
import { CSSProperties, useMemo } from 'react'
import useCreateCoverUrl from '@/hooks/useCreateCoverUrl'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'

const CARD_PADDING = 0.5

const AlbumView = () => {
  const { account } = useUser()
  const db = useDb(account)
  const { t } = useLingui()

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('xs'))
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))

  const gridCols = useMemo((): number => {
    if (xl) return 6
    if (lg) return 5
    if (md) return 4
    if (sm) return 3
    if (xs) return 2
    return 2
  }, [lg, md, sm, xl, xs])

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

  if (!albums)
    return <div />

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', padding: CARD_PADDING }}>
      <AutoSizer>
        {({ height, width }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemCount={Math.ceil(albums.length / gridCols)}
            itemSize={width / gridCols / 4 * 5}
          >
            {({ index, style }) => (
              <Row key={index} index={index} style={style} albums={albums} gridCols={gridCols} />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Box>
  )
}

const AlbumCard = ({ item }: { item: MetaData }) => {
  const coverUrl = useCreateCoverUrl(item)
  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }} onClick={() => console.log(item)}>
        <CardMedia
          component='img'
          sx={{ aspectRatio: '1/1' }}
          image={coverUrl}
          alt={item?.album}
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
          }}
        >
          {item.album}
        </Typography>
      </CardActionArea>
    </Card>
  )
}

const Row = ({
  index,
  style,
  albums,
  gridCols,
}: {
  index: number,
  style: CSSProperties,
  albums: MetaData[],
  gridCols: number,
}) => {
  return (
    <Grid container style={style}>
      {
        [...Array(gridCols)].map((_, i) => {
          const itemIndex = index * gridCols + i
          const item = albums[itemIndex]
          return (
            item
            &&
            <Grid
              key={`${item.album}::${item.artist}`}
              size={12 / gridCols}
              sx={{ padding: CARD_PADDING }}
            >
              <AlbumCard item={item} />
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default AlbumView