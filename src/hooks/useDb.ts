import { useMemo } from 'react'
import { getDbForUser, LibraryDB } from '@/db'
import { AccountInfo } from '@azure/msal-browser'

const useDb = (account: AccountInfo | null | undefined): LibraryDB | null => {
  const userId = account?.homeAccountId

  const db = useMemo(() => userId ? getDbForUser(userId) : null, [userId])

  return db
}

export default useDb