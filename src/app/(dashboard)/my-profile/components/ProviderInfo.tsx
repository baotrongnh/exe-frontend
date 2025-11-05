"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Identity {
    identity_id: string
    provider: string
    email: string
    full_name: string
    avatar_url: string
    last_sign_in_at: string
    created_at: string
}

interface ProviderInfoProps {
    identities: Identity[]
    providers: string[]
}

export function ProviderInfo({ identities, providers }: ProviderInfoProps) {
    const getProviderIcon = (provider: string) => {
        const icons: Record<string, string> = {
            google: "https://www.google.com/favicon.ico",
            github: "https://github.com/favicon.ico",
            facebook: "https://www.facebook.com/favicon.ico",
        }
        return icons[provider] || null
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Authentication Providers</h2>

            <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Connected Providers:</span>
                    <div className="flex gap-2">
                        {providers.map((provider) => (
                            <Badge
                                key={provider}
                                variant="secondary"
                                className="bg-blue-100 text-blue-700 hover:bg-blue-200 capitalize"
                            >
                                {provider}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Provider Details</h3>
                {identities.map((identity) => (
                    <div
                        key={identity.identity_id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start gap-4">
                            {getProviderIcon(identity.provider) && (
                                <Image
                                    src={getProviderIcon(identity.provider)!}
                                    alt={identity.provider}
                                    width={24}
                                    height={24}
                                    className="mt-1"
                                />
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-gray-900 capitalize">{identity.provider}</h4>
                                    <Badge variant="outline" className="text-xs">
                                        Active
                                    </Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-600">
                                        <span className="font-medium">Name:</span> {identity.full_name}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Email:</span> {identity.email}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Connected:</span> {formatDateTime(identity.created_at)}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">Last Used:</span> {formatDateTime(identity.last_sign_in_at)}
                                    </p>
                                </div>
                            </div>
                            {identity.avatar_url && (
                                <Image
                                    src={identity.avatar_url}
                                    alt={identity.full_name}
                                    width={48}
                                    height={48}
                                    className="rounded-full"
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}
