"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ApplyJobModalProps {
     isOpen: boolean
     onClose: () => void
     onConfirm: (coverLetter?: string) => Promise<void>
     jobTitle: string
     companyName: string
     isLoading: boolean
}

export function ApplyJobModal({
     isOpen,
     onClose,
     onConfirm,
     jobTitle,
     companyName,
     isLoading
}: ApplyJobModalProps) {
     const [coverLetter, setCoverLetter] = useState("")
     const [isSubmitting, setIsSubmitting] = useState(false)

     if (!isOpen) return null

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          setIsSubmitting(true)
          try {
               await onConfirm(coverLetter.trim() || undefined)
               setCoverLetter("")
               onClose()
          } catch (error) {
               // Error is handled by parent component
          } finally {
               setIsSubmitting(false)
          }
     }

     const handleClose = () => {
          if (!isSubmitting && !isLoading) {
               setCoverLetter("")
               onClose()
          }
     }

     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
               <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                    <div className="mb-4 flex items-center justify-between">
                         <h2 className="text-xl font-semibold text-gray-900">Apply for Job</h2>
                         <button
                              onClick={handleClose}
                              disabled={isSubmitting || isLoading}
                              className="rounded-full p-1 hover:bg-gray-100 disabled:opacity-50"
                         >
                              <X className="h-5 w-5" />
                         </button>
                    </div>

                    <div className="mb-4">
                         <h3 className="font-medium text-gray-900">{jobTitle}</h3>
                         <p className="text-sm text-gray-600">{companyName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                         <div>
                              <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                                   Cover Letter (Optional)
                              </label>
                              <textarea
                                   id="coverLetter"
                                   value={coverLetter}
                                   onChange={(e) => setCoverLetter(e.target.value)}
                                   placeholder="Tell the employer why you're perfect for this role..."
                                   className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                   disabled={isSubmitting || isLoading}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                   {coverLetter.length}/500 characters
                              </p>
                         </div>

                         <div className="flex space-x-3">
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={handleClose}
                                   disabled={isSubmitting || isLoading}
                                   className="flex-1"
                              >
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   disabled={isSubmitting || isLoading}
                                   className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                              >
                                   {isSubmitting || isLoading ? "Applying..." : "Apply Now"}
                              </Button>
                         </div>
                    </form>
               </div>
          </div>
     )
}