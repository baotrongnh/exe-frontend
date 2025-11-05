import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: string
        isPositive: boolean
    }
    iconColor?: string
    iconBgColor?: string
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    iconColor = "text-primary",
    iconBgColor = "bg-primary/10"
}: StatsCardProps) {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {trend.value}
                            </span>
                            <span className="text-xs text-muted-foreground">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
            </div>
        </Card>
    )
}
