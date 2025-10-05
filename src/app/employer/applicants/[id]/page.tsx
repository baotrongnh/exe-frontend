"use client"

import { useState } from "react"
import Link from "next/link"
import EmployerLayout from "@/components/employer/EmployerLayout"

// Mock data - replace with API call
const mockApplicant = {
     id: 1,
     name: "Jerome Bell",
     title: "Product Designer",
     rating: 4.0,
     avatar: "/placeholder.svg?height=120&width=120",
     appliedJobs: 2,
     appliedDate: "2 days ago",
     stage: {
          current: "Interview",
          progress: 50,
     },
     personalInfo: {
          fullName: "Jerome Bell",
          gender: "Male",
          dateOfBirth: "March 23, 1995 (29 y.o)",
          language: "English, French, Bahasa",
          address: "4517 Washington Ave, Manchester, Kentucky 39495",
     },
     professionalInfo: {
          aboutMe:
               "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.",
          aboutMeExtended:
               "For 19 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
          currentJob: "Product Designer",
          experienceYears: 4,
          education: "Bachelors in Engineering",
          skills: ["Project Management", "Copywriting", "English"],
     },
     contact: {
          email: "jeromebell66@email.com",
          phone: "+44 (261) 872 135",
          instagram: "instagram.com/jeromebell",
          twitter: "twitter.com/jeromebell",
          website: "www.jeromebell.com",
     },
}

export default function ApplicantDetailsPage({ params }: { params: { id: string } }) {
     const [activeTab, setActiveTab] = useState("profile")

     // API integration placeholders
     const fetchApplicantDetails = (applicantId: string) => {
          console.log("[v0] Fetch applicant details for:", applicantId)
          // TODO: Implement API call to fetch applicant details
     }

     const handleScheduleInterview = () => {
          console.log("[v0] Schedule interview for applicant:", mockApplicant.id)
          // TODO: Implement schedule interview functionality
     }

     const handleMoreActions = () => {
          console.log("[v0] More actions for applicant:", mockApplicant.id)
          // TODO: Implement more actions dropdown
     }

     return (
          <EmployerLayout>
               {/* Header */}
               <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                   <span className="text-green-600 font-bold">N</span>
                              </div>
                              <div>
                                   <p className="text-sm text-gray-600">Employer</p>
                                   <div className="flex items-center gap-2">
                                        <span className="font-semibold text-gray-900">Nomad</span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                   </div>
                              </div>
                         </div>

                         <button
                              onClick={handleMoreActions}
                              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                         >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              <span>More Action</span>
                         </button>
                    </div>

                    <div className="flex items-center gap-4">
                         <Link href="/employer/applicants" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                         </Link>
                         <h1 className="text-2xl font-bold text-gray-900">Applicant Details</h1>
                    </div>
               </div>

               {/* Tabs */}
               <div className="bg-white border-b border-gray-200 px-8">
                    <div className="flex gap-8">
                         <button
                              onClick={() => setActiveTab("profile")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "profile"
                                   ? "border-blue-600 text-blue-600"
                                   : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Applicant Profile
                         </button>
                         <button
                              onClick={() => setActiveTab("resume")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "resume"
                                   ? "border-blue-600 text-blue-600"
                                   : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Resume
                         </button>
                         <button
                              onClick={() => setActiveTab("progress")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "progress"
                                   ? "border-blue-600 text-blue-600"
                                   : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Hiring Progress
                         </button>
                         <button
                              onClick={() => setActiveTab("schedule")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "schedule"
                                   ? "border-blue-600 text-blue-600"
                                   : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Interview Schedule
                         </button>
                    </div>
               </div>

               {/* Content */}
               <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {/* Left Column - Profile Card and Contact */}
                         <div className="space-y-6">
                              {/* Profile Card */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <div className="text-center mb-6">
                                        <img
                                             src={mockApplicant.avatar || "/placeholder.svg"}
                                             alt={mockApplicant.name}
                                             className="w-24 h-24 rounded-full mx-auto mb-4"
                                        />
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">{mockApplicant.name}</h2>
                                        <p className="text-gray-600 mb-2">{mockApplicant.title}</p>
                                        <div className="flex items-center justify-center gap-1 mb-4">
                                             <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                             </svg>
                                             <span className="font-semibold text-gray-900">{mockApplicant.rating}</span>
                                        </div>
                                   </div>

                                   <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-sm">
                                             <span className="text-gray-600">Applied Jobs</span>
                                             <span className="font-medium text-gray-900">{mockApplicant.appliedJobs}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                             <span className="text-gray-600">Applied Date</span>
                                             <span className="font-medium text-gray-900">{mockApplicant.appliedDate}</span>
                                        </div>
                                   </div>

                                   {/* Stage Progress */}
                                   <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                             <span className="text-gray-600">Stage</span>
                                             <span className="font-medium text-gray-900">{mockApplicant.stage.current}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                             <div
                                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                                  style={{ width: `${mockApplicant.stage.progress}%` }}
                                             />
                                        </div>
                                   </div>

                                   <button
                                        onClick={handleScheduleInterview}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                   >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                             />
                                        </svg>
                                        <span>Schedule Interview</span>
                                   </button>
                              </div>

                              {/* Contact Card */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                                   <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={2}
                                                       d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                  />
                                             </svg>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-xs text-gray-500 mb-1">Email</p>
                                                  <p className="text-sm text-gray-900 break-all">{mockApplicant.contact.email}</p>
                                             </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={2}
                                                       d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                  />
                                             </svg>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                                                  <p className="text-sm text-gray-900">{mockApplicant.contact.phone}</p>
                                             </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={2}
                                                       d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                  />
                                             </svg>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-xs text-gray-500 mb-1">Instagram</p>
                                                  <p className="text-sm text-blue-600 break-all">{mockApplicant.contact.instagram}</p>
                                             </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={2}
                                                       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                  />
                                             </svg>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-xs text-gray-500 mb-1">Twitter</p>
                                                  <p className="text-sm text-blue-600 break-all">{mockApplicant.contact.twitter}</p>
                                             </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                             <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path
                                                       strokeLinecap="round"
                                                       strokeLinejoin="round"
                                                       strokeWidth={2}
                                                       d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                                  />
                                             </svg>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-xs text-gray-500 mb-1">Website</p>
                                                  <p className="text-sm text-blue-600 break-all">{mockApplicant.contact.website}</p>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>

                         {/* Right Column - Personal and Professional Info */}
                         <div className="lg:col-span-2 space-y-6">
                              {/* Personal Info */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Info</h3>
                                   <div className="grid grid-cols-2 gap-6">
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Full Name</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.personalInfo.fullName}</p>
                                        </div>
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Gender</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.personalInfo.gender}</p>
                                        </div>
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.personalInfo.dateOfBirth}</p>
                                        </div>
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Language</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.personalInfo.language}</p>
                                        </div>
                                        <div className="col-span-2">
                                             <p className="text-sm text-gray-600 mb-1">Address</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.personalInfo.address}</p>
                                        </div>
                                   </div>
                              </div>

                              {/* Professional Info */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Info</h3>

                                   <div className="mb-6">
                                        <p className="text-sm text-gray-600 mb-2">About Me</p>
                                        <p className="text-sm text-gray-900 leading-relaxed mb-3">{mockApplicant.professionalInfo.aboutMe}</p>
                                        <p className="text-sm text-gray-900 leading-relaxed">
                                             {mockApplicant.professionalInfo.aboutMeExtended}
                                        </p>
                                   </div>

                                   <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Current Job</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.professionalInfo.currentJob}</p>
                                        </div>
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Experience in Years</p>
                                             <p className="text-sm font-medium text-gray-900">
                                                  {mockApplicant.professionalInfo.experienceYears} Years
                                             </p>
                                        </div>
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Highest Qualification Held</p>
                                             <p className="text-sm font-medium text-gray-900">{mockApplicant.professionalInfo.education}</p>
                                        </div>
                                        <div>
                                             <p className="text-sm text-gray-600 mb-1">Skill Set</p>
                                             <div className="flex flex-wrap gap-2 mt-1">
                                                  {mockApplicant.professionalInfo.skills.map((skill) => (
                                                       <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                                                            {skill}
                                                       </span>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </EmployerLayout>
     )
}
