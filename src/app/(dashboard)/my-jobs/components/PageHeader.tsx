import { Briefcase } from "lucide-react"

interface PageHeaderProps {
    totalJobs: number
}

export function PageHeader({ totalJobs }: PageHeaderProps) {
    return (
        <header className="bg-card border-b border-border px-8 py-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">My Jobs</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage your job applications and submit deliverables
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{totalJobs}</div>
                        <div className="text-sm text-muted-foreground">Applied Jobs</div>
                    </div>
                </div>
            </div>
        </header>
    )
}
