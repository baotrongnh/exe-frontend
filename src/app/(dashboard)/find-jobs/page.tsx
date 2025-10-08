'use client';

import { Bell, Grid3x3, List, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/search-bar"
import { FilterPanel } from "@/components/filter-panel"
import { JobCard } from "@/components/job-card"
import { Pagination } from "@/components/pagination"
import { useJobs } from "@/lib/use-jobs"

export default function FindJobsPage() {
     const { jobs, loading, error, total, refetch } = useJobs({
          limit: 12,
          sortBy: 'createdAt',
          sortOrder: 'desc'
     });
     return (
          <div className="min-h-screen bg-background">
               {/* Header */}
               <header className="border-b border-border bg-background sticky top-0 z-10">
                    <div className="px-8 py-4 flex items-center justify-between">
                         <h1 className="text-3xl font-bold text-foreground">Find Jobs</h1>
                         <div className="flex items-center gap-3">
                              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Become Employer</Button>
                              <Button variant="ghost" size="icon" className="relative">
                                   <Bell className="w-5 h-5" />
                              </Button>
                         </div>
                    </div>
               </header>

               {/* Search Section */}
               <div className="px-8 py-6 border-b border-border bg-background">
                    <SearchBar />
               </div>

               {/* Main Content */}
               <div className="px-8 py-6 flex gap-8">
                    {/* Filters Sidebar */}
                    <aside className="flex-shrink-0">
                         <FilterPanel />
                    </aside>

                    {/* Jobs Grid */}
                    <div className="flex-1">
                         {/* Controls */}
                         <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-2">
                                   <h2 className="text-2xl font-bold text-foreground">All Jobs</h2>
                                   <span className="text-sm text-muted-foreground">
                                        {loading ? 'Loading...' : `Showing ${jobs.length} of ${total} results`}
                                   </span>
                              </div>                              <div className="flex items-center gap-3">
                                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>Sort by:</span>
                                        <button className="flex items-center gap-1 text-foreground font-medium">
                                             Most relevant
                                             <ChevronDown className="w-4 h-4" />
                                        </button>
                                   </div>

                                   <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                                        <Button
                                             variant="ghost"
                                             size="icon"
                                             className="w-8 h-8 bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white"
                                        >
                                             <Grid3x3 className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="w-8 h-8">
                                             <List className="w-4 h-4" />
                                        </Button>
                                   </div>
                              </div>
                         </div>

                         {/* Jobs Grid */}
                         {error ? (
                              <div className="flex flex-col items-center justify-center py-12">
                                   <div className="text-red-500 text-center mb-4">
                                        <p className="text-lg font-medium">Error loading jobs</p>
                                        <p className="text-sm text-muted-foreground">{error}</p>
                                   </div>
                                   <Button onClick={refetch} variant="outline">
                                        Try Again
                                   </Button>
                              </div>
                         ) : loading ? (
                              <div className="flex items-center justify-center py-12">
                                   <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                                   <span className="ml-2 text-muted-foreground">Loading jobs...</span>
                              </div>
                         ) : jobs.length === 0 ? (
                              <div className="text-center py-12">
                                   <p className="text-lg font-medium text-muted-foreground">No jobs found</p>
                                   <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                              </div>
                         ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                   {jobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                   ))}
                              </div>
                         )}

                         {/* Pagination */}
                         <Pagination />
                    </div>
               </div>
          </div>
     )
}
