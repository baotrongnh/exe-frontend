"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { Message, Candidate } from "./types"

interface ConversationViewProps {
    messages: Message[]
    candidate: Candidate
    onViewProfile: () => void
}

export function ConversationView({ messages, candidate, onViewProfile }: ConversationViewProps) {
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                <div className="text-center text-sm text-gray-500 mb-6">Today</div>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.senderType === 'employer' ? 'justify-end' : 'justify-start'
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

                <div className="text-center text-xs text-gray-500 mt-4">
                    12 mins ago
                </div>

                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No messages yet. Start a conversation!</p>
                    </div>
                )}
            </div>
        </div>
    )
}