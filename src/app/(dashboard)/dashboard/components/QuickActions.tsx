import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, MessageSquare, User } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
    const actions = [
        {
            icon: FileText,
            label: "My Applications",
            description: "View all your job applications",
            href: "/my-applications",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            icon: Upload,
            label: "Upload CV",
            description: "Update your resume",
            href: "/my-cv",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            icon: MessageSquare,
            label: "Messages",
            description: "Check your conversations",
            href: "/messages",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            icon: User,
            label: "My Profile",
            description: "Update your information",
            href: "/my-profile",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ]

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {actions.map((action) => {
                    const Icon = action.icon
                    return (
                        <Link key={action.href} href={action.href}>
                            <Button
                                variant="ghost"
                                className="w-full justify-start h-auto p-4 hover:bg-accent"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg ${action.bgColor}`}>
                                        <Icon className={`w-5 h-5 ${action.color}`} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="font-medium text-sm text-foreground">{action.label}</p>
                                        <p className="text-xs text-muted-foreground">{action.description}</p>
                                    </div>
                                </div>
                            </Button>
                        </Link>
                    )
                })}
            </div>
        </Card>
    )
}
