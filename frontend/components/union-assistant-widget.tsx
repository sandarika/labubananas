"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "bot"
  content: string
  timestamp: Date
}

export function UnionAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hey there! I'm the Union Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Mock response with setTimeout
    setTimeout(() => {
      const responses = [
        "That's a great question about union rights! Let me help you with that.",
        "Based on labor laws and union guidelines, here's what you should know...",
        "I can connect you with resources about that topic. Would you like me to share some links?",
        "For specific legal advice, I recommend consulting with your union representative or legal advisor.",
        "Union solidarity is important! Here's some information that might help...",
        "Let me look that up for you. In the meantime, you can also check our FAQ section.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage: Message = {
        role: "bot",
        content: randomResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <>
      {/* Floating Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center transition-all duration-200",
          "bg-[#F2C94C] hover:bg-[#E6C627] hover:scale-110",
          "focus:outline-none focus:ring-2 focus:ring-[#F2C94C] focus:ring-offset-2",
          isOpen && "scale-90",
        )}
        aria-label="Toggle Union Assistant"
      >
        {isOpen ? <X className="h-6 w-6 text-gray-900" /> : <Sparkles className="h-6 w-6 text-gray-900" />}
      </button>

      {/* Collapsible Chat Tab */}
      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 w-[360px] h-[500px] bg-white rounded-xl border border-gray-200 flex flex-col",
          "transition-all duration-200 ease-in-out",
          "md:w-[360px] max-md:w-[90vw] max-md:right-[5vw]",
          isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none",
        )}
      >
        {/* Header */}
        <div className="bg-[#F2C94C] rounded-t-xl px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900" style={{ fontFamily: "Verdana, sans-serif" }}>
            Union Assistant
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-700 hover:text-gray-900 transition-colors focus:outline-none"
            aria-label="Close chat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((message, index) => (
            <div key={index} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                  message.role === "user" ? "bg-gray-100 text-gray-900" : "bg-[#FFF8DD] text-gray-900",
                )}
                style={{ fontFamily: "Verdana, sans-serif" }}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#FFF8DD] rounded-lg px-4 py-3 flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask the Union Assistant…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSend()
                }
              }}
              className="flex-1 text-sm border-gray-300 focus:border-[#F2C94C] focus:ring-[#F2C94C]"
              style={{ fontFamily: "Verdana, sans-serif" }}
            />
            <Button
              onClick={handleSend}
              size="icon"
              className="bg-[#F2C94C] hover:bg-[#E6C627] text-gray-900 shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
