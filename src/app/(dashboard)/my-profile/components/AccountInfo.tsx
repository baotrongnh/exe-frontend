"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle } from "lucide-react"

interface AccountInfoProps {
    user: {
        id: string
        email: string
        email_confirmed_at: string
        phone: string
        last_sign_in_at: string
        created_at: string
    }
}

export function AccountInfo({ user }: AccountInfoProps) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const infoItems = [
        {
            label: "User ID",
            value: user.id,
            icon: null,
        },
        {
            label: "Email Address",
            value: user.email,
            icon: user.email_confirmed_at ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
                <XCircle className="w-4 h-4 text-red-500" />
            ),
            status: user.email_confirmed_at ? "Verified" : "Not Verified",
        },
        {
            label: "Phone Number",
            value: user.phone || "Not provided",
            icon: null,
        },
        {
            label: "Last Sign In",
            value: formatDateTime(user.last_sign_in_at),
            icon: null,
        },
        {
            label: "Account Created",
            value: formatDateTime(user.created_at),
            icon: null,
        },
    ]

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Account Information</h2>

            <div className="space-y-4">
                {infoItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0"
                    >
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500 mb-1">{item.label}</p>
                            <p className="text-sm text-gray-900 break-all">{item.value}</p>
                        </div>
                        {item.icon && (
                            <div className="flex items-center gap-2 ml-4">
                                {item.icon}
                                <span className="text-sm font-medium text-gray-600">{item.status}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}
