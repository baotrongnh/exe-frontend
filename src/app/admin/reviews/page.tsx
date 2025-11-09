"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, User, MessageSquare, Calendar, CheckCircle, TrendingUp, Briefcase } from 'lucide-react'
import { api } from '@/lib/api'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Chart Colors
const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

// Types
interface Reviewer {
    id: string
    email: string
    name: string
}

interface Job {
    id: string
    title: string
    status: string
}

interface Review {
    id: string
    job_id: string
    employer_id: string
    freelancer_id: string
    reviewer_id: string
    reviewer_role: 'FREELANCER' | 'EMPLOYER'
    rating: number
    comment: string
    created_at: string
    updated_at: string
    reviewer: Reviewer
    employer: Reviewer
    freelancer: Reviewer
    job: Job
}

interface RatingDistribution {
    rating: number
    count: string
}

interface Statistics {
    average_rating: string
    total_reviews: number
    rating_distribution: RatingDistribution[]
}

interface Pagination {
    page: number
    limit: number
    total: number
    totalPages: number
}

interface ReviewsData {
    reviews: Review[]
    statistics: Statistics
    pagination: Pagination
}

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'}`} />
        ))}
        <span className="ml-1.5 text-sm text-gray-600">({rating}/5)</span>
    </div>
)

// Main Reviews Page Component
export default function ReviewsPage() {
    const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null)
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'FREELANCER' | 'EMPLOYER'>('all')
    const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Fetch Reviews from API
    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        try {
            setLoading(true)
            const response = await api.jobReviews.getAllAdmin({ page: 1, limit: 100 })
            setReviewsData(response.data)
            setFilteredReviews(response.data.reviews)
        } catch (err: unknown) {
            console.error('Error fetching reviews:', err)
            alert('Failed to load reviews. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Filter and Search Logic
    useEffect(() => {
        if (!reviewsData) return

        let filtered = reviewsData.reviews

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(review => review.reviewer_role === roleFilter)
        }

        // Apply verified filter (note: the API doesn't return is_verified, so we'll skip this)
        // if (verifiedFilter === 'verified') {
        //     filtered = filtered.filter(review => review.is_verified)
        // } else if (verifiedFilter === 'unverified') {
        //     filtered = filtered.filter(review => !review.is_verified)
        // }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(review =>
                review.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.job.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredReviews(filtered)
        setCurrentPage(1)
    }, [searchTerm, roleFilter, verifiedFilter, reviewsData])

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

    // Format Date
    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

    // Truncate long text
    const truncateText = (text: string, maxLength: number) =>
        text.length <= maxLength ? text : text.substring(0, maxLength) + '...'

    // Chart data helpers
    const getRatingDistributionData = () =>
        reviewsData?.statistics.rating_distribution.map(item => ({ rating: `${item.rating} ⭐`, count: parseInt(item.count) })) || []

    const getRoleDistributionData = () => {
        if (!reviewsData) return []
        const freelancerCount = reviewsData.reviews.filter(r => r.reviewer_role === 'FREELANCER').length
        const employerCount = reviewsData.reviews.filter(r => r.reviewer_role === 'EMPLOYER').length
        return [
            { name: 'Freelancer', value: freelancerCount },
            { name: 'Employer', value: employerCount }
        ]
    }

    const getVerificationData = () => {
        // Since API doesn't return is_verified, we'll show role distribution instead
        return getRoleDistributionData()
    }


    return (
        <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Platform Reviews</h1>
                        <p className="text-gray-600 mt-1">
                            User feedback and ratings about the platform
                        </p>
                    </div>
                    <Button onClick={fetchReviews} className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            {reviewsData && !loading && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Total Reviews</h3>
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{reviewsData.pagination.total}</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
                                <Star className="w-5 h-5 text-yellow-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{parseFloat(reviewsData.statistics.average_rating).toFixed(1)} ⭐</p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Freelancer Reviews</h3>
                                <User className="w-5 h-5 text-purple-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {reviewsData.reviews.filter(r => r.reviewer_role === 'FREELANCER').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">Employer Reviews</h3>
                                <User className="w-5 h-5 text-pink-500" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {reviewsData.reviews.filter(r => r.reviewer_role === 'EMPLOYER').length}
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                Rating Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={getRatingDistributionData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8b5cf6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-500" />
                                Reviews by Role
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie data={getRoleDistributionData()} cx="50%" cy="50%" labelLine={false}
                                        label={((entry: { name?: string; percent?: number }) => `${entry.name} ${((entry.percent || 0) * 100).toFixed(0)}%`) as never}
                                        outerRadius={80} dataKey="value">
                                        {getRoleDistributionData().map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Role Distribution
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={getVerificationData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}

            {/* Filters Section */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Search by name, email, or comment..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="w-full md:w-64">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                            className="w-full h-9 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="FREELANCER">Freelancer</option>
                            <option value="EMPLOYER">Employer</option>
                        </select>
                    </div>

                    {/* Verified Filter */}
                    <div className="w-full md:w-48" style={{ display: 'none' }}>
                        <select
                            value={verifiedFilter}
                            onChange={(e) => setVerifiedFilter(e.target.value as typeof verifiedFilter)}
                            className="w-full h-9 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="verified">Verified Only</option>
                            <option value="unverified">Unverified Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        All Reviews ({filteredReviews.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-indigo-600"></div>
                        <p className="mt-4 text-gray-600">Loading reviews...</p>
                    </div>
                ) : currentReviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        No reviews found matching your filters.
                    </div>
                ) : (
                    <>
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4" />
                                                Reviewer
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="w-4 h-4" />
                                                Job
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4" />
                                                Rating
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare className="w-4 h-4" />
                                                Comment
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                Date
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentReviews.map((review) => (
                                        <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900">{review.reviewer.name}</span>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${review.reviewer_role === 'FREELANCER'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                            {review.reviewer_role}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{review.reviewer.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-medium text-gray-900">{truncateText(review.job.title, 40)}</span>
                                                    <span className="text-xs text-gray-500">ID: {review.job_id.substring(0, 8)}...</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <StarRating rating={review.rating} />
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-600 max-w-xs">
                                                <span title={review.comment}>
                                                    {truncateText(review.comment, 100)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(review.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredReviews.length)} of{' '}
                                        {filteredReviews.length} results
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex gap-1">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className="min-w-[2.5rem]"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
