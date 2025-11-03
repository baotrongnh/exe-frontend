import { api } from '@/lib/api'
import { supabase } from '@/lib/supabase'
import { MessageThread, Message, Candidate, ApiConversation, ApiMessage } from './types'

// Environment flag to switch between mock and real API
export async function getCurrentUserId(): Promise<string | null> {
    try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
            const payload = JSON.parse(atob(session.access_token.split('.')[1]))
            // Check for different possible user ID fields
            const userId = payload.id || payload.sub || payload.userId
            console.log('🔐 getCurrentUserId - Token payload:', {
                id: payload.id,
                sub: payload.sub,
                userId: payload.userId,
                extractedUserId: userId
            })
            return userId
        }
    } catch (error) {
        console.error('Error getting current user ID:', error)
    }
    return null
}

// Environment flag to switch between mock and real API
const USE_MOCK_API = false // Set to false when backend is ready

// Mock data for development
const mockApiConversations: ApiConversation[] = [
    {
        id: '8ec03c31-c317-46a6-970a-168f8a352cfa', // Using your real conversation ID
        otherUser: {
            id: '4ffbbc49-d145-4849-aaa6-4c23516ff43b',
            email: 'developer@example.com',
            full_name: 'Mobile Developer',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
        },
        job: {
            id: 'a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d',
            title: 'Mobile App Developer - Flutter'
        },
        lastMessage: {
            content: 'Conversation started',
            created_at: '2025-10-14T11:50:53.133Z',
            is_read: false
        },
        created_at: '2025-10-14T11:50:53.100Z',
        updated_at: '2025-10-14T11:50:53.100Z',
        last_message_at: '2025-10-14T11:50:53.098Z'
    },
    {
        id: '1',
        otherUser: {
            id: '1',
            email: 'jan.mayer@example.com',
            full_name: 'Jan Mayer',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
        },
        job: {
            id: 'job-1',
            title: 'UI/UX Designer Position'
        },
        lastMessage: {
            content: 'We want to invite you for a quick interview',
            created_at: '2023-10-12T15:30:45Z',
            is_read: false
        },
        created_at: '2023-10-12T10:00:00Z',
        updated_at: '2023-10-12T15:30:45Z',
        last_message_at: '2023-10-12T15:30:45Z'
    },
    {
        id: '2',
        otherUser: {
            id: '2',
            email: 'joe.bartmann@example.com',
            full_name: 'Joe Bartmann',
            avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format'
        },
        job: {
            id: 'job-2',
            title: 'Backend Developer Role'
        },
        lastMessage: {
            content: 'Hey thanks for your interview...',
            created_at: '2023-10-12T13:40:00Z',
            is_read: true
        },
        created_at: '2023-10-11T09:00:00Z',
        updated_at: '2023-10-12T13:40:00Z',
        last_message_at: '2023-10-12T13:40:00Z'
    },
    {
        id: '3',
        otherUser: {
            id: '3',
            email: 'ally.wales@example.com',
            full_name: 'Ally Wales',
            avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
        },
        job: {
            id: 'job-3',
            title: 'Frontend Developer Position'
        },
        lastMessage: {
            content: 'Hey thanks for your interview...',
            created_at: '2023-10-12T13:40:00Z',
            is_read: true
        },
        created_at: '2023-10-11T08:00:00Z',
        updated_at: '2023-10-12T13:40:00Z',
        last_message_at: '2023-10-12T13:40:00Z'
    }
]

const mockApiMessages: Record<string, ApiMessage[]> = {
    '8ec03c31-c317-46a6-970a-168f8a352cfa': [
        {
            id: 'a6dcf407-d005-407e-9a6c-25ac9c88db90',
            conversation_id: '8ec03c31-c317-46a6-970a-168f8a352cfa',
            sender_id: 'fe999c63-8c55-4d1c-8b30-2dbc64d3ae39',
            message_type: 'system',
            content: 'Conversation started',
            file_url: null,
            is_read: false,
            read_at: null,
            created_at: '2025-10-13T11:50:53.133Z', // Yesterday
            updated_at: '2025-10-13T11:50:53.133Z'
        },
        {
            id: 'msg-2',
            conversation_id: '8ec03c31-c317-46a6-970a-168f8a352cfa',
            sender_id: 'employer-1',
            message_type: 'text',
            content: 'Hello! I\'m interested in your Flutter development skills for our mobile app project.',
            file_url: null,
            is_read: false,
            read_at: null,
            created_at: '2025-10-13T12:00:00.000Z', // Yesterday
            updated_at: '2025-10-13T12:00:00.000Z'
        },
        {
            id: 'msg-3',
            conversation_id: '8ec03c31-c317-46a6-970a-168f8a352cfa',
            sender_id: 'fe999c63-8c55-4d1c-8b30-2dbc64d3ae39',
            message_type: 'text',
            content: 'Hi! Yes, I have extensive experience with Flutter and would love to discuss this opportunity.',
            file_url: null,
            is_read: false,
            read_at: null,
            created_at: '2025-10-13T14:30:00.000Z', // Yesterday
            updated_at: '2025-10-13T14:30:00.000Z'
        },
        {
            id: 'msg-4',
            conversation_id: '8ec03c31-c317-46a6-970a-168f8a352cfa',
            sender_id: 'employer-1',
            message_type: 'text',
            content: 'Great! Can you tell me about your recent Flutter projects?',
            file_url: null,
            is_read: false,
            read_at: null,
            created_at: '2025-10-15T09:15:00.000Z', // Today
            updated_at: '2025-10-15T09:15:00.000Z'
        },
        {
            id: 'msg-5',
            conversation_id: '8ec03c31-c317-46a6-970a-168f8a352cfa',
            sender_id: 'fe999c63-8c55-4d1c-8b30-2dbc64d3ae39',
            message_type: 'text',
            content: 'Sure! I recently completed a cross-platform e-commerce app and a fitness tracking application.',
            file_url: null,
            is_read: false,
            read_at: null,
            created_at: '2025-10-15T10:25:00.000Z', // Today
            updated_at: '2025-10-15T10:25:00.000Z'
        }
    ],
    '1': [
        {
            id: '1-1',
            conversation_id: '1',
            sender_id: 'employer-1',
            message_type: 'text',
            content: 'Hi Jan, I wanted to reach out because we saw your work contributions and were impressed by your work.',
            file_url: null,
            is_read: true,
            read_at: '2023-10-12T14:00:00Z',
            created_at: '2023-10-12T13:00:00Z',
            updated_at: '2023-10-12T14:00:00Z'
        },
        {
            id: '1-2',
            conversation_id: '1',
            sender_id: '1',
            message_type: 'text',
            content: 'Hi Maria, sure I would love to. Thanks for taking the time to see my work!',
            file_url: null,
            is_read: true,
            read_at: '2023-10-12T14:30:00Z',
            created_at: '2023-10-12T14:00:00Z',
            updated_at: '2023-10-12T14:30:00Z'
        },
        {
            id: '1-3',
            conversation_id: '1',
            sender_id: 'employer-1',
            message_type: 'text',
            content: 'We want to invite you for a quick interview',
            file_url: null,
            is_read: true,
            read_at: '2023-10-12T15:00:00Z',
            created_at: '2023-10-12T14:45:00Z',
            updated_at: '2023-10-12T15:00:00Z'
        },
        {
            id: '1-4',
            conversation_id: '1',
            sender_id: '1',
            message_type: 'text',
            content: 'Thank you for considering my application. I\'m excited about this opportunity!',
            file_url: null,
            is_read: false,
            read_at: null,
            created_at: '2023-10-12T15:30:45Z',
            updated_at: '2023-10-12T15:30:45Z'
        }
    ]
}

// Utility functions to transform API data to UI format
function transformConversationToThread(conversation: ApiConversation): MessageThread {
    const unreadCount = conversation.lastMessage?.is_read ? 0 : 1

    // Debug avatar handling
    console.log('🖼️ Transforming conversation - Avatar data:', {
        conversationId: conversation.id,
        otherUserId: conversation.otherUser?.id,
        otherUserName: conversation.otherUser?.full_name,
        avatar_url: conversation.otherUser?.avatar_url,
        fullOtherUser: conversation.otherUser
    })

    return {
        id: conversation.id,
        candidateId: conversation.otherUser?.id || '',
        candidateName: conversation.otherUser?.full_name || conversation.otherUser?.email || 'Unknown User',
        candidateTitle: conversation.job?.title || 'Candidate',
        candidateAvatar: conversation.otherUser?.avatar_url || '',
        lastMessage: conversation.lastMessage?.content || 'No messages',
        timestamp: formatTimestamp(conversation.lastMessage?.created_at || new Date().toISOString()),
        unreadCount
    }
}

export function transformMessageToUI(message: ApiMessage, currentUserId?: string): Message {
    return {
        id: message.id,
        threadId: message.conversation_id,
        senderId: message.sender_id,
        senderType: message.sender_id === currentUserId ? 'employer' : 'candidate',
        content: message.content,
        timestamp: formatTimestamp(message.created_at),
        rawTimestamp: message.created_at, // Keep raw timestamp for sorting
        isRead: message.is_read
    }
}

function formatTimestamp(timestamp: string): string {
    try {
        // Handle null, undefined, or empty timestamps
        if (!timestamp || timestamp === 'null' || timestamp === 'undefined' || timestamp.trim() === '') {
            console.warn('Invalid timestamp received:', timestamp)
            return 'Just now'
        }

        // Clean up the timestamp - remove extra characters or normalize format
        let cleanTimestamp = timestamp.trim()

        // Handle different timestamp formats
        if (cleanTimestamp.includes('T') && !cleanTimestamp.endsWith('Z') && !cleanTimestamp.includes('+')) {
            cleanTimestamp += 'Z' // Add Z for UTC if missing
        }

        const date = new Date(cleanTimestamp)

        // Check if date is valid
        if (isNaN(date.getTime()) || date.getTime() === 0 || date.getFullYear() < 1990) {
            console.warn('Invalid date parsed from timestamp:', timestamp, 'parsed as:', date)
            return 'Just now'
        }

        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        // Handle future dates (might be server/client time mismatch)
        if (diffInSeconds < 0) {
            return 'Just now'
        }

        if (diffInSeconds < 60) {
            if (diffInSeconds <= 0) return 'Just now'
            return `${diffInSeconds}s ago`
        } else if (diffInSeconds < 3600) {
            const diffInMins = Math.floor(diffInSeconds / 60)
            return `${diffInMins} min${diffInMins > 1 ? 's' : ''} ago`
        } else if (diffInSeconds < 86400) {
            const diffInHours = Math.floor(diffInSeconds / 3600)
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
        } else {
            const diffInDays = Math.floor(diffInSeconds / 86400)
            if (diffInDays < 7) {
                return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
            } else {
                return date.toLocaleDateString()
            }
        }
    } catch (error) {
        console.error('Error formatting timestamp:', error, 'for timestamp:', timestamp)
        return 'Just now'
    }
}

// Main API functions that can use either mock or real API
export async function getMessageThreads(): Promise<MessageThread[]> {
    try {
        if (USE_MOCK_API) {
            // Mock API simulation
            console.log('Using mock API for conversations')
            await new Promise(resolve => setTimeout(resolve, 300))
            return mockApiConversations.map(transformConversationToThread)
        } else {
            // Real API call
            console.log('Fetching conversations from real API...')
            const response = await api.conversations.getAll()
            console.log('Conversations API response:', response)

            // Handle both direct array response and wrapped response
            const conversationsData = response.data || response

            if (!conversationsData || !Array.isArray(conversationsData)) {
                console.error('Invalid conversations response format:', conversationsData)
                throw new Error('Invalid API response format')
            }

            console.log('Raw conversations data:', conversationsData)
            console.log('Sample conversation structure:', conversationsData[0])

            // Sort conversations by last message timestamp (newest first)
            const sortedConversations = conversationsData.sort((a: ApiConversation, b: ApiConversation) => {
                const aTime = new Date(a.last_message_at || a.created_at).getTime()
                const bTime = new Date(b.last_message_at || b.created_at).getTime()
                return bTime - aTime // Newest first
            })

            console.log('Sorted conversations:', sortedConversations.length)
            console.log('First conversation otherUser data:', sortedConversations[0]?.otherUser)

            // Use basic transformation without current user data enhancement
            return sortedConversations.map(transformConversationToThread)
        }
    } catch (error) {
        console.error('Failed to get message threads:', error)
        // Don't fallback to mock data in production unless specifically enabled
        if (!USE_MOCK_API) {
            console.log('Real API failed, returning empty array')
            return []
        }
        // Fallback to mock data only in mock mode
        console.log('Falling back to mock data for demo purposes')
        // Sort mock conversations by last message timestamp (newest first)
        const sortedMockConversations = [...mockApiConversations].sort((a, b) => {
            const aTime = new Date(a.last_message_at || a.created_at).getTime()
            const bTime = new Date(b.last_message_at || b.created_at).getTime()
            return bTime - aTime // Newest first
        })
        return sortedMockConversations.map(transformConversationToThread)
    }
}

export async function getMessagesByThreadId(threadId: string): Promise<Message[]> {
    try {
        const currentUserId = await getCurrentUserId()

        if (USE_MOCK_API) {
            // Mock API simulation
            await new Promise(resolve => setTimeout(resolve, 200))
            const mockMessages = mockApiMessages[threadId] || []

            // Remove duplicates based on message ID
            const uniqueMessages = mockMessages.filter((message, index, self) =>
                index === self.findIndex(m => m.id === message.id)
            )

            console.log(`Loading messages for thread ${threadId}:`, {
                totalMessages: mockMessages.length,
                uniqueMessages: uniqueMessages.length,
                hasDuplicates: mockMessages.length !== uniqueMessages.length
            })

            // Sort messages by timestamp before transforming
            const sortedMessages = uniqueMessages.sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            )
            return sortedMessages.map(msg => transformMessageToUI(msg, currentUserId || undefined))
        } else {
            // Real API call
            console.log(`Fetching messages for conversation: ${threadId}`)
            const response = await api.conversations.getMessages(threadId)
            console.log('Messages API response:', response)

            // Handle both direct array response and wrapped response
            const messagesData = response.data || response

            if (!Array.isArray(messagesData)) {
                console.error('Invalid messages response format:', messagesData)
                throw new Error('Invalid API response format')
            }

            // Remove duplicates based on message ID first
            const uniqueMessages = messagesData.filter((message: ApiMessage, index: number, self: ApiMessage[]) =>
                index === self.findIndex((m: ApiMessage) => m.id === message.id)
            )

            console.log(`API messages for thread ${threadId}:`, {
                totalMessages: messagesData.length,
                uniqueMessages: uniqueMessages.length,
                hasDuplicates: messagesData.length !== uniqueMessages.length,
                sampleTimestamps: uniqueMessages.slice(0, 3).map(m => ({ id: m.id, created_at: m.created_at }))
            })

            // Sort messages by created_at timestamp before transforming
            const sortedMessages = uniqueMessages.sort((a: ApiMessage, b: ApiMessage) => {
                const aTime = new Date(a.created_at).getTime()
                const bTime = new Date(b.created_at).getTime()

                // Handle invalid timestamps
                if (isNaN(aTime) && isNaN(bTime)) return 0
                if (isNaN(aTime)) return 1
                if (isNaN(bTime)) return -1

                return aTime - bTime
            })

            return sortedMessages.map((msg: ApiMessage) => transformMessageToUI(msg, currentUserId || undefined))
        }
    } catch (error) {
        console.error('Failed to get messages for thread:', threadId, error)
        // Don't fallback to mock data in production - show empty array
        if (!USE_MOCK_API) {
            return []
        }
        // Fallback to mock data only if using mock mode
        const currentUserId = await getCurrentUserId()
        const mockMessages = mockApiMessages[threadId] || []

        // Remove duplicates based on message ID
        const uniqueMessages = mockMessages.filter((message, index, self) =>
            index === self.findIndex(m => m.id === message.id)
        )

        // Sort messages by timestamp
        const sortedMessages = uniqueMessages.sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        )

        return sortedMessages.map(msg => transformMessageToUI(msg, currentUserId || undefined))
    }
}

export async function sendMessage(threadId: string, content: string): Promise<Message> {
    try {
        const currentUserId = await getCurrentUserId()

        if (USE_MOCK_API) {
            // Mock API simulation
            await new Promise(resolve => setTimeout(resolve, 500))

            const newMessage: ApiMessage = {
                id: `${threadId}-${Date.now()}`,
                conversation_id: threadId,
                sender_id: currentUserId || 'unknown-user',
                message_type: 'text',
                content,
                file_url: null,
                is_read: true,
                read_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            // Add to mock data
            if (!mockApiMessages[threadId]) {
                mockApiMessages[threadId] = []
            }

            // Check for duplicates before adding
            const exists = mockApiMessages[threadId].some(msg => msg.id === newMessage.id)
            if (!exists) {
                mockApiMessages[threadId].push(newMessage)
            }

            // Update conversation's last message
            const conversation = mockApiConversations.find(c => c.id === threadId)
            if (conversation) {
                conversation.lastMessage = {
                    content,
                    created_at: new Date().toISOString(),
                    is_read: true
                }
                conversation.last_message_at = new Date().toISOString()
            }

            return transformMessageToUI(newMessage, currentUserId || undefined)
        } else {
            // Real API call
            console.log('📤 Sending message via REST API to:', threadId, 'Content:', content.substring(0, 30) + '...')
            const response = await api.conversations.sendMessage(threadId, { content })
            console.log('📤 REST API response:', response)
            const transformedMessage = transformMessageToUI(response.data, currentUserId || undefined)
            console.log('📤 Transformed message for UI:', transformedMessage)
            return transformedMessage
        }
    } catch (error) {
        console.error('Failed to send message:', error)
        throw error
    }
}

export async function markMessagesAsRead(threadId: string): Promise<void> {
    try {
        if (USE_MOCK_API) {
            // Mock API simulation
            await new Promise(resolve => setTimeout(resolve, 100))

            // Mark messages as read in mock data
            if (mockApiMessages[threadId]) {
                mockApiMessages[threadId].forEach(msg => {
                    if (!msg.is_read && msg.sender_id !== 'employer-1') {
                        msg.is_read = true
                        msg.read_at = new Date().toISOString()
                    }
                })
            }
        } else {
            // Real API call
            await api.conversations.markAsRead(threadId)
        }
    } catch (error) {
        console.error('Failed to mark messages as read:', error)
    }
}

export async function getCandidateById(candidateId: string): Promise<Candidate | undefined> {
    // Find candidate from conversations data
    const conversation = mockApiConversations.find(c => c.otherUser?.id === candidateId)
    if (conversation && conversation.otherUser) {
        return {
            id: conversation.otherUser.id || candidateId,
            name: conversation.otherUser.full_name || conversation.otherUser.email || 'Unknown User',
            title: conversation.job?.title || 'Candidate',
            avatar: conversation.otherUser.avatar_url || '',
            profileUrl: `/candidates/${candidateId}`
        }
    }

    // Final fallback
    return {
        id: candidateId,
        name: 'Unknown User',
        title: 'Candidate',
        avatar: '',
        profileUrl: `/candidates/${candidateId}`
    }
}