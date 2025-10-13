"use client"

import { useState, useEffect, useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    MessageThreadItem,
    ConversationView,
    MessageInput,
    MessageThread,
    Message,
    Candidate,
    getMessageThreads,
    getMessagesByThreadId,
    sendMessage,
    getCandidateById,
    markMessagesAsRead
} from "./components"

export default function Messages() {
    const [threads, setThreads] = useState<MessageThread[]>([])
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)

    const loadThreads = useCallback(async () => {
        try {
            const threadsData = await getMessageThreads()
            setThreads(threadsData)

            // Auto-select first thread if available
            if (threadsData.length > 0 && !selectedThreadId) {
                setSelectedThreadId(threadsData[0].id)
            }
        } catch (error) {
            console.error('Failed to load threads:', error)
        }
    }, [selectedThreadId])

    const loadMessages = useCallback(async (threadId: string) => {
        try {
            setIsLoadingMessages(true)
            const messagesData = await getMessagesByThreadId(threadId)
            setMessages(messagesData)

            // Find and set candidate info
            const thread = threads.find(t => t.id === threadId)
            if (thread) {
                const candidate = getCandidateById(thread.candidateId)
                setSelectedCandidate(candidate || null)
            }

            // Mark messages as read when conversation is opened
            if (thread && thread.unreadCount > 0) {
                try {
                    await markMessagesAsRead(threadId)
                    // Update thread's unread count in local state
                    setThreads(prev => prev.map(t =>
                        t.id === threadId ? { ...t, unreadCount: 0 } : t
                    ))
                } catch (error) {
                    console.error('Failed to mark messages as read:', error)
                }
            }
        } catch (error) {
            console.error('Failed to load messages:', error)
        } finally {
            setIsLoadingMessages(false)
        }
    }, [threads])

    // Load threads on component mount
    useEffect(() => {
        loadThreads()
    }, [loadThreads])

    // Load messages when thread is selected
    useEffect(() => {
        if (selectedThreadId) {
            loadMessages(selectedThreadId)
        }
    }, [selectedThreadId, loadMessages])

    const handleSendMessage = async (content: string) => {
        if (!selectedThreadId) return

        try {
            setIsSending(true)
            const newMessage = await sendMessage(selectedThreadId, content)
            setMessages(prev => [...prev, newMessage])

            // Update thread in list
            setThreads(prev => prev.map(thread =>
                thread.id === selectedThreadId
                    ? { ...thread, lastMessage: content, timestamp: 'Just now' }
                    : thread
            ))
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsSending(false)
        }
    }

    const handleViewProfile = () => {
        if (selectedCandidate) {
            window.open(selectedCandidate.profileUrl, '_blank')
        }
    }

    // Filter threads based on search query
    const filteredThreads = threads.filter(thread =>
        thread.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.candidateTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="h-full flex bg-white">
            {/* Left sidebar - Message threads */}
            <div className="w-96 border-r border-gray-200 flex flex-col bg-white">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-semibold mb-4 text-gray-900">Messages</h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search messages"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 border-gray-300 focus:border-[#4640DE] focus:ring-[#4640DE]"
                        />
                    </div>
                </div>

                {/* Thread list */}
                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.length > 0 ? (
                        filteredThreads.map((thread) => (
                            <MessageThreadItem
                                key={thread.id}
                                thread={thread}
                                isSelected={selectedThreadId === thread.id}
                                onClick={() => setSelectedThreadId(thread.id)}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">
                                {searchQuery ? 'No conversations match your search.' : 'No messages yet.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right side - Conversation view */}
            <div className="flex-1 flex flex-col">
                {selectedThreadId && selectedCandidate ? (
                    isLoadingMessages ? (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4640DE] mx-auto mb-4"></div>
                                <p className="text-gray-500">Loading conversation...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ConversationView
                                messages={messages}
                                candidate={selectedCandidate}
                                onViewProfile={handleViewProfile}
                            />
                            <MessageInput
                                onSendMessage={handleSendMessage}
                                isLoading={isSending}
                                placeholder="Reply to candidate..."
                            />
                        </>
                    )
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium mb-2 text-gray-900">Select a conversation</h3>
                            <p className="text-gray-500">
                                Choose a conversation from the sidebar to start messaging with candidates.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}