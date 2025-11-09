"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MessageSquare } from "lucide-react"
import { feedbackApi } from "@/lib/api"

interface FeedbackFormProps {
  postId?: number
}

export function FeedbackForm({ postId }: FeedbackFormProps) {
  const [feedback, setFeedback] = useState("")
  const [anonymous, setAnonymous] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) {
      setError("Please enter your feedback")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (postId) {
        await feedbackApi.createFeedback(postId, {
          message: feedback,
          anonymous,
        })
      } else {
        await feedbackApi.createGeneralFeedback({
          message: feedback,
          anonymous,
        })
      }
      
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFeedback("")
        setAnonymous(true)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Anonymous Feedback
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Share your concerns or suggestions safely. Your identity will remain completely anonymous.
        </p>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="py-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Thank you for your feedback!</h3>
            <p className="text-muted-foreground">Your anonymous message has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, concerns, or suggestions here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="anonymous" 
                checked={anonymous}
                onCheckedChange={(checked) => setAnonymous(checked === true)}
              />
              <Label 
                htmlFor="anonymous" 
                className="text-sm font-normal cursor-pointer"
              >
                Submit anonymously (your identity will not be recorded)
              </Label>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
