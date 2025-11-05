import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Building2, Users, CheckCircle2, ArrowRight } from "lucide-react"

interface Employer {
    id: string
    user_id: string
    company_name: string
    company_website: string | null
    company_logo: string | null
    company_description: string | null
    industry: string | null
    company_size: string | null
    is_verified: boolean
    jobs_count?: number
}

interface EmployerCardProps {
    employer: Employer
}

export function EmployerCard({ employer }: EmployerCardProps) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
    }

    const getRandomColor = () => {
        const colors = ["bg-indigo-500", "bg-blue-500", "bg-teal-500", "bg-purple-500", "bg-cyan-500"]
        return colors[Math.floor(Math.random() * colors.length)]
    }

    return (
        <Card className="p-6 hover:shadow-xl transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary group">
            <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="flex-shrink-0">
                    {employer.company_logo ? (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 relative">
                            <Image
                                src={employer.company_logo}
                                alt={employer.company_name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div
                            className={`w-16 h-16 rounded-lg ${getRandomColor()} flex items-center justify-center text-white text-xl font-bold`}
                        >
                            {getInitials(employer.company_name)}
                        </div>
                    )}
                </div>

                {/* Company Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                                {employer.company_name}
                            </h3>
                            {employer.is_verified && (
                                <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                        </div>
                    </div>

                    {employer.industry && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                            <Building2 className="w-4 h-4" />
                            <span>{employer.industry}</span>
                        </div>
                    )}

                    {employer.company_description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {employer.company_description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 items-center justify-between">
                        <div className="flex flex-wrap gap-2 items-center">
                            {employer.company_size && (
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                                    <Users className="w-3 h-3 mr-1" />
                                    {employer.company_size}
                                </Badge>
                            )}
                            {employer.jobs_count !== undefined && employer.jobs_count > 0 && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                                    {employer.jobs_count} {employer.jobs_count === 1 ? "Job" : "Jobs"}
                                </Badge>
                            )}
                            {employer.is_verified && (
                                <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-50">
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <Link href={`/browse-employers/${employer.id}`} className="flex-shrink-0">
                            <Button size="sm" className="min-w-[140px] group-hover:bg-primary group-hover:text-primary-foreground">
                                View Employer
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </Card>
    )
}
