"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Bell, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface ForumNavbarProps {
  onMenuToggle?: () => void
}

export function ForumNavbar({ onMenuToggle }: ForumNavbarProps) {
  const [searchValue, setSearchValue] = useState("")

  return (
    <nav className="sticky top-0 z-50 w-full bg-banana-DEFAULT border-b border-banana-dark/20 backdrop-blur supports-[backdrop-filter]:bg-banana-DEFAULT/95 shadow-sm">
      <div className="w-full flex h-16 items-center justify-between px-4 gap-4">
        <div className="flex items-center gap-3 min-w-fit">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-foreground hover:bg-banana-dark/10"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              {/* Mobile sidebar content */}
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 banana-bounce group">
            <div className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">🍌</div>
            <div className="hidden sm:flex flex-col">
              <span className="text-base font-bold text-foreground leading-tight">BunchUp</span>
              <span className="text-[9px] text-foreground/70 leading-tight">Connect. Organize. Empower.</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 max-w-3xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="# Filter"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-white border-border focus-visible:ring-banana-DEFAULT"
              aria-label="Search posts"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-banana-dark/10 transition-colors"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:bg-banana-dark/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full" aria-hidden="true" />
          </Button>
          <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-banana-dark transition-all">
            <AvatarImage src="/diverse-user-avatars.png" alt="User avatar" />
            <AvatarFallback className="bg-banana-dark text-white text-xs">AN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="# Filter"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 bg-white border-border"
            aria-label="Search posts"
          />
        </div>
      </div>
    </nav>
  )
}
