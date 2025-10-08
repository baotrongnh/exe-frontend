"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface FilterSection {
     title: string
     items: { label: string; count?: number; checked?: boolean }[]
}

const filterSections: FilterSection[] = [
     {
          title: "Type of Employment",
          items: [
               { label: "Part-Time", count: 5 },
               { label: "Remote", count: 9 },
               { label: "Internship", count: 24 },
               { label: "Contract", count: 3 },
          ],
     },
     {
          title: "Categories",
          items: [
               { label: "Design", count: 24 },
               { label: "Sales", count: 3 },
               { label: "Marketing", count: 3 },
               { label: "Business", count: 3, checked: true },
               { label: "Human Resource", count: 6 },
               { label: "Finance", count: 4 },
               { label: "Engineering", count: 4 },
               { label: "Technology", count: 6, checked: true },
          ],
     },
     {
          title: "Job Level",
          items: [
               { label: "Entry Level", count: 57 },
               { label: "Mid Level", count: 3 },
               { label: "Senior Level", count: 5 },
               { label: "Director", count: 12, checked: true },
               { label: "VP or Above", count: 8 },
          ],
     },
     {
          title: "Salary Range",
          items: [
               { label: "$700 - $1000", count: 4 },
               { label: "$100 - $1500", count: 6 },
               { label: "$1500 - $2000", count: 10 },
               { label: "$3000 or above", count: 4, checked: true },
          ],
     },
]

export function FilterPanel() {
     const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
          "Type of Employment": true,
          Categories: true,
          "Job Level": true,
          "Salary Range": true,
     })

     const toggleSection = (title: string) => {
          setExpandedSections((prev) => ({
               ...prev,
               [title]: !prev[title],
          }))
     }

     return (
          <div className="w-72 space-y-6">
               {filterSections.map((section) => (
                    <div key={section.title} className="space-y-3">
                         <button
                              onClick={() => toggleSection(section.title)}
                              className="flex items-center justify-between w-full text-left"
                         >
                              <h3 className="font-semibold text-foreground">{section.title}</h3>
                              {expandedSections[section.title] ? (
                                   <ChevronUp className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                   <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                         </button>

                         {expandedSections[section.title] && (
                              <div className="space-y-3">
                                   {section.items.map((item) => (
                                        <div key={item.label} className="flex items-center space-x-2">
                                             <Checkbox id={`${section.title}-${item.label}`} defaultChecked={item.checked} />
                                             <Label
                                                  htmlFor={`${section.title}-${item.label}`}
                                                  className="flex-1 text-sm text-foreground cursor-pointer"
                                             >
                                                  {item.label} {item.count && `(${item.count})`}
                                             </Label>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               ))}
          </div>
     )
}
