"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { pollsApi, type Poll, type PollResults as ApiPollResults } from "@/lib/api"

type PollOption = {
  label: string
  votes: number
}

type LegacyPollCardProps = {
  question: string
  options: PollOption[]
  totalVotes: number
  showInFeed?: boolean
  poll?: never
}

type ApiPollCardProps = {
  poll: Poll
  showInFeed?: boolean
  question?: never
  options?: never
  totalVotes?: never
}

type PollCardProps = LegacyPollCardProps | ApiPollCardProps

export function PollCard(props: PollCardProps) {
  const { showInFeed = false } = props
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [pollResults, setPollResults] = useState<ApiPollResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Determine if using API poll or legacy format
  const isApiPoll = 'poll' in props && props.poll !== undefined
  
  // Load results if API poll
  useEffect(() => {
    if (isApiPoll && props.poll) {
      loadResults(props.poll.id)
    }
  }, [isApiPoll, props.poll?.id])

  const loadResults = async (pollId: number) => {
    try {
      const results = await pollsApi.getResults(pollId)
      setPollResults(results)
    } catch (err) {
      console.error("Failed to load poll results:", err)
    }
  }

  const handleVote = async (index: number) => {
    if (hasVoted || !isApiPoll || !props.poll) {
      if (!hasVoted && !isApiPoll) {
        // Legacy poll - just show results
        setSelectedOption(index)
        setHasVoted(true)
      }
      return
    }

    setLoading(true)
    setError(null)

    try {
      const optionId = props.poll.options[index].id
      const results = await pollsApi.vote(props.poll.id, optionId)
      setPollResults(results)
      setSelectedOption(index)
      setHasVoted(true)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to submit vote"
      setError(errorMsg)
      // If already voted, still show results
      if (errorMsg.includes("already voted")) {
        setHasVoted(true)
        await loadResults(props.poll.id)
      }
    } finally {
      setLoading(false)
    }
  }

  // Get poll data based on type
  const getQuestion = () => {
    if (isApiPoll && props.poll) return props.poll.question
    if ('question' in props) return props.question
    return ""
  }

  const getOptions = () => {
    if (pollResults) {
      // Use API results
      return pollResults.results.map(r => ({
        label: r.text,
        votes: r.votes,
        id: r.option_id
      }))
    } else if (isApiPoll && props.poll) {
      // Use API poll options (no results yet)
      return props.poll.options.map(o => ({
        label: o.text,
        votes: 0,
        id: o.id
      }))
    } else if ('options' in props) {
      // Legacy format
      return props.options.map((o, idx) => ({ ...o, id: idx }))
    }
    return []
  }

  const getTotalVotes = () => {
    if (pollResults) {
      return pollResults.results.reduce((sum, r) => sum + r.votes, 0)
    }
    if ('totalVotes' in props) return props.totalVotes
    return 0
  }

  const question = getQuestion()
  const options = getOptions()
  const totalVotes = getTotalVotes() || 0

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
        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {error}
          </div>
        )}
        
        {/* Poll Options */}
        <div className="space-y-2">
          {options.map((option, index) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
            const isSelected = selectedOption === index

            return (
              <button
                key={option.id ?? index}
                onClick={() => handleVote(index)}
                disabled={hasVoted || loading}
                className={cn(
                  "w-full text-left relative overflow-hidden rounded-lg border transition-all p-3",
                  hasVoted || loading ? "cursor-default" : "hover:border-banana-DEFAULT hover:bg-banana-light/20 cursor-pointer",
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
              <Switch id="anonymous-poll" checked={isAnonymous} onCheckedChange={setIsAnonymous} disabled />
              <Label htmlFor="anonymous-poll" className="text-xs cursor-pointer">
                Anonymous
              </Label>
            </div>
          )}
        </div>

        {!hasVoted && (
          <Button
            size="sm"
            disabled={selectedOption === null || loading}
            onClick={() => selectedOption !== null && handleVote(selectedOption)}
            className="w-full bg-banana-DEFAULT text-foreground hover:bg-banana-dark"
          >
            {loading ? "Submitting..." : "Submit Vote"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
