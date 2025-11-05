import useUser from '@/hooks/graph/useUser'
import useDb from '@/hooks/useDb'
import { Box, Card, CardActionArea, CardMedia, Grid, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useLiveQuery } from 'dexie-react-hooks'
import { MetaData } from '@/types/metaData'
import { CSSProperties, useMemo } from 'react'
import useCreateImageUrl from '@/hooks/useCreateImageUrl'
import { AutoSizer } from 'react-virtualized'
import { FixedSizeList } from 'react-window'
import { useNavigate } from 'react-router-dom'
import { LibraryDB } from '@/db'

const CARD_PADDING = 0.5
const SEPARATOR = '\u001f'

const AlbumView = () => {
  const { account } = useUser()
  const db = useDb(account)

  const theme = useTheme()
  const xs = useMediaQuery(theme.breakpoints.up('xs'))
  const sm = useMediaQuery(theme.breakpoints.up('sm'))
  const md = useMediaQuery(theme.breakpoints.up('md'))
  const lg = useMediaQuery(theme.breakpoints.up('lg'))
  const xl = useMediaQuery(theme.breakpoints.up('xl'))

  const gridCols = useMemo((): number => {
    if (xl) return 7
    if (lg) return 6
    if (md) return 4
    if (sm) return 3
    if (xs) return 2
    return 2
  }, [lg, md, sm, xl, xs])

  const albums = useLiveQuery(async () => {
    if (!db) return []

    const fileNodes = await db.nodes.where('type').equals('audio').toArray()
    const fileNodeIds = fileNodes.map(node => node.id)

    if (fileNodeIds.length === 0) {
      return []
    }

    const allSongs = await db.metadata.where('id').anyOf(fileNodeIds).toArray()

    if (!allSongs) return []

    const albumMap = new Map<string, MetaData>()

    for (const song of allSongs) {
      if (song.common.album) {
        const albumartists = song.common.albumartists
        const artistsKey = albumartists ? albumartists.join(SEPARATOR) : ''
        const compositeKey = `${artistsKey}::${song.common.album}`

        const existingAlbumInfo = albumMap.get(compositeKey)

        if (!existingAlbumInfo) {
          const albumInfo: MetaData = song
          albumMap.set(compositeKey, albumInfo)
        }
        else if (!existingAlbumInfo.common.picture && song.common.picture) {
          const betterAlbumInfo: MetaData = song
          albumMap.set(compositeKey, betterAlbumInfo)
        }
      }
    }

    return Array.from(albumMap.values())
  }, [db])

  if (!albums || !db)
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
              <Row key={index} index={index} style={style} db={db} albums={albums} gridCols={gridCols} />
            )}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Box>
  )
}

const AlbumCard = ({ db, item }: { db: LibraryDB, item: MetaData }) => {
  const navigate = useNavigate()
  const coverUrl = useCreateImageUrl(db, item)

  const handleClick = () => {
    if (item.common.album) {
      const artistsParam = item.common.albumartists?.join(SEPARATOR) || '_NO_ARTIST_'
      navigate(`/library/albums/${encodeURIComponent(artistsParam)}/${encodeURIComponent(item.common.album)}`)
    }
  }

  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <CardActionArea sx={{ height: '100%' }} onClick={handleClick}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <CardMedia
            component='img'
            sx={{ aspectRatio: '1/1' }}
            image={coverUrl}
            alt={item?.common.album}
          />
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            flexShrink: 1,
            height: '100%',
            px: 1,
          }}
          >
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                textWrap: 'nowrap',
                fontSize: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.common.album}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                textWrap: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                fontSize: '90%',
                color: 'text.secondary',
              }}
            >
              {item.common.albumartists?.join('; ') || ''}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  )
}

const Row = ({
  index,
  style,
  db,
  albums,
  gridCols,
}: {
  index: number,
  style: CSSProperties,
  db: LibraryDB,
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
              key={`${item.common.album}::${item.common.artist}`}
              size={12 / gridCols}
              sx={{ padding: CARD_PADDING, height: '100%' }}
            >
              <AlbumCard db={db} item={item} />
            </Grid>
          )
        })
      }
    </Grid>
  )
}

export default AlbumView