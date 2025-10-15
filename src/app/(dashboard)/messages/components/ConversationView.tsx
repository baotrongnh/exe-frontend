"use client"

import { useEffect } from "react"
import { Message, Candidate } from "./types"
import { ConversationHeader } from "./ConversationHeader"
import { MessageList } from "./MessageList"
import { useScrollManager } from "./useScrollManager"

interface ConversationViewProps {
    messages: Message[]
    candidate: Candidate
    threadId: string
    onViewProfile: () => void
    typingUsers: Set<string>
    isSending?: boolean
}

export function ConversationView({
    messages,
    candidate,
    threadId,
    onViewProfile,
    typingUsers = new Set(),
    isSending = false
}: ConversationViewProps) {
    const { messagesEndRef, messagesContainerRef, scrollToBottom } = useScrollManager({
        messages,
        threadId,
        isSending
    })

    // Handle typing indicator separately
    useEffect(() => {
        if (typingUsers.size > 0) {
            scrollToBottom("smooth")
        }
    }, [typingUsers, scrollToBottom])

    return (
        <div className="flex flex-col h-full min-w-0 overflow-hidden">
            <ConversationHeader candidate={candidate} onViewProfile={onViewProfile} />

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 bg-gray-50">
                <div className="max-w-full">
                    <MessageList
                        messages={messages}
                        candidate={candidate}
                        typingUsers={typingUsers}
                    />
                </div>

                {/* Auto scroll target */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    )
}