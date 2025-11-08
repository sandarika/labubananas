"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, TrendingUp, Compass, Info, HelpCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
  { id: "most-popular", label: "Most Popular", icon: Flame, badge: "hot", tooltip: "Trending posts in your unions" },
  { id: "popular", label: "Popular", icon: TrendingUp, badge: null, tooltip: "Highly engaged discussions" },
  { id: "explore", label: "Explore", icon: Compass, badge: null, tooltip: "Discover new unions and topics" },
]

export function ForumLeftSidebar() {
  const [activeItem, setActiveItem] = useState("most-popular")
  const [isAboutOpen, setIsAboutOpen] = useState(true)

  return (
    <aside className="w-64 space-y-4 sticky top-20">
      <Card className="border-border shadow-sm">
        <CardContent className="p-3 space-y-1">
          <TooltipProvider>
            {menuItems.map((item) => (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveItem(item.id)}
                    className={cn(
                      "w-full justify-start gap-3 transition-all hover:bg-banana-light/70",
                      activeItem === item.id
                        ? "bg-banana-light text-foreground font-semibold border-l-2 border-banana-DEFAULT"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge === "hot" && <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
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
