'use client';

import { use } from "react"
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { JobDetailHeader } from "@/components/job-detail-header"
import { JobDetailSidebar } from "@/components/job-detail-sidebar"
import { PerksGrid } from "@/components/perks-grid"
import { CompanyInfo } from "@/components/company-info"
import { useJobDetail } from "@/lib/use-job-detail"

export default function JobDetailPage({
     params,
}: {
     params: Promise<{ id: string }>
}) {
     const { id } = use(params);
     const { job, loading, error, refetch } = useJobDetail(id);

     if (loading) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                         <span className="text-lg text-gray-600">Loading job details...</span>
                    </div>
               </div>
          );
     }

     if (error) {
          return (
               <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                         <div className="text-red-500 mb-4">
                              <p className="text-lg font-medium">Error loading job details</p>
                              <p className="text-sm text-gray-600">{error}</p>
                         </div>
                         <div className="space-x-4">
                              <Button onClick={refetch} variant="outline">
                                   Try Again
                              </Button>
                              <Link href="/find-jobs">
                                   <Button variant="ghost">
                                        Back to Jobs
                                   </Button>
                              </Link>
                         </div>
                    </div>
               </div>
          );
     }

     if (!job) {
          notFound();
     }

     return (
          <div className="min-h-screen bg-gray-50">
               <div className="border-b bg-white px-6 py-4">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                         <div className="flex items-center gap-3">
                              <Link href="/find-jobs">
                                   <Button variant="ghost" size="icon">
                                        <ArrowLeft className="h-5 w-5" />
                                   </Button>
                              </Link>
                              <h1 className="text-xl font-semibold text-gray-900">Job Description</h1>
                         </div>
                         <Button className="bg-indigo-600 hover:bg-indigo-700">Become Employer</Button>
                    </div>
               </div>

               <div className="mx-auto max-w-7xl px-6 py-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                         <div className="lg:col-span-2">
                              <div className="space-y-8 rounded-lg border bg-white p-6">
                                   <JobDetailHeader job={job} />

                                   <section>
                                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
                                        <p className="text-gray-600">{job.description}</p>
                                   </section>

                                   <section>
                                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Responsibilities</h2>
                                        <ul className="space-y-2">
                                             {job.responsibilities.map((item, index) => (
                                                  <li key={index} className="flex gap-2">
                                                       <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                       <span className="text-gray-600">{item}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </section>

                                   <section>
                                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Who You Are</h2>
                                        <ul className="space-y-2">
                                             {job.requirements.map((item, index) => (
                                                  <li key={index} className="flex gap-2">
                                                       <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                       <span className="text-gray-600">{item}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </section>

                                   <section>
                                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Nice-To-Haves</h2>
                                        <ul className="space-y-2">
                                             {job.niceToHave.map((item, index) => (
                                                  <li key={index} className="flex gap-2">
                                                       <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                                       <span className="text-gray-600">{item}</span>
                                                  </li>
                                             ))}
                                        </ul>
                                   </section>

                                   <section>
                                        <h2 className="mb-4 text-lg font-semibold text-gray-900">Perks & Benefits</h2>
                                        <p className="mb-6 text-gray-600">This job comes with several perks and benefits</p>
                                        <PerksGrid perks={job.perks} />
                                   </section>

                                   <CompanyInfo
                                        company={job.company}
                                        logo={job.logo}
                                        logoColor={job.logoColor}
                                        description={job.companyDescription}
                                        link={job.companyLink}
                                   />
                              </div>
                         </div>

                         <div className="lg:col-span-1">
                              <JobDetailSidebar job={job} />
                         </div>
                    </div>
               </div>
          </div>
     )
}
