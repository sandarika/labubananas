"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, HelpCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export function ForumLeftSidebar() {
  const [isAboutOpen, setIsAboutOpen] = useState(true)

  return (
    <aside className="w-64 space-y-4 sticky top-20">
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

      {/* About Issue Card */}
      <Card className="border-border bg-banana-light/30 shadow-sm">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Report an Issue</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Found a bug or have feedback? Let us know anonymously.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full text-xs bg-transparent hover:bg-banana-DEFAULT/20 transition-colors banana-bounce"
          >
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </aside>
  )
}
