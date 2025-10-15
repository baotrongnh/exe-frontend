"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
    markMessagesAsRead,
    useChat,
    transformMessageToUI,
    getCurrentUserId
} from "./components"

// Utility function to format relative time
function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export default function Messages() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [threads, setThreads] = useState<MessageThread[]>([])
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set())

    // Initialize Socket.IO chat
    const {
        isConnected,
        sendMessage: socketSendMessage,
        startTyping,
        stopTyping,
        connectionError,
        currentUserId: socketCurrentUserId
    } = useChat({
        onNewMessage: async (apiMessage) => {
            console.log('Received new message via Socket.IO:', apiMessage)

            // Get current user ID for proper message transformation
            const currentUserId = socketCurrentUserId || await getCurrentUserId()
            console.log('Current user ID:', currentUserId, 'Message sender ID:', apiMessage.sender_id)

            // Skip messages sent by the current user (sender already sees them via optimistic update)
            if (apiMessage.sender_id === currentUserId) {
                console.log('Skipping own message from Socket.IO to prevent duplication')
                return
            }

            // Only process messages for the currently selected conversation
            if (apiMessage.conversation_id !== selectedThreadId) {
                console.log('Message for different conversation, updating thread list only')
                // Update thread list for other conversations
                setThreads(prev => {
                    const updatedThreads = prev.map(thread =>
                        thread.id === apiMessage.conversation_id
                            ? {
                                ...thread,
                                lastMessage: apiMessage.content,
                                timestamp: formatRelativeTime(new Date()),
                                unreadCount: thread.unreadCount + 1
                            }
                            : thread
                    )

                    // Move updated conversation to top
                    const conversationIndex = updatedThreads.findIndex(t => t.id === apiMessage.conversation_id)
                    if (conversationIndex > 0) {
                        const [conversationThread] = updatedThreads.splice(conversationIndex, 1)
                        updatedThreads.unshift(conversationThread)
                    }

                    return updatedThreads
                })
                return
            }

            // Transform the incoming message
            const transformedMessage = transformMessageToUI(apiMessage, currentUserId || undefined)

            // Add message to current conversation (only for recipients, not senders)
            setMessages(prev => {
                // Check if message already exists to prevent duplicates
                const exists = prev.some(msg => msg.id === transformedMessage.id)
                if (exists) {
                    console.log('Message already exists, skipping duplicate:', transformedMessage.id)
                    return prev
                }
                console.log('Adding new message from other user to current conversation:', transformedMessage.id)

                // Insert message in correct chronological order based on rawTimestamp
                const newMessages = [...prev, transformedMessage]
                return newMessages.sort((a, b) => {
                    const aTime = a.rawTimestamp ? new Date(a.rawTimestamp).getTime() : new Date().getTime()
                    const bTime = b.rawTimestamp ? new Date(b.rawTimestamp).getTime() : new Date().getTime()
                    return aTime - bTime
                })
            })

            // Update thread list with new last message and move to top
            setThreads(prev => {
                const updatedThreads = prev.map(thread =>
                    thread.id === apiMessage.conversation_id
                        ? {
                            ...thread,
                            lastMessage: apiMessage.content,
                            timestamp: formatRelativeTime(new Date()),
                            unreadCount: thread.id === selectedThreadId ? thread.unreadCount : thread.unreadCount + 1
                        }
                        : thread
                )

                // Find the updated conversation and move it to the top
                const conversationIndex = updatedThreads.findIndex(t => t.id === apiMessage.conversation_id)
                if (conversationIndex > 0) {
                    const [conversationThread] = updatedThreads.splice(conversationIndex, 1)
                    updatedThreads.unshift(conversationThread)
                }

                return updatedThreads
            })
        },
        onTyping: (data) => {
            if (data.conversationId === selectedThreadId) {
                setTypingUsers(prev => {
                    const newSet = new Set(prev)
                    // Don't show typing indicator for the current user
                    if (data.userId !== socketCurrentUserId) {
                        if (data.isTyping) {
                            newSet.add(data.userId)
                        } else {
                            newSet.delete(data.userId)
                        }
                    }
                    return newSet
                })
            }
        },
        onMessagesRead: (data) => {
            if (data.conversationId === selectedThreadId) {
                setMessages(prev => prev.map(msg => ({
                    ...msg,
                    isRead: true
                })))
            }
        }
    })

    // Store current values in refs to avoid dependency issues
    const socketConnectionRef = useRef({ isConnected })

    // Update ref when values change
    useEffect(() => {
        socketConnectionRef.current = { isConnected }
    }, [isConnected])

    const loadThreads = useCallback(async () => {
        try {
            const threadsData = await getMessageThreads()
            setThreads(threadsData)
        } catch (error) {
            console.error('Failed to load threads:', error)
            // showToast('Failed to load conversations. Please refresh the page.', 'error')
        }
    }, []) // Remove showToast dependency to prevent infinite loops

    // Handle URL parameter for conversation selection
    useEffect(() => {
        const conversationId = searchParams.get('conversation')
        if (conversationId && threads.length > 0) {
            const threadExists = threads.find(t => t.id === conversationId)
            if (threadExists) {
                setSelectedThreadId(conversationId)
                // Clear typing indicators when switching conversations
                setTypingUsers(new Set())
            }
        }
    }, [searchParams, threads])

    // Auto-select first thread if no URL parameter and no thread selected
    useEffect(() => {
        const conversationId = searchParams.get('conversation')
        if (threads.length > 0 && !selectedThreadId && !conversationId) {
            setSelectedThreadId(threads[0].id)
            // Clear typing indicators when auto-selecting conversation
            setTypingUsers(new Set())
        }
    }, [threads, selectedThreadId, searchParams])

    // Load threads on component mount
    useEffect(() => {
        loadThreads()
    }, [loadThreads])

    // Load messages when thread is selected
    useEffect(() => {
        if (selectedThreadId) {
            const loadMessagesForThread = async () => {
                try {
                    setIsLoadingMessages(true)
                    const messagesData = await getMessagesByThreadId(selectedThreadId)

                    // Remove duplicates based on message ID and sort by raw timestamp
                    const uniqueMessages = messagesData
                        .filter((message, index, self) =>
                            index === self.findIndex(m => m.id === message.id)
                        )
                        .sort((a, b) => {
                            // Use rawTimestamp for sorting if available, fallback to parsing timestamp
                            const aTime = a.rawTimestamp ? new Date(a.rawTimestamp).getTime() : new Date().getTime()
                            const bTime = b.rawTimestamp ? new Date(b.rawTimestamp).getTime() : new Date().getTime()
                            return aTime - bTime
                        })

                    console.log(`Loaded ${messagesData.length} messages, ${uniqueMessages.length} unique for thread:`, selectedThreadId)
                    console.log('Sample messages with timestamps:', uniqueMessages.slice(0, 3).map(m => ({
                        id: m.id,
                        timestamp: m.timestamp,
                        rawTimestamp: m.rawTimestamp,
                        content: m.content.substring(0, 20) + '...'
                    })))
                    setMessages(uniqueMessages)

                    // Find and set candidate info
                    const thread = threads.find(t => t.id === selectedThreadId)
                    if (thread) {
                        try {
                            const candidate = await getCandidateById(thread.candidateId)
                            setSelectedCandidate(candidate || null)
                        } catch (error) {
                            console.error('Failed to get candidate info:', error)
                            setSelectedCandidate(null)
                        }

                        // Mark messages as read when conversation is opened
                        if (thread.unreadCount > 0) {
                            // Use REST API to mark messages as read
                            markMessagesAsRead(selectedThreadId).catch(error =>
                                console.error('Failed to mark messages as read:', error)
                            )

                            // Update thread's unread count in local state
                            setThreads(currentThreads => currentThreads.map(t =>
                                t.id === selectedThreadId ? { ...t, unreadCount: 0 } : t
                            ))
                        }
                    }
                } catch (error) {
                    console.error('Failed to load messages:', error)
                } finally {
                    setIsLoadingMessages(false)
                }
            }

            loadMessagesForThread()
        }
    }, [selectedThreadId, threads]) // Include threads dependency

    // Handle typing indicator
    const handleTyping = useCallback((content: string) => {
        if (!selectedThreadId) return

        if (content.trim()) {
            startTyping?.(selectedThreadId)
        } else {
            stopTyping?.(selectedThreadId)
        }
    }, [selectedThreadId, startTyping, stopTyping])

    const handleSendMessage = async (content: string) => {
        if (!selectedThreadId) return

        try {
            setIsSending(true)

            // Send via REST API for persistence first
            const newMessage = await sendMessage(selectedThreadId, content)

            // Add message to UI immediately for sender (optimistic update)
            setMessages(prev => {
                // Check if message already exists to prevent duplicates
                const exists = prev.some(msg => msg.id === newMessage.id)
                if (exists) {
                    console.log('Message already exists in UI, skipping duplicate:', newMessage.id)
                    return prev
                }
                console.log('Adding new message to UI for sender:', newMessage.id, 'timestamp:', newMessage.timestamp, 'raw:', newMessage.rawTimestamp)

                // Insert message in correct chronological order
                const newMessages = [...prev, newMessage]
                return newMessages.sort((a, b) => {
                    const aTime = a.rawTimestamp ? new Date(a.rawTimestamp).getTime() : new Date().getTime()
                    const bTime = b.rawTimestamp ? new Date(b.rawTimestamp).getTime() : new Date().getTime()
                    return aTime - bTime
                })
            })

            // Update thread in list and move to top
            setThreads(prev => {
                const updatedThreads = prev.map(thread =>
                    thread.id === selectedThreadId
                        ? {
                            ...thread,
                            lastMessage: content,
                            timestamp: formatRelativeTime(new Date())
                        }
                        : thread
                )

                // Find the updated conversation and move it to the top
                const conversationIndex = updatedThreads.findIndex(t => t.id === selectedThreadId)
                if (conversationIndex > 0) {
                    const [conversationThread] = updatedThreads.splice(conversationIndex, 1)
                    updatedThreads.unshift(conversationThread)
                }

                return updatedThreads
            })

            // Send via Socket.IO for real-time delivery to other users ONLY
            // Pass the message ID so backend can broadcast the existing message instead of creating a new one
            // Add small delay to ensure REST API message is saved before broadcasting
            if (isConnected && socketSendMessage) {
                setTimeout(() => {
                    const success = socketSendMessage(selectedThreadId, content, 'text', undefined, newMessage.id)
                    if (success) {
                        console.log('Message broadcasted via Socket.IO for real-time delivery to other users, messageId:', newMessage.id)
                    } else {
                        console.log('Socket.IO broadcast failed, but REST API succeeded')
                    }
                }, 100) // 100ms delay to ensure DB persistence
            } else {
                console.log('Socket.IO not connected, message sent via REST API only')
            }

        } catch (error) {
            console.error('Failed to send message:', error)
            // showToast('Failed to send message. Please try again.', 'error')
        } finally {
            setIsSending(false)
        }
    }

    const handleViewProfile = () => {
        if (selectedCandidate) {
            window.open(selectedCandidate.profileUrl, '_blank')
        }
    }

    const handleThreadSelect = (threadId: string) => {
        setSelectedThreadId(threadId)
        // Clear typing indicators when switching conversations
        setTypingUsers(new Set())
        // Update URL to include conversation parameter
        router.push(`/messages?conversation=${threadId}`, { scroll: false })
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
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                        {/* Connection status */}
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                                }`}></div>
                            <span className="text-xs text-gray-500">
                                {isConnected ? 'Connected' : connectionError || 'Disconnected'}
                            </span>

                        </div>
                    </div>
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
                                onClick={() => handleThreadSelect(thread.id)}
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
                                typingUsers={typingUsers}
                            />
                            <MessageInput
                                onSendMessage={handleSendMessage}
                                onTyping={handleTyping}
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