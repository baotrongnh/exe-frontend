import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, MessageSquare, Briefcase } from "lucide-react"

interface Activity {
    id: string
    type: "application" | "message" | "profile"
    title: string
    description: string
    time: string
    status?: "pending" | "viewed" | "accepted" | "rejected"
}

export function RecentActivity() {
    // Placeholder data - will be replaced with real API data
    const activities: Activity[] = [
        {
            id: "1",
            type: "application",
            title: "Applied to Frontend Developer",
            description: "Your application has been submitted",
            time: "2 hours ago",
            status: "pending"
        },
        {
            id: "2",
            type: "message",
            title: "New message from ABC Company",
            description: "We would like to schedule an interview",
            time: "5 hours ago",
        },
        {
            id: "3",
            type: "application",
            title: "Application Viewed",
            description: "Your application for UX Designer was viewed",
            time: "1 day ago",
            status: "viewed"
        },
    ]

    const getIcon = (type: string) => {
        switch (type) {
            case "application":
                return FileText
            case "message":
                return MessageSquare
            case "profile":
                return Briefcase
            default:
                return Clock
        }
    }

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700"
            case "viewed":
                return "bg-blue-100 text-blue-700"
            case "accepted":
                return "bg-green-100 text-green-700"
            case "rejected":
                return "bg-red-100 text-red-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                ) : (
                    activities.map((activity) => {
                        const Icon = getIcon(activity.type)
                        return (
                            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                    <Icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="font-medium text-sm text-foreground">{activity.title}</p>
                                        {activity.status && (
                                            <Badge variant="secondary" className={`text-xs ${getStatusColor(activity.status)}`}>
                                                {activity.status}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </Card>
    )
}
