"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useUser } from "@/lib/user-context"
import { User, LogOut } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isSignedIn, signOut } = useUser()

  const links = [
    { href: "/", label: "Home" },
    { href: "/forum", label: "Forum" },
    { href: "/unions", label: "Unions" },
    { href: "/calendar", label: "Calendar" },
    { href: "/dashboard", label: "Dashboard" },
  ]

  // Only show the Sign In / Sign Up buttons when the user is NOT signed in.
  // Keep them visible even on the sign-in / sign-up pages per preference.
  const showAuthButtons = !isSignedIn

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
  <div className="container mx-auto grid grid-cols-[auto_1fr_auto] items-center h-16 px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold banana-bounce">
          <span className="text-4xl">🍌</span>
          <span className="text-foreground">BunchUp</span>
        </Link>

  <div className="flex items-center gap-6 justify-center">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive
                    ? "text-foreground bg-yellow-400 px-3 py-1.5 rounded-md"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn && user ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{user.username}</span>
                <span className="text-muted-foreground">({user.role})</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="font-medium">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : showAuthButtons ? (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="font-medium bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  )
}
