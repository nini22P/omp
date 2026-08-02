import { getAppRootFiles, getFile, getFiles, search, uploadAppRootJson, getDelta } from '@/graph/graph'
import { loginRequest } from '@/graph/authConfig'
import {
  AccountInfo,
  BrowserAuthError,
  BrowserAuthErrorCodes,
  InteractionRequiredAuthError,
  IPublicClientApplication,
} from '@azure/msal-browser'
import { GraphRequestPriority } from '@/graph/rateLimiter'

let interactiveRedirectPromise: Promise<void> | null = null

const requiresInteractiveTokenAcquisition = (error: unknown) => (
  error instanceof InteractionRequiredAuthError
  || (
    error instanceof BrowserAuthError
    && error.errorCode === BrowserAuthErrorCodes.monitorWindowTimeout
  )
)

const acquireTokenWithRedirect = (
  instance: IPublicClientApplication,
  account: AccountInfo,
) => {
  if (!interactiveRedirectPromise) {
    interactiveRedirectPromise = instance.acquireTokenRedirect({
      ...loginRequest,
      account,
    }).catch(error => {
      interactiveRedirectPromise = null
      throw error
    })
  }

  return interactiveRedirectPromise
}

const useGraph = (
  instance: IPublicClientApplication,
  account: AccountInfo | null | undefined,
) => {

  const getAccessToken = async (): Promise<string> => {
    if (!account) {
      throw new Error('User account is not available. Please log in.')
    }

    try {
      await instance.initialize()
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      })
      return tokenResponse.accessToken
    } catch (error) {
      if (requiresInteractiveTokenAcquisition(error)) {
        await acquireTokenWithRedirect(instance, account)
      }

      throw error
    }
  }

  const getFilesData = async (id: string, path?: string[], priority?: GraphRequestPriority) => {
    const accessToken = await getAccessToken()

    let response = await getFiles(accessToken, id, path, undefined, priority)

    const remoteItems = [...response.value]

    while (response['@odata.nextLink']) {
      response = await getFiles(accessToken, id, path, response['@odata.nextLink'], priority)
      remoteItems.push(...response.value)
    }

    return { value: remoteItems }
  }

  const getFileData = async (
    id: string,
    path?: string[],
    signal?: AbortSignal,
    priority?: GraphRequestPriority,
    includeThumbnails = true,
  ) => {
    const accessToken = await getAccessToken()
    const response = await getFile(accessToken, id, path, signal, priority, includeThumbnails)
    return response
  }

  const getAppRootFilesData = async (priority?: GraphRequestPriority) => {
    const accessToken = await getAccessToken()
    const response = await getAppRootFiles(accessToken, priority)
    return response
  }

  const uploadAppRootJsonData = async (fileName: string, fileContent: BodyInit, priority?: GraphRequestPriority) => {
    const accessToken = await getAccessToken()
    const response = await uploadAppRootJson(accessToken, fileName, fileContent, priority)
    return response
  }

  const getSearchData = async (searchQuery: string, priority?: GraphRequestPriority) => {
    const accessToken = await getAccessToken()
    const response = await search(accessToken, searchQuery, priority)
    return response
  }

  const getDeltaData = async (id: string, deltaLink?: string, priority?: GraphRequestPriority) => {
    const accessToken = await getAccessToken()

    let response = await getDelta(accessToken, id, deltaLink, priority)

    const remoteItems = [...response.value]

    while (response['@odata.nextLink']) {
      response = await getDelta(accessToken, id, response['@odata.nextLink'], priority)
      remoteItems.push(...response.value)
    }

    if (!response['@odata.deltaLink']) {
      throw new Error('Delta sync failed: No new deltaLink received.')
    }

    return {
      '@odata.deltaLink': response['@odata.deltaLink'],
      value: remoteItems,
    }
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
