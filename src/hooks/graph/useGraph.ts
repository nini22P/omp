import { getAppRootFiles, getFile, getFiles, search, uploadAppRootJson, getDelta } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
import { AccountInfo, IPublicClientApplication } from '@azure/msal-browser'
import useLocalDeltaDataStore from '@/store/useLocalDeltaDataStore'

const useGraph = (
  instance: IPublicClientApplication,
  account: AccountInfo | null | undefined,
) => {
  const { setLocalDeltaData, getLocalDeltaData } = useLocalDeltaDataStore()

  const getAccessToken = async (): Promise<string> => {
    if (!account) {
      throw new Error('User account is not available. Please log in.')
    }

    await instance.initialize()
    const tokenResponse = await instance.acquireTokenSilent({
      ...loginRequest,
      account: account,
    })
    return tokenResponse.accessToken
  }

  const getFilesData = async (path: string[]) => {
    await instance.initialize()
    const accessToken = await getAccessToken()

    let response = await getFiles(path, accessToken)

    const remoteItems = [...response.value]

    while (response['@odata.nextLink']) {
      response = await getFiles(path, accessToken, response['@odata.nextLink'])
      remoteItems.push(...response.value)
    }

    return { value: remoteItems }
  }

  const getFileData = async (path: string[]) => {
    await instance.initialize()
    const accessToken = await getAccessToken()
    const response = await getFile(path, accessToken)
    return response
  }

  const getAppRootFilesData = async (path: string[]) => {
    await instance.initialize()
    const accessToken = await getAccessToken()
    const response = await getAppRootFiles(path, accessToken)
    return response
  }

  const uploadAppRootJsonData = async (fileName: string, fileContent: BodyInit) => {
    await instance.initialize()
    const accessToken = await getAccessToken()
    const response = await uploadAppRootJson(fileName, fileContent, accessToken)
    return response
  }

  const getSearchData = async (searchQuery: string) => {
    await instance.initialize()
    const accessToken = await getAccessToken()
    const response = await search(searchQuery, accessToken)
    return response
  }

  const getDeltaData = async (path: string[]) => {
    await instance.initialize()
    const accessToken = await getAccessToken()

    const localData = await getLocalDeltaData(path)
    const deltaLink = localData?.deltaLink

    if (deltaLink) {
      try {
        console.log('Attempting delta sync...')
        let response = await getDelta(path, accessToken, deltaLink)
        const remoteChanges = [...response.value]

        while (response['@odata.nextLink']) {
          response = await getDelta(path, accessToken, response['@odata.nextLink'])
          remoteChanges.push(...response.value)
        }

        if (!response['@odata.deltaLink']) {
          throw new Error('Delta sync failed: No new deltaLink received.')
        }

        const newDeltaLink = response['@odata.deltaLink']

        const mergedItems = [...localData.items]
        remoteChanges.forEach((item) => {
          const index = mergedItems.findIndex(i => i.id === item.id)

          if (item.deleted) {
            if (index !== -1) mergedItems.splice(index, 1)
          } else {
            if (index === -1) {
              mergedItems.push(item)
            } else {
              mergedItems[index] = item
            }
          }
        })

        await setLocalDeltaData(path, { items: mergedItems, deltaLink: newDeltaLink })
        return mergedItems

      } catch (error) {
        console.error('Delta sync failed, falling back to full sync.', error)
      }
    }

    console.log('Performing full sync...')
    let response = await getDelta(path, accessToken)
    const remoteItems = [...response.value]

    while (response['@odata.nextLink']) {
      response = await getDelta(path, accessToken, response['@odata.nextLink'])
      remoteItems.push(...response.value)
    }

    if (!response['@odata.deltaLink']) {
      throw new Error('Initial sync failed: No deltaLink received.')
    }

    const newDeltaLink = response['@odata.deltaLink']

    await setLocalDeltaData(path, { items: remoteItems, deltaLink: newDeltaLink })
    return remoteItems
  }

  return {
    getFilesData,
    getFileData,
    getAppRootFilesData,
    uploadAppRootJsonData,
    getSearchData,
    getDeltaData,
  }
}

export default useGraph
