"use client"

import * as React from "react"
import { User, userApi, authApi } from "@/lib/api"
import { useRouter, usePathname } from "next/navigation"

interface UserContextType {
  user: User | null
  loading: boolean
setUser: (user: User | null) => void
  refreshUser: () => Promise<void>

  logout: () => Promise<void>
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()

  // Boot once on mount — cookie is settled by this point
  React.useEffect(() => {
    userApi.getMe()
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, []) // ← empty deps, runs once only

  const logout = async () => {
    await authApi.logout()
    setUser(null)
    router.push("/")
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = React.useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be utilized beneath a corresponding UserProvider block")
  }
  return context
}