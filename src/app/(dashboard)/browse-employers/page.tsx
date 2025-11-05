"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/components/toast"
import { EmployerCard, SearchBar } from "./components"
import { Building2 } from "lucide-react"

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

export default function BrowseEmployersPage() {
    const [employers, setEmployers] = useState<Employer[]>([])
    const [allEmployers, setAllEmployers] = useState<Employer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchInput, setSearchInput] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const toast = useToast()

    useEffect(() => {
        const fetchEmployers = async () => {
            try {
                setLoading(true)
                const response = await api.employer.getVerifiedEmployers({ page: 1, limit: 100 })
                console.log("Employers response:", response)

                // Handle the nested response structure: response.data.employers
                let employersData: Employer[] = []
                if (response?.data?.employers && Array.isArray(response.data.employers)) {
                    employersData = response.data.employers
                } else if (Array.isArray(response?.data)) {
                    employersData = response.data
                } else if (Array.isArray(response)) {
                    employersData = response
                }

                console.log("Processed employers data:", employersData)
                setAllEmployers(employersData)
                setEmployers(employersData)
                setError(null)
            } catch (err: unknown) {
                console.error("Error fetching employers:", err)
                const errorMessage = err instanceof Error ? err.message : "Failed to load employers"
                setError(errorMessage)
                toast.showToast("Failed to load employers", "error")
            } finally {
                setLoading(false)
            }
        }

        fetchEmployers()
    }, [toast])

    // Filter employers based on search query
    useEffect(() => {
        if (!searchQuery) {
            setEmployers(allEmployers)
        } else {
            const filtered = allEmployers.filter(
                (employer) =>
                    employer.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (employer.industry && employer.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
                    (employer.company_description && employer.company_description.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            setEmployers(filtered)
        }
    }, [searchQuery, allEmployers])

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchInput)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchInput])

    const handleSearch = () => {
        setSearchQuery(searchInput)
    }

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <header className="bg-card border-b border-border px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl font-bold text-foreground">Browse Employers</h1>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {Array.isArray(employers) ? employers.length : 0} {Array.isArray(employers) && employers.length === 1 ? "Company" : "Companies"}
                    </div>
                </div>
            </header>

            {/* Search Bar */}
            <SearchBar
                searchInput={searchInput}
                onSearchInputChange={handleSearchInputChange}
                onSearch={handleSearch}
                onKeyPress={handleKeyPress}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Results Header */}
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-foreground mb-1">
                            {searchQuery ? `Search Results for "${searchQuery}"` : "All Employers"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Showing {Array.isArray(employers) ? employers.length : 0} of {Array.isArray(allEmployers) ? allEmployers.length : 0} employers
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchInput("")
                                        setSearchQuery("")
                                    }}
                                    className="ml-2 text-primary hover:underline"
                                >
                                    Clear search
                                </button>
                            )}
                        </p>
                    </div>

                    {/* Employer Cards */}
                    <div className="space-y-4">
                        {loading && (
                            <div className="text-center py-10">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                <p className="text-muted-foreground">Loading companies...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-10">
                                <p className="text-red-500">{error}</p>
                            </div>
                        )}

                        {!loading && !error && Array.isArray(employers) && employers.length === 0 && (
                            <div className="text-center py-10">
                                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-muted-foreground">
                                    {searchQuery ? `No companies found matching "${searchQuery}"` : "No companies available"}
                                </p>
                            </div>
                        )}

                        {!loading && !error && Array.isArray(employers) && employers.map((employer) => (
                            <EmployerCard key={employer.id} employer={employer} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
