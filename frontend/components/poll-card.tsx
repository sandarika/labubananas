"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type PollOption = {
  label: string
  votes: number
}

type PollCardProps = {
  question: string
  options: PollOption[]
  totalVotes: number
  showInFeed?: boolean
}

export function PollCard({ question, options, totalVotes, showInFeed = false }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)

  const handleVote = (index: number) => {
    if (!hasVoted) {
      setSelectedOption(index)
      setHasVoted(true)
    }
  }

  return (
    <Card className={cn("border-banana-dark/10", showInFeed && "hover:shadow-md transition-shadow")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2 text-xs">
              Poll
            </Badge>
            <h3 className="font-bold text-base leading-snug">{question}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Poll Options */}
        <div className="space-y-2">
          {options.map((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
            const isSelected = selectedOption === index

            return (
              <button
                key={index}
                onClick={() => handleVote(index)}
                disabled={hasVoted}
                className={cn(
                  "w-full text-left relative overflow-hidden rounded-lg border transition-all p-3",
                  hasVoted ? "cursor-default" : "hover:border-banana-DEFAULT hover:bg-banana-light/20 cursor-pointer",
                  isSelected && hasVoted && "border-banana-DEFAULT",
                )}
              >
                {/* Background bar */}
                {hasVoted && (
                  <div
                    className={cn(
                      "absolute inset-0 transition-all duration-500",
                      isSelected ? "bg-banana-DEFAULT/30" : "bg-muted",
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center justify-between">
                  <span className="font-medium text-sm">{option.label}</span>
                  {hasVoted && (
                    <span
                      className={cn("text-sm font-bold", isSelected ? "text-banana-dark" : "text-muted-foreground")}
                    >
                      {percentage.toFixed(1)}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Vote Info */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {hasVoted ? (
              <span className="font-medium text-foreground">Voted: {totalVotes} votes</span>
            ) : (
              `${totalVotes} votes`
            )}
          </span>

          {!hasVoted && (
            <div className="flex items-center gap-2">
              <Switch id="anonymous-poll" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
              <Label htmlFor="anonymous-poll" className="text-xs cursor-pointer">
                Anonymous
              </Label>
            </div>
          )}
        </div>

        {!hasVoted && (
          <Button
            size="sm"
            disabled={selectedOption === null}
            onClick={() => selectedOption !== null && handleVote(selectedOption)}
            className="w-full bg-banana-DEFAULT text-foreground hover:bg-banana-dark"
          >
            Submit Vote
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
