"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authApi, type User as ApiUser } from "./api"

type User = {
  id: number
  username: string
  role: string
  email?: string
  phone?: string
  union?: string
} | null

type UserContextType = {
  user: User
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
  isSignedIn: boolean
  loading: boolean
  error: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        try {
          const userData = await authApi.getCurrentUser()
          setUser(userData)
        } catch (err) {
          // Token invalid or expired, clear it
          localStorage.removeItem("auth_token")
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const signIn = async (username: string, password: string) => {
    setError(null)
    setLoading(true)
    try {
      // Get JWT token
      const tokenData = await authApi.login(username, password)
      localStorage.setItem("auth_token", tokenData.access_token)
      
      // Fetch user data
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
    setError(null)
  }

  return (
    <UserContext.Provider value={{ user, signIn, signOut, isSignedIn: user !== null, loading, error }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
