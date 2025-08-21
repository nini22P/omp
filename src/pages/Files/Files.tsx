import useSWR from 'swr'
import useUiStore from '../../store/useUiStore'
import useGraph from '../../hooks/graph/useGraph'
import BreadcrumbNav from './BreadcrumbNav'
import CommonList from '../../components/CommonList/CommonList'
import Loading from '../Loading'
import { remoteItemToFile, pathConv, fileSorter, shufflePlayQueue } from '../../utils'
import { FileItem } from '../../types/file'
import Grid from '@mui/material/Grid'
import FilterMenu from './FilterMenu'
import PictureView from '../PictureView/PictureView'
import { Divider } from '@mui/material'
import { useMemo, useState } from 'react'
import useUser from '@/hooks/graph/useUser'
import { useNavigate } from 'react-router-dom'
import usePictureStore from '@/store/usePictureStore'
import usePlayQueueStore from '@/store/usePlayQueueStore'
import usePlayerStore from '@/store/usePlayerStore'
import { useShallow } from 'zustand/shallow'
import { useMsal } from '@azure/msal-react'

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
  const navigate = useNavigate()

  const filesFetcher = async (path: string[]) => {
    console.log(path)
    const { value } = await getFilesData(path)
    return value.map(item => remoteItemToFile(item))
  }

  const { data: filesData, error: filesError, isLoading: filesIsLoading } =
    useSWR(
      account ? `${account?.username}/${pathConv(folderTree)}` : null,
      () => filesFetcher(folderTree),
      { revalidateOnFocus: false }
    )

  const files = useMemo(
    () => fileSorter(
      filesData?.filter((item) => mediaOnly ? item.fileType !== 'other' : true) || [],
      foldersFirst,
      sortBy,
      orderBy,
    ),
    [filesData, foldersFirst, sortBy, orderBy, mediaOnly]
  )

  const [scrollPath, setScrollPath] = useState<FileItem['filePath'] | undefined>()

  const scrollIndex = useMemo(
    () => scrollPath ? files?.findIndex(item => pathConv(item.filePath) === pathConv(scrollPath)) : undefined,
    [scrollPath, files]
  )

  const shuffleDisplay = useMemo(
    () => files?.filter(item => item.fileType === 'audio' || item.fileType === 'video').length > 0,
    [files]
  )

  const playAllDisplay = useMemo(
    () =>
      shuffleDisplay
      || files
        .filter(item => item.fileType === 'folder' && /^(disc|disk)\s*\d+$/.test(item.fileName.toLocaleLowerCase()))
        .length > 0,
    [files, shuffleDisplay]
  )

  const handleClickNav = (index: number) => {
    if (index < folderTree.length - 1) {
      setScrollPath(folderTree.slice(0, index + 2))
      updateFolderTree(folderTree.slice(0, index + 1))
    }
  }

  const open = async (index: number) => {
    if (files) {
      const currentFile = files[index]

      if (currentFile && currentFile.fileType === 'folder') {
        updateFolderTree(currentFile.filePath)
        navigate('/')
      }

      if (currentFile && currentFile.fileType === 'picture') {
        const list = files.filter(item => item.fileType === 'picture')
        updatePictureList(list)
        updateCurrentPicture(currentFile)
      }

      if (currentFile && (currentFile.fileType === 'audio' || currentFile.fileType === 'video')) {
        const list = files
          .filter((item) => item.fileType === 'audio' || item.fileType === 'video')
          .map((item, _index) => ({ ...item, index: _index }))
        if (shuffle) {
          updateShuffle(false)
        }
        updatePlayQueue(list)
        updateCurrentIndex(list.find(item => pathConv(item.filePath) === pathConv(currentFile.filePath))?.index || 0)
        updateAutoPlay(true)
        if (currentFile.fileType === 'video') {
          updateVideoViewIsShow(true)
        }
      }

      if (!currentFile) {
        const discs = files.filter(item => item.fileName.toLocaleLowerCase().includes('disc'))
        if (discs.length > 0 && account) {
          const files = await Promise.all(discs.map(item => getFilesData(item.filePath).then(({ value }) => value.map(item => remoteItemToFile(item)))))

          const list = files
            .flat()
            .filter((item) => item.fileType === 'audio' || item.fileType === 'video')
            .map((item, _index) => ({ ...item, index: _index }))

          if (list.length > 0) {
            if (shuffle) {
              updateShuffle(false)
            }
            updatePlayQueue(list)
            updateCurrentIndex(0)
            updateAutoPlay(true)
            if (list[0].fileType === 'video') {
              updateVideoViewIsShow(true)
            }
          }
        }
      }
    }
  }

  const playAll = async () => {
    const index = files?.findIndex(item => item.fileType === 'audio' || item.fileType === 'video')
    if (index !== undefined) {
      open(index)
    }
  }

  const shuffleAll = async () => {
    const list = files
      .filter((item) => item.fileType === 'audio' || item.fileType === 'video')
      .map((item, index) => ({ index, ...item }))
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