"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Message = {
  id: number
  sender: "user" | "bot"
  text: string
}

const cannedResponses = [
  "Labor laws protect your right to organize and collectively bargain. Would you like specific information about your state?",
  "Union members have protections against unfair dismissal. I can help you understand your rights.",
  "Healthcare benefits are a common bargaining point. Many unions negotiate comprehensive coverage for members.",
  "Workplace safety is paramount. OSHA regulations require employers to maintain safe working conditions.",
]

const suggestionChips = [
  "My rights as a union member",
  "How to file a grievance",
  "Contract negotiation tips",
  "Workplace safety info",
]

export function ForumRightSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I'm here to help with union and labor questions. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSend = (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: messageText,
    }

    setMessages([...messages, userMessage])
    setInput("")

    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: cannedResponses[Math.floor(Math.random() * cannedResponses.length)],
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <aside className="w-80 space-y-4 sticky top-20">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-banana-light/30 to-transparent">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Bot className="h-4 w-4 text-banana-dark" />
              AI Labor Assistant
            </CardTitle>
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              Beta
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Get instant answers about union and labor topics</p>
        </CardHeader>
        <CardContent className="p-0">
          {messages.length === 1 && (
            <div className="p-3 space-y-2 border-b bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 px-2 bg-white hover:bg-banana-light transition-colors"
                    onClick={() => handleSend(chip)}
                  >
                    {chip}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <ScrollArea className="h-64 p-4">
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                      message.sender === "user"
                        ? "bg-banana-DEFAULT text-foreground"
                        : "bg-muted text-foreground border border-border",
                    )}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted border border-border rounded-2xl px-4 py-3 flex items-center gap-1 typing-indicator">
                    <span className="h-2 w-2 bg-muted-foreground/60 rounded-full"></span>
                    <span className="h-2 w-2 bg-muted-foreground/60 rounded-full"></span>
                    <span className="h-2 w-2 bg-muted-foreground/60 rounded-full"></span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-3 bg-muted/20">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about labor rights..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="text-sm bg-white"
                aria-label="Chat message input"
              />
              <Button
                size="icon"
                onClick={() => handleSend()}
                className="bg-banana-DEFAULT text-foreground hover:bg-banana-dark shrink-0 shadow-sm"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
