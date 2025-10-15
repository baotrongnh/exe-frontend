"use client"

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { supabase } from '@/lib/supabase'
import { ApiMessage } from '../components/types'

interface UseChatOptions {
    enabled?: boolean
    onNewMessage?: (message: ApiMessage) => void
    onMessageNotification?: (data: { conversationId: string; message: ApiMessage }) => void
    onMessagesRead?: (data: { conversationId: string; userId: string; timestamp: string }) => void
    onTyping?: (data: { conversationId: string; userId: string; isTyping: boolean }) => void
    onError?: (error: { message: string }) => void
}

export function useChat(options: UseChatOptions = {}) {
    const {
        enabled = true,
        onNewMessage,
        onMessageNotification,
        onMessagesRead,
        onTyping,
        onError
    } = options

    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const socketRef = useRef<Socket | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Use refs for callbacks to avoid recreating socket connection
    const callbacksRef = useRef({
        onNewMessage,
        onMessageNotification,
        onMessagesRead,
        onTyping,
        onError
    })

    // Update callbacks ref when they change
    useEffect(() => {
        callbacksRef.current = {
            onNewMessage,
            onMessageNotification,
            onMessagesRead,
            onTyping,
            onError
        }
    }, [onNewMessage, onMessageNotification, onMessagesRead, onTyping, onError])

    // Initialize socket connection
    useEffect(() => {
        if (!enabled) return

        const initializeSocket = async () => {
            try {
                // Get current session
                const { data: { session } } = await supabase.auth.getSession()

                if (!session?.access_token) {
                    console.log('No authentication token found - running in guest mode')
                    setConnectionError('Not authenticated - real-time features disabled')
                    return
                }

                // Extract user ID from token
                let userId, payload
                try {
                    payload = JSON.parse(atob(session.access_token.split('.')[1]))
                    // Backend expects decoded.id, but JWT uses sub, so we need to check both
                    userId = payload.id || payload.sub || payload.userId
                    console.log('🔐 Complete token payload:', payload)
                    console.log('🔐 Token payload analysis:', {
                        id: payload.id,
                        sub: payload.sub,
                        userId: payload.userId,
                        extractedUserId: userId,
                        aud: payload.aud,
                        exp: payload.exp,
                        isExpired: payload.exp < Math.floor(Date.now() / 1000),
                        // Show all keys in the payload
                        allKeys: Object.keys(payload)
                    })
                    setCurrentUserId(userId)

                    if (!userId) {
                        console.error('❌ No user ID found in token - id, sub, and userId are all missing')
                        setConnectionError('Invalid token - missing user ID')
                        return
                    }
                } catch (e) {
                    console.error('Error parsing token:', e)
                    setConnectionError('Invalid token format')
                    return
                }                // Initialize socket connection with better configuration
                // Use the specified chat server
                const socketUrl = 'http://14.169.93.37:3003' // Chat server URL
                const serverMode = 'production'

                console.log('🔌 Environment detection:', {
                    origin: window.location.origin,
                    nodeEnv: process.env.NODE_ENV,
                    serverMode,
                    socketUrl
                })
                console.log('🔌 Connecting to Socket.IO server:', socketUrl, `(${serverMode} mode)`)
                console.log('🔑 Using token (first 50 chars):', session.access_token.substring(0, 50) + '...')
                console.log('🔑 Token being sent in multiple ways:', {
                    auth: { token: session.access_token.substring(0, 30) + '...' },
                    query: { token: session.access_token.substring(0, 30) + '...' },
                    headers: { Authorization: `Bearer ${session.access_token.substring(0, 30)}...` }
                })

                // Test if the token works with regular API calls first
                try {
                    const testResponse = await fetch(`${socketUrl}/api/conversations`, {
                        headers: {
                            'Authorization': `Bearer ${session.access_token}`
                        }
                    })
                    console.log('🧪 Token test result:', testResponse.status, testResponse.statusText)
                    if (testResponse.status === 401 || testResponse.status === 403) {
                        console.error('🔑 Token authentication failed with regular API - Socket.IO will likely fail too')
                        setConnectionError('Token authentication failed - please refresh and login again')
                        return
                    }
                } catch (tokenTestError) {
                    console.warn('🧪 Token test failed (network issue?):', tokenTestError)
                }

                const socketInstance = io(socketUrl, {
                    auth: {
                        token: session.access_token
                    },
                    autoConnect: true,
                    timeout: serverMode === 'production' ? 20000 : 10000, // Longer timeout for production
                    reconnection: true,
                    reconnectionAttempts: serverMode === 'production' ? 3 : 5, // Fewer attempts for production
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000,
                    forceNew: true, // Force new connection to prevent conflicts
                    transports: ['websocket', 'polling'] // Ensure compatibility
                })

                socketRef.current = socketInstance
                setSocket(socketInstance)

                // Connection event handlers
                socketInstance.on('connect', () => {
                    console.log('✅ Connected to chat server')
                    console.log('Socket ID:', socketInstance.id)
                    setIsConnected(true)
                    setConnectionError(null)
                })

                socketInstance.on('connect_error', (error: Error) => {
                    console.error('❌ Socket connection error:', error)
                    console.error('Error details:', {
                        message: error.message,
                        stack: error.stack,
                        name: error.name,
                        socketUrl: socketUrl,
                        tokenPreview: session.access_token.substring(0, 50) + '...'
                    })
                    setIsConnected(false)
                    let errorMessage = 'Connection failed'

                    if (error.message.includes('Authentication') || error.message.includes('Unauthorized') || error.message.includes('Invalid') || error.message.includes('token')) {
                        errorMessage = 'Authentication failed - please refresh and login again'
                        console.error('🔑 Authentication error details:', {
                            tokenValid: !!session.access_token,
                            tokenLength: session.access_token?.length,
                            userIdFromToken: userId,
                            isTokenExpired: payload.exp < Math.floor(Date.now() / 1000)
                        })
                    } else if (error.message.includes('timeout')) {
                        errorMessage = 'Server timeout - retrying...'
                    } else if (error.message.includes('ECONNREFUSED') || error.message.includes('Failed to fetch')) {
                        errorMessage = 'Server offline - check backend'
                    } else if (error.message.includes('xhr poll error')) {
                        errorMessage = 'Network issue - retrying...'
                    } else if (error.message.includes('CORS')) {
                        errorMessage = 'CORS policy blocking connection'
                    }

                    setConnectionError(errorMessage)
                    callbacksRef.current.onError?.({ message: errorMessage })
                })

                socketInstance.on('disconnect', (reason) => {
                    console.log('Disconnected from chat server:', reason)
                    setIsConnected(false)

                    if (reason === 'io server disconnect') {
                        // Server disconnected us, try to reconnect
                        socketInstance.connect()
                    }
                })

                socketInstance.on('reconnect', (attemptNumber) => {
                    console.log('Reconnected to chat server after', attemptNumber, 'attempts')
                    setIsConnected(true)
                    setConnectionError(null)
                })

                socketInstance.on('reconnect_attempt', (attemptNumber) => {
                    console.log('Attempting to reconnect...', attemptNumber)
                    setConnectionError(`Reconnecting... (${attemptNumber}/5)`)
                })

                socketInstance.on('reconnect_failed', () => {
                    console.log('Failed to reconnect to chat server')
                    setConnectionError('Connection failed - please refresh the page')
                })

                // Chat event handlers
                socketInstance.on('new_message', (message: ApiMessage) => {
                    console.log('📨 New message received via Socket.IO:', message)
                    console.log('Current user ID:', currentUserId)
                    console.log('Socket ID:', socketInstance.id)
                    callbacksRef.current.onNewMessage?.(message)
                })

                socketInstance.on('message_notification', (data: { conversationId: string; message: ApiMessage }) => {
                    console.log('🔔 Message notification:', data)
                    callbacksRef.current.onMessageNotification?.(data)
                })

                socketInstance.on('messages_read', (data: { conversationId: string; userId: string; timestamp: string }) => {
                    console.log('Messages read:', data)
                    callbacksRef.current.onMessagesRead?.(data)
                })

                socketInstance.on('typing', (data: { conversationId: string; userId: string; isTyping: boolean }) => {
                    console.log('Typing event:', data)
                    callbacksRef.current.onTyping?.(data)
                })

                socketInstance.on('error', (error: { message: string }) => {
                    console.error('Socket error:', error)
                    setConnectionError(error.message)
                    callbacksRef.current.onError?.(error)
                })

            } catch (error) {
                console.error('Failed to initialize socket:', error)
                setConnectionError('Failed to initialize chat connection')
            }
        }

        initializeSocket()

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                console.log('Cleaning up socket connection')
                socketRef.current.disconnect()
                socketRef.current = null
            }
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }
        }
        // ESLint disable for intentionally limited dependencies - we only want to initialize once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled]) // Only depend on enabled to prevent multiple connections

    // Send message function
    const sendMessage = (conversationId: string, content: string, messageType: string = 'text', fileUrl?: string, messageId?: string) => {
        if (!socket || !isConnected) {
            console.error('❌ Socket not connected - cannot send message')
            console.log('Socket state:', { hasSocket: !!socket, isConnected })
            return false
        }

        try {
            console.log('📤 Broadcasting message via Socket.IO:', {
                conversationId,
                content,
                messageType,
                messageId,
                socketId: socket.id
            })

            socket.emit('send_message', {
                conversationId,
                content,
                messageType,
                fileUrl,
                messageId // Include messageId for backend to broadcast existing message
            })

            console.log('✅ Message broadcasted successfully')
            return true
        } catch (error) {
            console.error('❌ Error broadcasting message via Socket.IO:', error)
            return false
        }
    }

    // Mark messages as read function
    const markMessagesAsRead = (conversationId: string) => {
        if (!socket || !isConnected) {
            console.error('Socket not connected')
            return false
        }

        try {
            socket.emit('mark_read', {
                conversationId
            })
            return true
        } catch (error) {
            console.error('Error marking messages as read:', error)
            return false
        }
    }

    // Typing indicator functions
    const startTyping = (conversationId: string) => {
        if (!socket || !isConnected) return false

        socket.emit('typing_start', { conversationId })

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        // Auto-stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
            stopTyping(conversationId)
        }, 3000)

        return true
    }

    const stopTyping = (conversationId: string) => {
        if (!socket || !isConnected) return false

        socket.emit('typing_end', { conversationId })

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            typingTimeoutRef.current = null
        }

        return true
    }

    // Reconnect function
    const reconnect = () => {
        if (socketRef.current) {
            console.log('Manually reconnecting socket...')
            setConnectionError('Reconnecting...')
            socketRef.current.connect()
        } else {
            console.log('No socket instance available for reconnection')
            setConnectionError('Connection lost - please refresh the page')
        }
    }

    // Manual disconnect function
    const disconnect = () => {
        if (socketRef.current) {
            console.log('Manually disconnecting socket...')
            socketRef.current.disconnect()
        }
    }

    return {
        socket,
        isConnected,
        connectionError,
        currentUserId,
        sendMessage,
        markMessagesAsRead,
        startTyping,
        stopTyping,
        reconnect,
        disconnect
    }
}