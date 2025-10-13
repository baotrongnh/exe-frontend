import { api } from '@/lib/api'
import { MessageThread, Message, Candidate, ApiConversation, ApiMessage } from './types'

// Environment flag to switch between mock and real API
const USE_MOCK_API = true // Set to false when backend is ready

// Mock data for development
const mockApiConversations: ApiConversation[] = [
    {
        id: '1',
        otherUser: {
            id: '1',
            name: 'Jan Mayer',
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
            name: 'Joe Bartmann',
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
            name: 'Ally Wales',
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
            updated_at: '2023-10-12T14:00:00Z',
            sender: {
                id: 'employer-1',
                name: 'Maria Rodriguez',
                avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
            }
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
            updated_at: '2023-10-12T14:30:00Z',
            sender: {
                id: '1',
                name: 'Jan Mayer',
                avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
            }
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
            updated_at: '2023-10-12T15:00:00Z',
            sender: {
                id: 'employer-1',
                name: 'Maria Rodriguez',
                avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face&auto=format'
            }
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
            updated_at: '2023-10-12T15:30:45Z',
            sender: {
                id: '1',
                name: 'Jan Mayer',
                avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format'
            }
        }
    ]
}

// Utility functions to transform API data to UI format
function transformConversationToThread(conversation: ApiConversation): MessageThread {
    const unreadCount = conversation.lastMessage.is_read ? 0 : 1

    return {
        id: conversation.id,
        candidateId: conversation.otherUser.id,
        candidateName: conversation.otherUser.name,
        candidateTitle: conversation.job?.title || 'Candidate',
        candidateAvatar: conversation.otherUser.avatar_url,
        lastMessage: conversation.lastMessage.content,
        timestamp: formatTimestamp(conversation.lastMessage.created_at),
        unreadCount
    }
}

function transformMessageToUI(message: ApiMessage, currentUserId: string = 'employer-1'): Message {
    return {
        id: message.id,
        threadId: message.conversation_id,
        senderId: message.sender_id,
        senderType: message.sender_id === currentUserId ? 'employer' : 'candidate',
        content: message.content,
        timestamp: formatTimestamp(message.created_at),
        isRead: message.is_read
    }
}

function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
        const diffInMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
        return `${diffInMins} mins ago`
    } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`
    } else {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
}

// Main API functions that can use either mock or real API
export async function getMessageThreads(): Promise<MessageThread[]> {
    try {
        if (USE_MOCK_API) {
            // Mock API simulation
            await new Promise(resolve => setTimeout(resolve, 300))
            return mockApiConversations.map(transformConversationToThread)
        } else {
            // Real API call
            const response = await api.conversations.getAll()
            return response.data.map(transformConversationToThread)
        }
    } catch (error) {
        console.error('Failed to get message threads:', error)
        // Fallback to mock data
        return mockApiConversations.map(transformConversationToThread)
    }
}

export async function getMessagesByThreadId(threadId: string): Promise<Message[]> {
    try {
        if (USE_MOCK_API) {
            // Mock API simulation
            await new Promise(resolve => setTimeout(resolve, 200))
            const mockMessages = mockApiMessages[threadId] || []
            return mockMessages.map(msg => transformMessageToUI(msg))
        } else {
            // Real API call
            const response = await api.conversations.getMessages(threadId)
            return response.data.map((msg: ApiMessage) => transformMessageToUI(msg))
        }
    } catch (error) {
        console.error('Failed to get messages for thread:', threadId, error)
        // Fallback to mock data
        const mockMessages = mockApiMessages[threadId] || []
        return mockMessages.map(msg => transformMessageToUI(msg))
    }
}

export async function sendMessage(threadId: string, content: string): Promise<Message> {
    try {
        if (USE_MOCK_API) {
            // Mock API simulation
            await new Promise(resolve => setTimeout(resolve, 500))

            const newMessage: ApiMessage = {
                id: `${threadId}-${Date.now()}`,
                conversation_id: threadId,
                sender_id: 'employer-1',
                message_type: 'text',
                content,
                file_url: null,
                is_read: true,
                read_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                sender: {
                    id: 'employer-1',
                    name: 'You',
                    avatar_url: ''
                }
            }

            // Add to mock data
            if (!mockApiMessages[threadId]) {
                mockApiMessages[threadId] = []
            }
            mockApiMessages[threadId].push(newMessage)

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

            return transformMessageToUI(newMessage)
        } else {
            // Real API call
            const response = await api.conversations.sendMessage(threadId, { content })
            return transformMessageToUI(response.data)
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

export function getCandidateById(candidateId: string): Candidate | undefined {
    // Find candidate from conversations data
    const conversation = mockApiConversations.find(c => c.otherUser.id === candidateId)
    if (conversation) {
        return {
            id: conversation.otherUser.id,
            name: conversation.otherUser.name,
            title: conversation.job?.title || 'Candidate',
            avatar: conversation.otherUser.avatar_url,
            profileUrl: `/candidates/${candidateId}`
        }
    }
    return undefined
}