import { Box } from '@mui/material'
import usePlayerStore from '@/store/usePlayerStore'
import useUiStore from '@/store/useUiStore'
import { useMemo } from 'react'
import { extractColors } from 'extract-colors'
import Classic from './Classic'

const Audio = ({ player }: { player: HTMLVideoElement | null }) => {

  const [
    audioViewIsShow,
    updateColor,
  ] = useUiStore(
    (state) => [
      state.audioViewIsShow,
      state.updateColor,
    ]
  )

  const [cover] = usePlayerStore((state) => [state.cover])

  // 从专辑封面提取颜色
  useMemo(
    () => (cover !== './cover.webp') &&
      extractColors(cover).then(color => updateColor(color[0].hex)).catch(console.error),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cover]
  )

  return (
    <Box
      sx={{ width: '100%', height: '100dvh', position: 'fixed', transition: 'top 0.35s ease-in-out' }}
      style={(audioViewIsShow) ? { top: 0 } : { top: '100vh' }}
    >
      <Classic player={player} />
    </Box>
  )
}

export default Audio