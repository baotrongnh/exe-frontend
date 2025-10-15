"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Message, Candidate } from "./types"

function formatMessageTime(timestamp: string | Date): string {
    try {
        // Handle null, undefined, or empty timestamps
        if (!timestamp || timestamp === 'null' || timestamp === 'undefined') {
            return 'Just now'
        }

        let date: Date

        // Handle different timestamp formats
        if (typeof timestamp === 'string') {
            // Clean up the timestamp - remove extra characters or normalize format
            let cleanTimestamp = timestamp.trim()

            // Handle ISO string format (like "2025-10-14T13:53:05.052Z")
            if (cleanTimestamp.includes('T') && !cleanTimestamp.endsWith('Z') && !cleanTimestamp.includes('+')) {
                cleanTimestamp += 'Z' // Add Z for UTC if missing
            }

            date = new Date(cleanTimestamp)

            // If direct parsing fails, try parsing as timestamp
            if (isNaN(date.getTime())) {
                const numTimestamp = parseInt(timestamp)
                if (!isNaN(numTimestamp)) {
                    date = new Date(numTimestamp)
                }
            }
        } else {
            date = timestamp
        }

        // Check if date is valid and not epoch time
        if (isNaN(date.getTime()) || date.getTime() === 0 || date.getFullYear() < 1990) {
            console.warn('Invalid date for message timestamp:', timestamp, 'parsed as:', date)
            return 'Just now'
        }

        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        // Handle future dates (might be server/client time mismatch)
        if (diffInSeconds < 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        // If message is from today, show time
        if (diffInSeconds < 86400 && diffInSeconds >= 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        // If message is older, show date
        return date.toLocaleDateString()

    } catch (error) {
        console.error('Error formatting message time:', error, 'for timestamp:', timestamp)
        return 'Just now'
    }
}

interface ConversationViewProps {
    messages: Message[]
    candidate: Candidate
    onViewProfile: () => void
    typingUsers?: Set<string>
}

export function ConversationView({
    messages,
    candidate,
    onViewProfile,
    typingUsers = new Set()
}: ConversationViewProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, typingUsers])

    const initials = candidate.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()

    return (
        <div className="flex flex-col h-full">
            {/* Header with candidate info */}
            <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback className="bg-[#E9EBFD] text-[#4640DE] font-medium text-lg">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {candidate.name}
                            </h2>
                            <p className="text-gray-600">
                                {candidate.title}
                            </p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={onViewProfile}
                        className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#E9EBFD]"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Profile
                    </Button>
                </div>
            </div>            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {(() => {
                    // Group messages by date
                    const messagesByDate: { [date: string]: Message[] } = {}

                    messages.forEach(message => {
                        try {
                            const timestamp = message.rawTimestamp || message.timestamp
                            let messageDate: Date

                            if (typeof timestamp === 'string') {
                                // Handle ISO string format
                                let cleanTimestamp = timestamp.trim()
                                if (cleanTimestamp.includes('T') && !cleanTimestamp.endsWith('Z') && !cleanTimestamp.includes('+')) {
                                    cleanTimestamp += 'Z'
                                }
                                messageDate = new Date(cleanTimestamp)
                            } else {
                                messageDate = new Date(timestamp)
                            }

                            // Fallback to current date if parsing fails
                            if (isNaN(messageDate.getTime()) || messageDate.getFullYear() < 1990) {
                                messageDate = new Date()
                            }

                            const dateKey = messageDate.toDateString() // e.g., "Mon Oct 14 2025"

                            if (!messagesByDate[dateKey]) {
                                messagesByDate[dateKey] = []
                            }
                            messagesByDate[dateKey].push(message)
                        } catch (error) {
                            console.error('Error grouping message by date:', error)
                            // Fallback to today's date
                            const todayKey = new Date().toDateString()
                            if (!messagesByDate[todayKey]) {
                                messagesByDate[todayKey] = []
                            }
                            messagesByDate[todayKey].push(message)
                        }
                    })

                    // Format date for display
                    const formatDateHeader = (dateString: string): string => {
                        try {
                            const date = new Date(dateString)
                            const today = new Date()
                            const yesterday = new Date(today)
                            yesterday.setDate(yesterday.getDate() - 1)

                            if (date.toDateString() === today.toDateString()) {
                                return 'Today'
                            } else if (date.toDateString() === yesterday.toDateString()) {
                                return 'Yesterday'
                            } else {
                                return date.toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            }
                        } catch {
                            return 'Today'
                        }
                    }

                    // Sort dates chronologically
                    const sortedDates = Object.keys(messagesByDate).sort((a, b) => {
                        return new Date(a).getTime() - new Date(b).getTime()
                    })

                    return sortedDates.map((dateKey, dateIndex) => (
                        <div key={dateKey} className={dateIndex > 0 ? 'mt-8' : ''}>
                            <div className="text-center text-sm text-gray-500 mb-6">
                                {formatDateHeader(dateKey)}
                            </div>
                            <div className="space-y-4">
                                {messagesByDate[dateKey].map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex gap-3 mb-6 ${message.senderType === 'employer' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        {message.senderType === 'candidate' && (
                                            <Avatar className="w-8 h-8 shrink-0">
                                                <AvatarImage src={candidate.avatar} alt={candidate.name} />
                                                <AvatarFallback className="bg-[#E9EBFD] text-[#4640DE] text-xs">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}

                                        <div
                                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.senderType === 'employer'
                                                ? 'bg-[#4640DE] text-white'
                                                : 'bg-white text-gray-900 border border-gray-200'
                                                }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            {/* Read status for sent messages */}
                                            {message.senderType === 'employer' && (
                                                <div className="flex items-center justify-end gap-1 mt-1">
                                                    <span className="text-xs opacity-70">
                                                        {formatMessageTime(message.rawTimestamp || message.timestamp)}
                                                    </span>
                                                    {message.isRead && (
                                                        <span className="text-xs opacity-70">✓✓</span>
                                                    )}
                                                </div>
                                            )}
                                            {/* Timestamp for received messages */}
                                            {message.senderType === 'candidate' && (
                                                <div className="flex items-center justify-start mt-1">
                                                    <span className="text-xs text-gray-500">
                                                        {formatMessageTime(message.rawTimestamp || message.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {message.senderType === 'employer' && (
                                            <Avatar className="w-8 h-8 shrink-0">
                                                <AvatarImage src="/avatars/employer.jpg" alt="You" />
                                                <AvatarFallback className="bg-[#E9EBFD] text-[#4640DE] font-medium text-xs">
                                                    You
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                })()}

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                    <div className="flex gap-3 justify-start mt-6">
                        <Avatar className="w-8 h-8 shrink-0">
                            <AvatarImage src={candidate.avatar} alt={candidate.name} />
                            <AvatarFallback className="bg-[#E9EBFD] text-[#4640DE] text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                )}

                {/* Auto scroll target */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}