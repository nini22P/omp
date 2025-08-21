import useGraph from '@/hooks/graph/useGraph'
import useUser from '@/hooks/graph/useUser'
import useUiStore from '@/store/useUiStore'
import { fileSorter, pathConv, remoteItemToFile } from '@/utils'
import { useMsal } from '@azure/msal-react'
import { useLingui } from '@lingui/react/macro'
import { Divider, Grid } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useMemo, useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import useSWR from 'swr'
import { useShallow } from 'zustand/shallow'
import BreadcrumbNav from '../Files/BreadcrumbNav'
import Loading from '../Loading'
import CommonList from '@/components/CommonList/CommonList'
import useDb from '@/hooks/useDb'

export default function SetLibraryFolderDialog(
  {
    title,
    variant
  }
    : {
      title?: string,
      variant?: 'text' | 'contained' | 'outlined',
    }
) {
  const { t } = useLingui()
  const { instance } = useMsal()
  const { account } = useUser()
  const db = useDb(account)
  const { getFilesData, getFileData } = useGraph(instance, account)

  const [
    display,
    sortBy,
    orderBy,
    foldersFirst,
  ] = useUiStore(
    useShallow(
      (state) => [
        state.display,
        state.sortBy,
        state.orderBy,
        state.foldersFirst,
      ]
    )
  )

  const [open, setOpen] = useState(false)
  const [folderTree, setFolderTree] = useState(['/'])

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
      filesData?.filter((item) => item.fileType === 'folder') || [],
      foldersFirst,
      sortBy,
      orderBy,
    ),
    [filesData, foldersFirst, sortBy, orderBy]
  )

  const handleClickNav = (index: number) => {
    if (index < folderTree.length - 1) {
      setFolderTree(folderTree.slice(0, index + 1))
    }
  }

  const openFolder = async (index: number) => {
    if (files) {
      const currentFile = files[index]

      if (currentFile && currentFile.fileType === 'folder') {
        setFolderTree(currentFile.filePath)
      }
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setFolderTree(['/'])
    setOpen(false)
  }

  const handleOk = async () => {
    let rootId: string | undefined

    if (files?.length > 0) {
      rootId = files[0].parentId
    } else {
      const res = await getFileData(folderTree)
      rootId = res.id
    }

    if (db && rootId) {
      db.settings.update('settings', { libraryRootId: rootId, deltaLink: undefined })
    }
    handleClose()
  }

  return (
    <Fragment>
      <Button variant={variant ?? 'contained'} onClick={handleClickOpen}>
        {title ?? t`Set library folder`}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {t`Set library folder`}
        </DialogTitle>
        <DialogContent>
          <Grid container
            sx={{
              height: '50dvh',
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
            </Grid>
            <Divider />
            <Grid size={12} sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}>
              {
                (filesIsLoading || !filesData || !files || filesError)
                  ? <Loading />
                  : <CommonList
                    display={display}
                    listData={files}
                    listType='files'
                    func={{
                      open: openFolder,
                    }}
                  />
              }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {t`Cancel`}
          </Button>
          <Button onClick={handleOk} autoFocus>
            {t`OK`}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
