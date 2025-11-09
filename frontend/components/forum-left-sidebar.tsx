"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, HelpCircle, ChevronDown, Plus, BarChart3, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ForumLeftSidebarProps {
  onCreatePost?: () => void
  onCreatePoll?: () => void
}

export function ForumLeftSidebar({ 
  onCreatePost,
  onCreatePoll
}: ForumLeftSidebarProps = {}) {
  const [isAboutOpen, setIsAboutOpen] = useState(true)

  return (
    <aside className="w-64 space-y-4 sticky top-20">
      {/* Quick Actions Card - Moved from right sidebar */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-banana-DEFAULT" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={onCreatePost}
            className="w-full justify-start gap-3 bg-banana-DEFAULT text-foreground hover:bg-banana-dark transition-all banana-bounce shadow-sm"
            aria-label="Create new post"
          >
            <Plus className="h-4 w-4" />
            <span className="font-medium">New Post</span>
          </Button>
          <Button
            onClick={onCreatePoll}
            className="w-full justify-start gap-3 bg-banana-light text-foreground hover:bg-banana-DEFAULT transition-all banana-bounce"
            aria-label="Create poll"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium">Create Poll</span>
          </Button>
        </CardContent>
      </Card>

      <Collapsible open={isAboutOpen} onOpenChange={setIsAboutOpen}>
        <Card className="border-border shadow-sm">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </div>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isAboutOpen && "rotate-180")} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-2 text-sm text-muted-foreground pt-0">
              <p className="leading-relaxed">
                BunchUp is a union communication platform connecting members across North America.
              </p>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-banana-light/50 transition-all"
                aria-label="Help and Support"
              >
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Button>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </aside>
  )
}
