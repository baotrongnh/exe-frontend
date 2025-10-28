"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Star, Hash, Package, Briefcase, UserCircle, User, MessageSquare, Calendar } from 'lucide-react'

// Mock Review Data Type
interface Review {
    id: number
    project_title: string
    employer_name: string
    freelancer_name: string
    reviewer_role: 'Freelancer' | 'Employer'
    rating: number
    comment: string
    created_at: string
}

// Mock API Data
const mockReviews: Review[] = [
    {
        id: 1,
        project_title: "Website Redesign",
        employer_name: "Tran Thi B",
        freelancer_name: "Nguyen Van A",
        reviewer_role: "Employer",
        rating: 5,
        comment: "The freelancer delivered excellent quality and on time. Very professional and responsive to feedback.",
        created_at: "2025-10-21",
    },
    {
        id: 2,
        project_title: "Mobile App UI",
        employer_name: "Pham Van C",
        freelancer_name: "Le Minh Khoa",
        reviewer_role: "Freelancer",
        rating: 4,
        comment: "Good communication from the employer, payment was prompt. Clear requirements provided.",
        created_at: "2025-10-22",
    },
    {
        id: 3,
        project_title: "E-commerce Platform",
        employer_name: "Nguyen Thi Mai",
        freelancer_name: "Hoang Van Duc",
        reviewer_role: "Employer",
        rating: 5,
        comment: "Outstanding work! The freelancer went above and beyond expectations. Highly recommend.",
        created_at: "2025-10-23",
    },
    {
        id: 4,
        project_title: "Logo Design",
        employer_name: "Le Van Hai",
        freelancer_name: "Vo Thi Lan",
        reviewer_role: "Freelancer",
        rating: 3,
        comment: "Project was completed but communication could be better. Payment took longer than expected.",
        created_at: "2025-10-24",
    },
    {
        id: 5,
        project_title: "API Integration",
        employer_name: "Dang Van Minh",
        freelancer_name: "Tran Minh Tu",
        reviewer_role: "Employer",
        rating: 5,
        comment: "Professional freelancer with strong technical skills. Delivered clean code and comprehensive documentation.",
        created_at: "2025-10-25",
    },
    {
        id: 6,
        project_title: "Content Writing",
        employer_name: "Pham Thi Hong",
        freelancer_name: "Nguyen Van Khanh",
        reviewer_role: "Freelancer",
        rating: 4,
        comment: "Good employer to work with. Clear guidelines and constructive feedback throughout the project.",
        created_at: "2025-10-26",
    },
    {
        id: 7,
        project_title: "Data Analysis",
        employer_name: "Hoang Minh Tuan",
        freelancer_name: "Le Thi Nga",
        reviewer_role: "Employer",
        rating: 4,
        comment: "Solid analytical skills. Delivered insights on time with good visualizations. Minor revisions needed.",
        created_at: "2025-10-27",
    },
    {
        id: 8,
        project_title: "Video Editing",
        employer_name: "Vu Van Thanh",
        freelancer_name: "Tran Thi Huong",
        reviewer_role: "Freelancer",
        rating: 2,
        comment: "Poor communication and constantly changing requirements. Made the project difficult to complete.",
        created_at: "2025-10-27",
    },
    {
        id: 9,
        project_title: "SEO Optimization",
        employer_name: "Nguyen Van Long",
        freelancer_name: "Pham Thi Thao",
        reviewer_role: "Employer",
        rating: 5,
        comment: "Excellent SEO work! Website traffic increased significantly. Will definitely hire again.",
        created_at: "2025-10-28",
    },
    {
        id: 10,
        project_title: "Social Media Management",
        employer_name: "Le Thi Hoa",
        freelancer_name: "Hoang Van Nam",
        reviewer_role: "Freelancer",
        rating: 5,
        comment: "Amazing employer! Very supportive and provided all necessary resources. Great experience overall.",
        created_at: "2025-10-28",
    },
]

// Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-none text-gray-300'
                        }`}
                />
            ))}
            <span className="ml-1.5 text-sm text-gray-600">({rating}/5)</span>
        </div>
    )
}

// Main Reviews Page Component
export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'Freelancer' | 'Employer'>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const itemsPerPage = 10

    // New Review Form State
    const [newReview, setNewReview] = useState({
        project_title: '',
        employer_name: '',
        freelancer_name: '',
        reviewer_role: 'Employer' as 'Freelancer' | 'Employer',
        rating: 5,
        comment: '',
    })

    // Mock API Call - Simulate fetching reviews
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setReviews(mockReviews)
            setFilteredReviews(mockReviews)
            setLoading(false)
        }, 1000)
    }, [])

    // Filter and Search Logic
    useEffect(() => {
        let filtered = reviews

        // Apply role filter
        if (roleFilter !== 'all') {
            filtered = filtered.filter(review => review.reviewer_role === roleFilter)
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(review =>
                review.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.employer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.freelancer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.comment.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredReviews(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [searchTerm, roleFilter, reviews])

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem)
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage)

    // Format Date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }

    // Handle Add Review
    const handleAddReview = () => {
        const review: Review = {
            id: reviews.length + 1,
            project_title: newReview.project_title,
            employer_name: newReview.employer_name,
            freelancer_name: newReview.freelancer_name,
            reviewer_role: newReview.reviewer_role,
            rating: newReview.rating,
            comment: newReview.comment,
            created_at: new Date().toISOString().split('T')[0],
        }

        setReviews([review, ...reviews])
        setIsModalOpen(false)

        // Reset form
        setNewReview({
            project_title: '',
            employer_name: '',
            freelancer_name: '',
            reviewer_role: 'Employer',
            rating: 5,
            comment: '',
        })
    }

    // Truncate long text
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text
        return text.substring(0, maxLength) + '...'
    }

    return (
        <div className="p-8">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Transaction Reviews</h1>
                        <p className="text-gray-600 mt-1">
                            See all feedback exchanged between Freelancers and Employers after completed projects.
                        </p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Review
                    </Button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                        <Input
                            type="text"
                            placeholder="Search by project, employer, or freelancer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="w-full md:w-64">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'Freelancer' | 'Employer')}
                            className="w-full h-9 px-3 py-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Reviews</option>
                            <option value="Freelancer">Freelancer Reviews</option>
                            <option value="Employer">Employer Reviews</option>
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
                                                <Hash className="w-4 h-4" />
                                                Review ID
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Package className="w-4 h-4" />
                                                Project
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="w-4 h-4" />
                                                Employer
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <UserCircle className="w-4 h-4" />
                                                Freelancer
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4" />
                                                Reviewer
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
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                #{review.id}
                                            </td>
                                            <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                                                {review.project_title}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-900">{review.employer_name}</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                        Employer
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-900">{review.freelancer_name}</span>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        Freelancer
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${review.reviewer_role === 'Freelancer'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-purple-50 text-purple-700 border border-purple-200'
                                                    }`}>
                                                    {review.reviewer_role}
                                                </span>
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

            {/* Add Review Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogClose onClose={() => setIsModalOpen(false)} />
                    <DialogHeader>
                        <DialogTitle>Add New Review</DialogTitle>
                        <DialogDescription>
                            Create a new review for a completed project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Project Title */}
                        <div>
                            <Label htmlFor="project_title">Project Title *</Label>
                            <Input
                                id="project_title"
                                value={newReview.project_title}
                                onChange={(e) => setNewReview({ ...newReview, project_title: e.target.value })}
                                placeholder="Enter project title"
                                className="mt-1"
                            />
                        </div>

                        {/* Employer Name */}
                        <div>
                            <Label htmlFor="employer_name">Employer Name *</Label>
                            <Input
                                id="employer_name"
                                value={newReview.employer_name}
                                onChange={(e) => setNewReview({ ...newReview, employer_name: e.target.value })}
                                placeholder="Enter employer name"
                                className="mt-1"
                            />
                        </div>

                        {/* Freelancer Name */}
                        <div>
                            <Label htmlFor="freelancer_name">Freelancer Name *</Label>
                            <Input
                                id="freelancer_name"
                                value={newReview.freelancer_name}
                                onChange={(e) => setNewReview({ ...newReview, freelancer_name: e.target.value })}
                                placeholder="Enter freelancer name"
                                className="mt-1"
                            />
                        </div>

                        {/* Reviewer Role */}
                        <div>
                            <Label htmlFor="reviewer_role">Who is leaving the review? *</Label>
                            <select
                                id="reviewer_role"
                                value={newReview.reviewer_role}
                                onChange={(e) => setNewReview({ ...newReview, reviewer_role: e.target.value as 'Freelancer' | 'Employer' })}
                                className="w-full h-9 px-3 py-1 mt-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Employer">Employer (reviewing Freelancer)</option>
                                <option value="Freelancer">Freelancer (reviewing Employer)</option>
                            </select>
                        </div>

                        {/* Rating */}
                        <div>
                            <Label htmlFor="rating">Rating *</Label>
                            <select
                                id="rating"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                className="w-full h-9 px-3 py-1 mt-1 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={5}>⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                                <option value={4}>⭐⭐⭐⭐ 4 Stars - Good</option>
                                <option value={3}>⭐⭐⭐ 3 Stars - Average</option>
                                <option value={2}>⭐⭐ 2 Stars - Poor</option>
                                <option value={1}>⭐ 1 Star - Very Poor</option>
                            </select>
                        </div>

                        {/* Comment */}
                        <div>
                            <Label htmlFor="comment">Comment *</Label>
                            <textarea
                                id="comment"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                placeholder="Enter detailed review comment..."
                                rows={4}
                                className="w-full px-3 py-2 mt-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddReview}
                            disabled={
                                !newReview.project_title ||
                                !newReview.employer_name ||
                                !newReview.freelancer_name ||
                                !newReview.comment
                            }
                        >
                            Add Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
