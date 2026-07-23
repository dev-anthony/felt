"use client"

import * as React from "react"
import { User, userApi, authApi } from "@/lib/api"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface UserContextType {
  user: User | null
  loading: boolean
  refreshUser: () => Promise<void>
  logout: () => Promise<void>
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

// Routes that require an authenticated user profile session context
const PROTECTED_ROUTES = ["/dashboard", "/onboarding", "/settings", "/workspace"];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const refreshUser = React.useCallback(async () => {
    try {
      const data = await userApi.getMe()
      setUser(data.user)
      
      // SCRUBBING GUARD: If authenticated successfully and a stale ?auth=true parameters remains, clear it out
      if (searchParams.get("auth") === "true") {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("auth")
        const query = params.toString()
        router.replace(`${pathname}${query ? `?${query}` : ""}`)
      }
    } catch {
      setUser(null)
      
      // PROTECTION GUARD: If user validation fails while on a private screen, bounce them back to landing page
      const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
      if (isProtected) {
        router.push("/?auth=true")
      }
    } finally {
      setLoading(false)
    }
  }, [pathname, searchParams, router])

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
    // Only invoke lookup lookups inside protected paths or at home root
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) || pathname === "/") {
      // session lookup.
      // Validating the session against the backend is synchronisation with an
      // external system, which is exactly what an effect is for.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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