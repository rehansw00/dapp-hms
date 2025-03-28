"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"

type Message = {
  id: number
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatAssistant() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your MediChain assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(input)
      const botMessage: Message = {
        id: messages.length + 2,
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  // Simple bot response logic - in a real app, this would be connected to an AI service
  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("medical record") || input.includes("health record")) {
      return "Your medical records are securely stored on the blockchain. You can view them in the 'My Records' section of your dashboard. Each record is encrypted and can only be accessed by you and your authorized healthcare providers."
    } else if (input.includes("appointment") || input.includes("schedule")) {
      return "You can schedule an appointment by going to the 'Appointments' section in your dashboard. There you can see available time slots for your doctors and book a convenient time."
    } else if (input.includes("doctor") || input.includes("physician")) {
      return "Your primary care physician is Dr. Smith. You can see all your assigned doctors in the 'My Doctors' section of your dashboard."
    } else if (input.includes("medication") || input.includes("prescription")) {
      return "Your current medications are listed in your latest medical record. You can view detailed information about dosage and instructions in the 'My Records' section."
    } else if (input.includes("blockchain") || input.includes("security")) {
      return "MediChain uses blockchain technology to ensure your medical data is secure, immutable, and only accessible to authorized parties. Your data is encrypted and distributed across the network, making it highly secure against unauthorized access."
    } else if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! How can I assist you with your healthcare information today?"
    } else if (input.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?"
    } else {
      return "I'm here to help you navigate the MediChain platform and answer questions about your medical records, appointments, and healthcare providers. Could you please provide more details about what you need assistance with?"
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chat Assistant</h1>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>MediChain Assistant</CardTitle>
          <CardDescription>
            Ask questions about your medical records, appointments, or how to use the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className={message.sender === "user" ? "bg-primary" : "bg-muted"}>
                    <AvatarFallback>
                      {message.sender === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

