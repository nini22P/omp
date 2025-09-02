import { IconButton, ListItemButton, useTheme } from '@mui/material'
import { FileNode, Track } from '@/types/file'
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded'
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded'
import MovieRoundedIcon from '@mui/icons-material/MovieRounded'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import Grid from '@mui/material/Grid'
import { checkFileType, sizeConv } from '@/utils'
import { useLingui } from '@lingui/react/macro'
import useUiStore from '@/store/useUiStore'
import { useMemo } from 'react'

const CommonListItemCard = ({
  item,
  index,
  active,
  selected,
  isSelectMode,
  handleClickItem,
  handleClickMenu,
}: {
  item: FileNode | Track,
  index: number,
  active?: boolean,
  selected?: boolean,
  isSelectMode?: boolean,
  handleClickItem: (index: number) => void,
  handleClickMenu: (event: React.MouseEvent<HTMLElement>, index: number) => void,
}) => {
  const { t } = useLingui()

  const theme = useTheme()

  const hdThumbnails = useUiStore(state => state.hdThumbnails)

  const thumbnail = useMemo(() =>
    'thumbnails' in item && item.thumbnails && item.thumbnails[0]
      ? hdThumbnails
        ? item.thumbnails[0].large
        : item.thumbnails[0].medium
      : null,
    [item, hdThumbnails]
  )

  const type = useMemo(() => checkFileType(item.name), [item])

  return (
    <ListItemButton
      className={active ? 'active' : ''}
      sx={{
        width: '100%',
        height: '100%',
        padding: '0.5rem',
        outline: selected ? `3px solid ${theme.palette.primary.main}55` : '',
        outlineOffset: '-5px'
      }}
      onClick={() => handleClickItem(index)}
    >
      <Grid container sx={{ flexDirection: 'column', flexWrap: 'nowrap', width: '100%', height: '100%', gap: '0.25rem' }}>
        <Grid size={12} sx={{ overflow: 'hidden', width: '100%', flexGrow: 1, borderRadius: '0.5rem', position: 'relative', border: `2px solid ${theme.palette.divider}` }}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
            {'folder' in item && item.folder === 1 && <FolderOpenRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {!('folder' in item) && type === 'audio' && <MusicNoteRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {!('folder' in item) && type === 'video' && <MovieRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {!('folder' in item) && type === 'picture' && <InsertPhotoRoundedIcon sx={{ width: '50%', height: '50%' }} />}
            {!('folder' in item) && type === 'other' && <InsertDriveFileRoundedIcon sx={{ width: '50%', height: '50%' }} />}
          </Grid>
          {
            thumbnail?.url
            &&
            <img
              src={thumbnail.url}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null
                currentTarget.style.display = 'none'
              }}
              alt={item.name}
              style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, width: '100%', height: '100%', objectFit: 'cover', }}
            />
          }
        </Grid>
        <Grid container size={12} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', width: '24px', height: '24px' }} >
            {'folder' in item && item.folder === 1 && <FolderOpenRoundedIcon />}
            {!('folder' in item) && type === 'audio' && <MusicNoteRoundedIcon />}
            {!('folder' in item) && type === 'video' && <MovieRoundedIcon />}
            {!('folder' in item) && type === 'picture' && <InsertPhotoRoundedIcon />}
            {!('folder' in item) && type === 'other' && <InsertDriveFileRoundedIcon />}
          </Grid>
          <Grid container size='grow' sx={{ justifyContent: 'center', alignItems: 'center' }} >
            <span style={{ display: 'block', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 'smaller', lineHeight: '1.5' }}>{item.name}</span>
            <span style={{ display: 'block', width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 'x-small', fontWeight: 'lighter' }}>{'size' in item && item.size && sizeConv(item.size)}</span>
          </Grid>
          <Grid size='auto'>
            {
              (type === 'audio' || type === 'video') && !isSelectMode &&
              <IconButton
                aria-label={t`More`}
                size='small'
                sx={{ padding: 0 }}
                onMouseDown={(event) => event.stopPropagation()}
                onTouchStart={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  handleClickMenu(event, index)
                }}
              >
                <MoreVertRoundedIcon />
              </IconButton>
            }
          </Grid>
        </Grid>
      </Grid>

    </ListItemButton>
  )
}

export default CommonListItemCard