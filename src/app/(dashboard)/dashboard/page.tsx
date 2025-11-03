"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { WelcomeCard, StatsCard, QuickActions, RecentActivity } from "./components"
import { FileText, CheckCircle, Clock, Loader2, Briefcase } from "lucide-react"

interface UserData {
    id: string
    email: string
    user_metadata: {
        full_name?: string
        avatar_url?: string
        name?: string
    }
}

export default function DashboardPage() {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: userData }, error } = await supabase.auth.getUser()

                if (error) {
                    console.error("Error fetching user:", error)
                    return
                }

                if (userData) {
                    setUser(userData as UserData)
                }
            } catch (err) {
                console.error("Error:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User"
    const userEmail = user?.email || ""
    const userAvatar = user?.user_metadata?.avatar_url || null

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Welcome Card */}
                <WelcomeCard
                    userName={userName}
                    userEmail={userEmail}
                    userAvatar={userAvatar}
                />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Total Applications"
                        value={0}
                        icon={FileText}
                        description="Applications submitted"
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-50"
                    />
                    <StatsCard
                        title="In Progress"
                        value={0}
                        icon={Clock}
                        description="Pending review"
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-50"
                    />
                    <StatsCard
                        title="Accepted"
                        value={0}
                        icon={CheckCircle}
                        description="Successful applications"
                        iconColor="text-green-600"
                        iconBgColor="bg-green-50"
                    />
                    <StatsCard
                        title="Jobs Available"
                        value="100+"
                        icon={Briefcase}
                        description="New opportunities"
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-50"
                    />
                </div>

                {/* Quick Actions and Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <QuickActions />
                    <RecentActivity />
                </div>
            </div>
        </div>
    )
}
