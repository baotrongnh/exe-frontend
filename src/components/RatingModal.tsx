"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface RatingModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (rating: number, comment: string) => Promise<void>
    title?: string
    description?: string
    isLoading?: boolean
}

export function RatingModal({
    isOpen,
    onClose,
    onSubmit,
    title = "Rate Your Experience",
    description = "Please rate your experience with the platform",
    isLoading = false
}: RatingModalProps) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [showError, setShowError] = useState(false)

    const handleSubmit = async () => {
        if (rating === 0) {
            setShowError(true)
            setTimeout(() => setShowError(false), 3000)
            return
        }

        try {
            await onSubmit(rating, comment)
            // Reset form
            setRating(0)
            setHoverRating(0)
            setComment("")
            setShowError(false)
        } catch (error) {
            console.error("Error submitting rating:", error)
        }
    }

    const handleClose = () => {
        setRating(0)
        setHoverRating(0)
        setComment("")
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
                    <DialogDescription className="text-base">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Star Rating */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => {
                                        setRating(star)
                                        setShowError(false)
                                    }}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        className={`w-12 h-12 ${star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-none text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {showError && (
                            <p className="text-sm text-red-600 font-medium animate-pulse">
                                Please select a rating before submitting
                            </p>
                        )}
                        <p className="text-sm text-gray-600">
                            {rating > 0 && (
                                <span className="font-semibold text-gray-900">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </span>
                            )}
                            {rating === 0 && "Click to rate"}
                        </p>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium text-gray-900">
                            Your Feedback (Optional)
                        </label>
                        <Textarea
                            id="comment"
                            placeholder="Share your experience with us..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 justify-end pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={rating === 0 || isLoading}
                        className="bg-indigo-600 hover:bg-indigo-700 min-w-[100px]"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </>
                        ) : (
                            "Submit Rating"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
