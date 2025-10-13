"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface MessageInputProps {
    onSendMessage: (message: string) => void
    isLoading?: boolean
    placeholder?: string
}

export function MessageInput({
    onSendMessage,
    isLoading = false,
    placeholder = "Type your message..."
}: MessageInputProps) {
    const [message, setMessage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim() && !isLoading) {
            onSendMessage(message.trim())
            setMessage("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="p-6 border-t border-gray-200 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                <div className="flex-1">
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="min-h-[40px] resize-none border-gray-300 focus:border-[#4640DE] focus:ring-[#4640DE] rounded-lg"
                        disabled={isLoading}
                        rows={1}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={!message.trim() || isLoading}
                    className="bg-[#4640DE] hover:bg-[#4640DE]/90 text-white px-4 py-2 rounded-lg"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    )
}