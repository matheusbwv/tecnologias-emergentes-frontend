import { useEffect, useState } from 'react'
import type { User } from '@/types'

const STORAGE_KEY = 'currentUser'

export function useUser() {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  function logout() {
    setUser(null)
  }

  return { user, setUser, logout }
}
