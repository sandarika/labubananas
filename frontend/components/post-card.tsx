"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronUp, ChevronDown, MessageCircle, MoreHorizontal, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { CommentSection } from "@/components/comment-section"

interface PostCardProps {
  id: number
  title: string
  author: string
  role: "Admin" | "Member"
  isAnonymous: boolean
  category: string
  content: string
  upvotes: number
  comments: number
  time: string
  isPinned?: boolean
}

export function PostCard({
  id,
  title,
  author,
  role,
  isAnonymous,
  category,
  content,
  upvotes: initialUpvotes,
  comments: initialComments,
  time,
  isPinned = false,
}: PostCardProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes)
  const [voteState, setVoteState] = useState<"up" | "down" | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentCount, setCommentCount] = useState(initialComments)

  // Update upvotes when initialUpvotes prop changes (data loaded from API)
  useEffect(() => {
    setUpvotes(initialUpvotes)
  }, [initialUpvotes])

  // Update comment count when initialComments prop changes (data loaded from API)
  useEffect(() => {
    setCommentCount(initialComments)
  }, [initialComments])

  const handleVote = (type: "up" | "down") => {
    if (voteState === type) {
      setVoteState(null)
      setUpvotes(initialUpvotes)
    } else {
      setVoteState(type)
      setUpvotes(type === "up" ? initialUpvotes + 1 : initialUpvotes - 1)
    }
  }

  const isLongContent = content.length > 200

  return (
    <Card
      className={cn(
        "transition-all duration-200 shadow-sm fade-in-up",
        isHovered && "shadow-md scale-[1.005] border-l-4 border-l-banana-DEFAULT",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-5">
          <div className="flex flex-col items-center gap-1 pt-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 hover:bg-banana-light vote-arrow-hover",
                voteState === "up" && "text-banana-DEFAULT bg-banana-light",
              )}
              onClick={() => handleVote("up")}
              aria-label="Upvote"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
            <span
              className={cn(
                "text-sm font-bold",
                voteState === "up" && "text-banana-DEFAULT",
                voteState === "down" && "text-red-500",
              )}
            >
              {upvotes}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-7 w-7 hover:bg-red-50 vote-arrow-hover",
                voteState === "down" && "text-red-500 bg-red-50",
              )}
              onClick={() => handleVote("down")}
              aria-label="Downvote"
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>

          {/* Post Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-9 w-9 mt-0.5 ring-1 ring-border">
                <AvatarImage src="/diverse-avatars.png" alt={isAnonymous ? "Anonymous user" : author} />
                <AvatarFallback className="bg-banana-light text-xs font-semibold">
                  {isAnonymous ? "?" : author[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {isAnonymous ? "Anonymous" : author} • {role}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{time}</span>
                  {isPinned && <Badge className="bg-banana-DEFAULT text-foreground text-xs font-semibold">Best</Badge>}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <h3 className="font-bold text-xl leading-tight text-foreground title-glow cursor-pointer">{title}</h3>

            <div className="space-y-2">
              <p
                className={cn(
                  "text-sm text-muted-foreground leading-relaxed",
                  !isExpanded && isLongContent && "line-clamp-2",
                )}
              >
                {content}
              </p>
              {isLongContent && !isExpanded && (
                <Button
                  variant="link"
                  className="text-banana-DEFAULT hover:text-banana-dark p-0 h-auto text-sm font-semibold gap-1"
                  onClick={() => setIsExpanded(true)}
                >
                  Read more <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="border-t border-border pt-3" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-foreground hover:bg-banana-light/50 gap-2 transition-all",
                  showComments && "bg-banana-light/50 text-foreground"
                )}
                aria-label={`${commentCount} comments`}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs font-medium">{commentCount}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="border-t border-border">
            <CommentSection 
              postId={id} 
              initialCommentCount={commentCount}
              onCommentCountChange={setCommentCount}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
