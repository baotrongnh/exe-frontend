import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JobsPaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export function JobsPagination({ currentPage, totalPages, onPageChange }: JobsPaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="ghost"
                size="icon"
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="w-10 h-10"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "ghost"}
                    className={
                        currentPage === pageNum
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 min-w-[40px] h-10"
                            : "min-w-[40px] h-10"
                    }
                    onClick={() => onPageChange(pageNum)}
                >
                    {pageNum}
                </Button>
            ))}

            <Button
                variant="ghost"
                size="icon"
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="w-10 h-10"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </div>
    )
}
