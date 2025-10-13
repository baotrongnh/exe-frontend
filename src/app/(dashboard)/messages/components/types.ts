// API Response Types (matching the backend API structure)
export interface ApiConversation {
    id: string
    otherUser: {
        id: string
        name: string
        avatar_url: string
    }
    job?: {
        id: string
        title: string
    }
    lastMessage: {
        content: string
        created_at: string
        is_read: boolean
    }
    created_at: string
    updated_at: string
    last_message_at: string
}

export interface ApiMessage {
    id: string
    conversation_id: string
    sender_id: string
    message_type: 'text' | 'image' | 'file' | 'system'
    content: string
    file_url: string | null
    is_read: boolean
    read_at: string | null
    created_at: string
    updated_at: string
    sender: {
        id: string
        name: string
        avatar_url: string
    }
}

// UI Types (for internal component use)
export interface MessageThread {
    id: string
    candidateId: string
    candidateName: string
    candidateTitle: string
    candidateAvatar: string
    lastMessage: string
    timestamp: string
    unreadCount: number
}

export interface Message {
    id: string
    threadId: string
    senderId: string
    senderType: 'employer' | 'candidate'
    content: string
    timestamp: string
    isRead: boolean
}

export interface Candidate {
    id: string
    name: string
    title: string
    avatar: string
    profileUrl: string
}