"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageThread } from "./types"

interface MessageThreadItemProps {
    thread: MessageThread
    isSelected: boolean
    onClick: () => void
}

export function MessageThreadItem({ thread, isSelected, onClick }: MessageThreadItemProps) {
    const initials = thread.candidateName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()

    return (
        <div
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${isSelected ? 'bg-[#E9EBFD] border-r-4 border-r-[#4640DE]' : 'border-b border-gray-100'
                }`}
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <div className="relative">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={thread.candidateAvatar} alt={thread.candidateName} />
                        <AvatarFallback className="bg-[#E9EBFD] text-[#4640DE] font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    {thread.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#4640DE] rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                                {thread.unreadCount}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold text-sm truncate ${isSelected ? 'text-[#4640DE]' : 'text-gray-900'
                            }`}>
                            {thread.candidateName}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 shrink-0">
                            {thread.timestamp}
                        </span>
                    </div>

                    <p className="text-xs text-gray-600 mb-2 truncate">
                        {thread.candidateTitle}
                    </p>

                    <p className={`text-sm line-clamp-2 ${thread.unreadCount > 0 ? 'font-medium text-gray-900' : 'text-gray-600'
                        }`}>
                        {thread.lastMessage}
                    </p>
                </div>
            </div>
        </div>
    )
}