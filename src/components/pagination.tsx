"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
     currentPage?: number
     totalPages?: number
     onPageChange?: (page: number) => void
}

export function Pagination({ currentPage = 1, totalPages = 33, onPageChange }: PaginationProps) {
     const pages = [1, 2, 3, 4, 5]

     return (
          <div className="flex items-center justify-center gap-1">
               <Button variant="ghost" size="icon" className="w-9 h-9" disabled={currentPage === 1}>
                    <ChevronLeft className="w-4 h-4" />
               </Button>

               {pages.map((page) => (
                    <Button
                         key={page}
                         variant={currentPage === page ? "default" : "ghost"}
                         size="icon"
                         className={`w-9 h-9 ${currentPage === page ? "bg-indigo-600 hover:bg-indigo-700 text-white" : ""}`}
                         onClick={() => onPageChange?.(page)}
                    >
                         {page}
                    </Button>
               ))}

               <span className="px-2 text-sm text-muted-foreground">...</span>

               <Button variant="ghost" size="icon" className="w-9 h-9" onClick={() => onPageChange?.(totalPages)}>
                    {totalPages}
               </Button>

               <Button variant="ghost" size="icon" className="w-9 h-9" disabled={currentPage === totalPages}>
                    <ChevronRight className="w-4 h-4" />
               </Button>
          </div>
     )
}
