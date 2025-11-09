"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Trash2, Edit2, Send, X } from "lucide-react"
import { commentsApi, type Comment } from "@/lib/api"
import { useUser } from "@/lib/user-context"
import { cn } from "@/lib/utils"

interface CommentSectionProps {
  postId: number
  initialCommentCount?: number
  onCommentCountChange?: (count: number) => void
}

export function CommentSection({ postId, initialCommentCount = 0, onCommentCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const data = await commentsApi.getComments(postId)
      setComments(data)
      onCommentCountChange?.(data.length)
    } catch (error) {
      console.error("Failed to load comments:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isSignedIn) return

    try {
      setIsSubmitting(true)
      const comment = await commentsApi.createComment(postId, { content: newComment.trim() })
      setComments([...comments, comment])
      setNewComment("")
      onCommentCountChange?.(comments.length + 1)
    } catch (error) {
      console.error("Failed to create comment:", error)
      alert("Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return

    try {
      const updatedComment = await commentsApi.updateComment(commentId, { content: editContent.trim() })
      setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)))
      setEditingId(null)
      setEditContent("")
    } catch (error) {
      console.error("Failed to update comment:", error)
      alert("Failed to update comment. Please try again.")
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    try {
      await commentsApi.deleteComment(commentId)
      setComments(comments.filter((c) => c.id !== commentId))
      onCommentCountChange?.(comments.length - 1)
    } catch (error) {
      console.error("Failed to delete comment:", error)
      alert("Failed to delete comment. Please try again.")
    }
  }

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditContent("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-sm text-muted-foreground">Loading comments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
      {/* Comment Input */}
      {isSignedIn ? (
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 ring-1 ring-border">
            <AvatarFallback className="bg-banana-light text-xs font-semibold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  handleSubmitComment()
                }
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Press Ctrl+Enter to submit</span>
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className="gap-2"
              >
                <Send className="h-3 w-3" />
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-4 text-center text-sm text-muted-foreground">
          Please sign in to comment
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8 ring-1 ring-border">
                <AvatarFallback className="bg-primary/10 text-xs font-semibold">
                  {comment.user.username[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{comment.user.username}</span>
                  <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                  {comment.created_at !== comment.updated_at && (
                    <span className="text-xs text-muted-foreground italic">(edited)</span>
                  )}
                </div>

                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateComment(comment.id)} className="gap-2">
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing} className="gap-2">
                        <X className="h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground leading-relaxed">{comment.content}</p>
                    {user && (user.id === comment.user_id || user.role === "admin") && (
                      <div className="flex gap-2 pt-1">
                        {user.id === comment.user_id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(comment)}
                            className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="h-7 text-xs gap-1 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
