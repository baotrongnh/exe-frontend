"use client"

import LoadingScreen from "@/components/LoadingScreen"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { AccountInfo, ProfileHeader, ProviderInfo } from "./components"

interface UserProfile {
    id: string
    email: string
    full_name: string
    avatar_url: string
    email_confirmed_at: string
    phone: string
    last_sign_in_at: string
    created_at: string
    provider: string
    providers: string[]
    identities: Array<{
        identity_id: string
        provider: string
        email: string
        full_name: string
        avatar_url: string
        last_sign_in_at: string
        created_at: string
    }>
}

export default function MyProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true)
                setError(null)

                // Get user data from Supabase
                const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser()

                if (userError) {
                    throw userError
                }

                if (!supabaseUser) {
                    throw new Error("No user found")
                }

                // Transform Supabase user data to our profile format
                const userProfile: UserProfile = {
                    id: supabaseUser.id,
                    email: supabaseUser.email || "",
                    full_name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || "User",
                    avatar_url: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || "",
                    email_confirmed_at: supabaseUser.email_confirmed_at || "",
                    phone: supabaseUser.phone || "",
                    last_sign_in_at: supabaseUser.last_sign_in_at || "",
                    created_at: supabaseUser.created_at || "",
                    provider: supabaseUser.app_metadata?.provider || "email",
                    providers: supabaseUser.app_metadata?.providers || [supabaseUser.app_metadata?.provider || "email"],
                    identities: (supabaseUser.identities || []).map((identity) => ({
                        identity_id: identity.identity_id || identity.id,
                        provider: identity.provider,
                        email: identity.identity_data?.email || supabaseUser.email || "",
                        full_name: identity.identity_data?.full_name || identity.identity_data?.name || "User",
                        avatar_url: identity.identity_data?.avatar_url || identity.identity_data?.picture || "",
                        last_sign_in_at: identity.last_sign_in_at || identity.updated_at || "",
                        created_at: identity.created_at || "",
                    })),
                }

                setProfile(userProfile)
            } catch (err) {
                console.error("Error fetching user profile:", err)
                setError(err instanceof Error ? err.message : "Failed to load profile")
            } finally {
                setLoading(false)
            }
        }

        if (!authLoading && user) {
            fetchUserProfile()
        }
    }, [user, authLoading])

    if (authLoading || loading) {
        return <LoadingScreen />
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-blue-600 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">No profile data available</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-8 py-8">
                <div className="space-y-6">
                    {/* Profile Header */}
                    <ProfileHeader
                        user={{
                            id: profile.id,
                            email: profile.email,
                            full_name: profile.full_name,
                            avatar_url: profile.avatar_url,
                            email_confirmed_at: profile.email_confirmed_at,
                            created_at: profile.created_at,
                            provider: profile.provider,
                        }}
                    />

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Account Info */}
                        <AccountInfo
                            user={{
                                id: profile.id,
                                email: profile.email,
                                email_confirmed_at: profile.email_confirmed_at,
                                phone: profile.phone,
                                last_sign_in_at: profile.last_sign_in_at,
                                created_at: profile.created_at,
                            }}
                        />

                        {/* Provider Info */}
                        <ProviderInfo identities={profile.identities} providers={profile.providers} />
                    </div>


                </div>
            </div>
        </div>
    )
}
