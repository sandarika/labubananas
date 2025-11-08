"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type User = {
  name: string
  email: string
  phone: string
  union: string
  role: string
} | null

type UserContextType = {
  user: User
  signIn: (userData: Omit<User, null>) => void
  signOut: () => void
  isSignedIn: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)

  const signIn = (userData: Omit<User, null>) => {
    setUser(userData)
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, signIn, signOut, isSignedIn: user !== null }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
