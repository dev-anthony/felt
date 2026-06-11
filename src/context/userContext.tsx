"use client"

import * as React from "react"
import { User, userApi, authApi } from "@/lib/api"
import { useRouter, usePathname } from "next/navigation"

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const refreshUser = React.useCallback(async () => {
    try {
      const data = await userApi.getMe()
      setUser(data.user)
    } catch (err) {
      // Clear local reference if backend reports unauthenticated session state
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (err) {
      console.error("Backend logout failed:", err)
    } finally {
      setUser(null)
      router.push("/")
    }
  }

  React.useEffect(() => {
    // Only invoke lookup operations inside protected paths or at home
    if (pathname.startsWith("/dashboard") || pathname === "/") {
      refreshUser()
    } else {
      setLoading(false)
    }
  }, [pathname, refreshUser])

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
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