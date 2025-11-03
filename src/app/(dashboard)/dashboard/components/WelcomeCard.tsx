import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Briefcase } from "lucide-react"
import Link from "next/link"

interface WelcomeCardProps {
    userName: string
    userEmail: string
    userAvatar?: string | null
}

export function WelcomeCard({ userName, userEmail, userAvatar }: WelcomeCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Good Morning"
        if (hour < 18) return "Good Afternoon"
        return "Good Evening"
    }

    return (
        <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                        {userAvatar ? (
                            <AvatarImage src={userAvatar} alt={userName} />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {getInitials(userName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground mb-1">
                            {getGreeting()}, {userName}!
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            {userEmail}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                            Ready to find your next opportunity? Explore jobs and connect with employers.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/find-jobs">
                                <Button className="gap-2">
                                    <Search className="w-4 h-4" />
                                    Find Jobs
                                </Button>
                            </Link>
                            <Link href="/browse-employers">
                                <Button variant="outline" className="gap-2">
                                    <Briefcase className="w-4 h-4" />
                                    Browse Employers
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
