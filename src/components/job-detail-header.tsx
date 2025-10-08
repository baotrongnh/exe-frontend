import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { applicationAPI } from "@/lib/api"
import { Toast } from "@/components/toast"
import type { Job } from "@/data/jobs"

interface JobDetailHeaderProps {
     job: Job
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
     const [isApplying, setIsApplying] = useState(false)
     const [hasApplied, setHasApplied] = useState(false)
     const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; visible: boolean }>({
          message: '',
          type: 'info',
          visible: false
     })

     const showToast = (message: string, type: 'success' | 'error' | 'info') => {
          setToast({ message, type, visible: true })
     }

     const hideToast = () => {
          setToast(prev => ({ ...prev, visible: false }))
     }

     const handleApplyJob = async () => {
          if (isApplying || hasApplied) return

          try {
               setIsApplying(true)
               const response = await applicationAPI.applyForJob(job.id)

               // Handle successful application
               setHasApplied(true)
               showToast(`Successfully applied for ${job.title}!`, 'success')
          } catch (error: any) {
               console.error('Error applying for job:', error)

               // Check if error message indicates already applied
               const errorMessage = error.message || 'Failed to apply for job. Please try again.'

               if (errorMessage.includes("already applied")) {
                    setHasApplied(true)
                    showToast('You have already applied for this job', 'info')
               } else {
                    showToast(errorMessage, 'error')
               }
          } finally {
               setIsApplying(false)
          }
     }

     return (
          <div className="flex items-start justify-between gap-4 border-b pb-6">
               <div className="flex gap-4">
                    <div
                         className={`flex h-16 w-16 items-center justify-center rounded-lg ${job.logoColor} text-2xl font-bold text-white`}
                    >
                         {job.logo}
                    </div>
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                         <p className="mt-1 text-sm text-gray-600">
                              {job.company} • {job.location} • {job.type}
                         </p>
                    </div>
               </div>
               <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                         <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                         className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                         onClick={handleApplyJob}
                         disabled={isApplying || hasApplied}
                    >
                         {isApplying ? "Applying..." : hasApplied ? "Applied" : "Apply"}
                    </Button>
               </div>

               <Toast
                    message={toast.message}
                    type={toast.type}
                    isVisible={toast.visible}
                    onClose={hideToast}
               />
          </div>
     )
}
