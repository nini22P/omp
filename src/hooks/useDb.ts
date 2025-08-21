import { useState, useEffect } from 'react'
import { getDbForUser, LibraryDB } from '@/db'
import { AccountInfo } from '@azure/msal-browser'

const useDb = (account: AccountInfo | null | undefined): LibraryDB | null => {

  const [db, setDb] = useState<LibraryDB | null>(null)

  useEffect(() => {
    if (account) {
      const userId = account.homeAccountId
      const userDb = getDbForUser(userId)
      setDb(userDb)
    } else {
      setDb(null)
    }
  }, [account])

  return db
}

export default useDb