import { MapPin } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/data/jobs"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Part-Time":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Internship":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Full-Time":
        return "bg-blue-50 text-blue-700 border-blue-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <Link href={`/find-jobs/${job.id}`}>
      <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-end mb-4">
          <Badge variant="outline" className={`${getTypeColor(job.type)} border`}>
            {job.type}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg text-foreground mb-2">{job.title}</h3>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <span>{job.company}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{job.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.categories.map((category) => (
            <Badge key={category} variant="outline" className="border-indigo-200 text-indigo-700">
              {category}
            </Badge>
          ))}
        </div>

        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{job.applied}</span> {job.capacity} capacity
        </div>
      </Card>
    </Link>
  )
}
