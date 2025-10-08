import type { JobDetail } from "@/lib/use-job-detail"

interface JobDetailSidebarProps {
     job: JobDetail
}

export function JobDetailSidebar({ job }: JobDetailSidebarProps) {
     return (
          <div className="space-y-6">
               <div className="rounded-lg border bg-white p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">About this role</h3>
                    <div className="space-y-4 text-sm">
                         <div className="flex justify-between">
                              <span className="text-gray-600">Applied</span>
                              <span className="font-medium text-gray-900">
                                   {job.applied} / {job.capacity} capacity
                              </span>
                         </div>
                         <div className="flex justify-between">
                              <span className="text-gray-600">Apply Before</span>
                              <span className="font-medium text-gray-900">{job.applyBefore}</span>
                         </div>
                         <div className="flex justify-between">
                              <span className="text-gray-600">Job Posted On</span>
                              <span className="font-medium text-gray-900">{job.postedOn}</span>
                         </div>
                         <div className="flex justify-between">
                              <span className="text-gray-600">Job Type</span>
                              <span className="font-medium text-gray-900">{job.type}</span>
                         </div>
                         <div className="flex justify-between">
                              <span className="text-gray-600">Salary</span>
                              <span className="font-medium text-gray-900">{job.salaryRange}</span>
                         </div>
                    </div>
               </div>

               <div className="rounded-lg border bg-white p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                         {job.categories.map((category: string) => (
                              <span key={category} className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600">
                                   {category}
                              </span>
                         ))}
                    </div>
               </div>

               <div className="rounded-lg border bg-white p-6">
                    <h3 className="mb-4 font-semibold text-gray-900">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                         {job.skills.map((skill: string) => (
                              <span key={skill} className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium text-indigo-600">
                                   {skill}
                              </span>
                         ))}
                    </div>
               </div>
          </div>
     )
}
