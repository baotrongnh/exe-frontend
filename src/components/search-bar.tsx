"use client"

import { Search, MapPin, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
     onSearch?: (keyword: string, location: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
     return (
          <div className="space-y-4">
               <div className="flex gap-3">
                    {/* Job Title Input */}
                    <div className="flex-1 relative">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                         <Input placeholder="Job title or keyword" className="pl-10 h-12 bg-background" />
                    </div>

                    {/* Location Dropdown */}
                    <div className="w-64 relative">
                         <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                         <button className="w-full h-12 pl-10 pr-10 bg-background border border-input rounded-lg text-left text-sm flex items-center justify-between hover:bg-accent transition-colors">
                              <span className="text-foreground">Florence, Italy</span>
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                         </button>
                    </div>

                    {/* Search Button */}
                    <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white">Search</Button>
               </div>

               {/* Popular Searches */}
               <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Popular :</span>
                    <div className="flex gap-2">
                         {["UI Designer", "UX Researcher", "Android", "Admin"].map((tag) => (
                              <button key={tag} className="text-muted-foreground hover:text-foreground transition-colors">
                                   {tag}
                              </button>
                         ))}
                    </div>
               </div>
          </div>
     )
}
