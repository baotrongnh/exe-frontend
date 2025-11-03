import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
    onBecomeEmployer: () => void
}

export function PageHeader({ onBecomeEmployer }: PageHeaderProps) {
    return (
        <header className="bg-card border-b border-border px-8 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Find Jobs</h1>
                <div className="flex items-center gap-3">
                    <Button onClick={onBecomeEmployer} className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[160px]">
                        Become Employer
                    </Button>
                    <Button variant="ghost" size="icon" className="w-10 h-10">
                        <Bell className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </header>
    )
}
