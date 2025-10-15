"use client"

import { useEffect, useRef, useCallback } from "react"
import { Message } from "./types"

interface ScrollManagerProps {
    messages: Message[]
    threadId: string
    isSending?: boolean
    onScrollToBottom?: () => void
}

export function useScrollManager({ messages, threadId, isSending = false, onScrollToBottom }: ScrollManagerProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const isUserScrollingRef = useRef(false)
    const previousMessageCountRef = useRef(messages.length)
    const previousThreadIdRef = useRef(threadId)
    const justSentMessageRef = useRef(false)
    const shouldMaintainBottomRef = useRef(false)
    const isThreadSwitchingRef = useRef(false)

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth", force = false) => {
        const performScroll = () => {
            if (messagesContainerRef.current) {
                const container = messagesContainerRef.current
                if (force || behavior === "auto") {
                    // For instant scrolling, use scrollTop
                    container.scrollTop = container.scrollHeight
                } else {
                    // For smooth scrolling, use scrollIntoView on the end element
                    if (messagesEndRef.current) {
                        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' })
                    }
                }
            }
        }

        if (force || behavior === "auto") {
            // For force scroll, try multiple times to ensure it works
            performScroll()
            setTimeout(performScroll, 10)
            setTimeout(performScroll, 50)
        } else {
            performScroll()
        }

        onScrollToBottom?.()
    }, [onScrollToBottom])

    // Check if user is near the bottom of the conversation
    const isNearBottom = useCallback(() => {
        if (!messagesContainerRef.current) return true

        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
        const threshold = 100 // pixels from bottom
        return scrollHeight - scrollTop - clientHeight < threshold
    }, [])

    // Handle scroll events to detect user scrolling
    const handleScroll = useCallback(() => {
        if (!messagesContainerRef.current) return

        // If user manually scrolled away from bottom, mark as user scrolling
        if (!isNearBottom()) {
            isUserScrollingRef.current = true
        } else {
            isUserScrollingRef.current = false
        }
    }, [isNearBottom])

    // Add scroll event listener
    useEffect(() => {
        const container = messagesContainerRef.current
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true })
            return () => container.removeEventListener('scroll', handleScroll)
        }
    }, [handleScroll])

    // Handle sending state changes
    useEffect(() => {
        if (isSending) {
            // When starting to send, mark that we just sent a message
            justSentMessageRef.current = true
            shouldMaintainBottomRef.current = true
        }
    }, [isSending])

    // Handle thread switching - scroll to bottom when thread changes
    useEffect(() => {
        if (previousThreadIdRef.current !== threadId) {
            // Mark that we're switching threads
            isThreadSwitchingRef.current = true

            // Reset all flags
            isUserScrollingRef.current = false
            justSentMessageRef.current = false
            shouldMaintainBottomRef.current = false

            previousThreadIdRef.current = threadId
            previousMessageCountRef.current = 0 // Reset to 0 to trigger initial load behavior

            // Don't scroll immediately, let the message loading handle it
            return
        }
    }, [threadId, messages.length])

    // Handle message updates
    useEffect(() => {
        // Skip if thread just changed (handled above)
        if (previousThreadIdRef.current !== threadId) {
            return
        }

        const currentMessageCount = messages.length
        const previousMessageCount = previousMessageCountRef.current

        if (currentMessageCount === 0) {
            return
        }

        // For new messages (count increased)
        if (currentMessageCount > previousMessageCount) {
            const lastMessage = messages[messages.length - 1]
            const isOwnMessage = lastMessage?.senderType === 'employer'

            // If it's our own message or we're already at the bottom, scroll down
            if (isOwnMessage || (!isUserScrollingRef.current || isNearBottom())) {
                if (isOwnMessage) {
                    // For own messages, scroll immediately and maintain position
                    justSentMessageRef.current = true
                    scrollToBottom("auto", true)
                } else {
                    // For received messages, smooth scroll
                    scrollToBottom("smooth")
                }
            }
        }
        // For initial load or when count goes from 0 to positive
        else if (previousMessageCount === 0 && currentMessageCount > 0) {
            // Initial load - go to bottom, with longer delay if switching threads
            const delay = isThreadSwitchingRef.current ? 300 : 150
            setTimeout(() => {
                scrollToBottom("auto", true)
                isThreadSwitchingRef.current = false // Reset flag after scrolling
            }, delay)
        }
        // Handle potential message content changes (same count but different content)
        else if (currentMessageCount === previousMessageCount && (justSentMessageRef.current || isSending)) {
            // Message content updated after sending - maintain bottom position
            setTimeout(() => {
                scrollToBottom("auto", true)
                justSentMessageRef.current = false
            }, 100)
        }

        previousMessageCountRef.current = currentMessageCount
    }, [messages, threadId, isSending, isNearBottom, scrollToBottom])

    return {
        messagesEndRef,
        messagesContainerRef,
        scrollToBottom: (behavior: ScrollBehavior = "smooth") => scrollToBottom(behavior, false)
    }
}