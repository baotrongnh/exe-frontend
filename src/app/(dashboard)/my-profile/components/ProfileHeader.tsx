"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, Shield } from "lucide-react"

interface ProfileHeaderProps {
    user: {
        id: string
        email: string
        full_name: string
        avatar_url: string
        email_confirmed_at: string
        created_at: string
        provider: string
    }
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    return (
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between">
                <div className="flex gap-6">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                        <AvatarImage src={user.avatar_url} alt={user.full_name} />
                        <AvatarFallback className="bg-white text-blue-600 text-2xl font-bold">
                            {getInitials(user.full_name)}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h1 className="text-3xl font-bold mb-2">{user.full_name}</h1>
                        <div className="flex items-center gap-2 mb-3">
                            <Mail className="w-4 h-4" />
                            <span className="text-blue-100">{user.email}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified Account
                            </Badge>
                            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 capitalize">
                                {user.provider} Login
                            </Badge>
                        </div>
                    </div>
                </div>

                <Button variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
                    Edit Profile
                </Button>
            </div>

            <div className="mt-6 flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-blue-100">Joined {formatDate(user.created_at)}</span>
                </div>
            </div>
        </div>
    )
}
