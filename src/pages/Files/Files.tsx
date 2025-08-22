import useUiStore from '@/store/useUiStore'
import useGraph from '@/hooks/graph/useGraph'
import BreadcrumbNav from './BreadcrumbNav'
import CommonList from '@/components/CommonList/CommonList'
import Loading from '../Loading'
import { fileSorter, shufflePlayQueue, remoteItemToFileNode, fileNodeToPlaylistItem, isAudio, isVideo } from '@/utils'
import Grid from '@mui/material/Grid'
import FilterMenu from './FilterMenu'
import PictureView from '../PictureView/PictureView'
import { Divider } from '@mui/material'
import { useMemo, useState } from 'react'
import useUser from '@/hooks/graph/useUser'
import usePictureStore from '@/store/usePictureStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import { useShallow } from 'zustand/shallow'
import { useMsal } from '@azure/msal-react'
import useGetFiles from '@/hooks/useGetFiles'

const Files = () => {

  const [
    shuffle,
    folderTree,
    display,
    sortBy,
    orderBy,
    foldersFirst,
    mediaOnly,
    updateFolderTree,
    updateVideoViewIsShow,
    updateShuffle,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.shuffle,
        state.folderTree,
        state.display,
        state.sortBy,
        state.orderBy,
        state.foldersFirst,
        state.mediaOnly,
        state.updateFolderTree,
        state.updateVideoViewIsShow,
        state.updateShuffle,
      ]
    )
  )

  const [updatePictureList, updateCurrentPicture] = usePictureStore(
    useShallow((state) => [state.updatePictureList, state.updateCurrentPicture])
  )

  const updatePlayQueue = usePlayQueueStore.use.updatePlayQueue()
  const updateCurrentIndex = usePlayQueueStore.use.updateCurrentIndex()

  const updateAutoPlay = usePlayerStore(state => state.updateAutoPlay)

  const { instance } = useMsal()
  const { account } = useUser()

  const { getFilesData } = useGraph(instance, account)

  const { data: filesData, error: filesError, isLoading: filesIsLoading } = useGetFiles(folderTree)

  const files = useMemo(
    () => fileSorter(
      filesData?.filter((item) => item.folder === 1 || (mediaOnly ? item.type !== 'other' : true)) || [],
      foldersFirst,
      sortBy,
      orderBy,
    ),
    [filesData, foldersFirst, sortBy, orderBy, mediaOnly]
  )

  const [scrollId, setScrollId] = useState<string | undefined>()

  const scrollIndex = useMemo(
    () => scrollId ? files?.findIndex(item => item.id === scrollId) : undefined,
    [scrollId, files]
  )

  const shuffleDisplay = useMemo(
    () => files?.filter(item => item.type === 'audio' || item.type === 'video').length > 0,
    [files]
  )

  const playAllDisplay = useMemo(
    () =>
      shuffleDisplay
      || files
        .filter(item => item.folder === 1 && /^(disc|disk)\s*\d+$/.test(item.name.toLocaleLowerCase()))
        .length > 0,
    [files, shuffleDisplay]
  )

  const handleClickNav = (index: number) => {
    updateFolderTree(folderTree.slice(0, index))
  }

  const open = async (index: number) => {
    if (files) {
      const currentFile = files[index]

      if (currentFile && currentFile.folder === 1) {
        setScrollId(currentFile.id)
        updateFolderTree(currentFile.path)
      }

      if (currentFile && currentFile.type === 'picture') {
        const list = files.filter(item => item.type === 'picture')
        updatePictureList(list)
        updateCurrentPicture(currentFile)
      }

      if (currentFile && (isAudio(currentFile.name) || isVideo(currentFile.name))) {
        const list = files
          .filter((item) => isAudio(item.name) || isVideo(item.name))
          .map((item, _index) => ({ ...fileNodeToPlaylistItem(item), index: _index }))
        if (shuffle) {
          updateShuffle(false)
        }
        updatePlayQueue(list)
        updateCurrentIndex(list.find(item => item.path.join('/') === currentFile.path.join('/'))?.index || 0)
        updateAutoPlay(true)
        if (isVideo(currentFile.name)) {
          updateVideoViewIsShow(true)
        }
      }

      if (!currentFile) {
        const discs = files.filter(item => item.name.toLocaleLowerCase().includes('disc'))
        if (discs.length > 0 && account) {
          const files = await Promise.all(
            discs.map(item => getFilesData(item.id).then(({ value }) => value.map(item => remoteItemToFileNode(item, { includeVisuals: true })))))

          const list = files
            .flat()
            .filter((item) => isAudio(item.name) || isVideo(item.name))
            .map((item, _index) => ({ ...fileNodeToPlaylistItem(item), index: _index }))

          if (list.length > 0) {
            if (shuffle) {
              updateShuffle(false)
            }
            updatePlayQueue(list)
            updateCurrentIndex(0)
            updateAutoPlay(true)
            if (isVideo(list[0].name)) {
              updateVideoViewIsShow(true)
            }
          }
        }
      }
    }
  }

  const playAll = async () => {
    const index = files?.findIndex(item => item.type === 'audio' || item.type === 'video')
    if (index !== undefined) {
      open(index)
    }
  }

  const shuffleAll = async () => {
    const list = files
      .filter((item) => isAudio(item.name) || isVideo(item.name))
      .map((item, index) => ({ index, ...fileNodeToPlaylistItem(item) }))
    if (!shuffle)
      updateShuffle(true)
    const shuffledList = shufflePlayQueue(list) || []
    updatePlayQueue(shuffledList)
    updateCurrentIndex(shuffledList[0].index)
    updateAutoPlay(true)
  }

  return (
    <Grid container
      sx={{
        height: '100%',
        overflow: 'auto',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
      }}>
      <Grid container
        size={12}
        justifyContent='space-between'
        alignItems='center'
        wrap='nowrap'
        padding='0.125rem'
        gap='0.25rem'
      >
        <Grid size='grow'>
          <BreadcrumbNav folderTree={folderTree} handleClickNav={handleClickNav} />
        </Grid>
        <Grid size='auto' sx={{ display: 'flex', flexDirection: 'row', justifyItems: 'center', alignItems: 'center' }}>
          <FilterMenu />
        </Grid>
      </Grid>
      <Divider />
      <Grid size={12} sx={{ flexGrow: 1, overflow: 'auto' }}>
        {
          (filesIsLoading || !filesData || !files || filesError)
            ? <Loading />
            : <CommonList
              display={display}
              listData={files}
              listType='files'
              scrollIndex={scrollIndex}
              func={{
                open,
                playAll: playAllDisplay ? playAll : undefined,
                shuffleAll: shuffleDisplay ? shuffleAll : undefined,
              }}
            />
        }
      </Grid>
      <PictureView />
    </Grid>
  )
}

export default Files