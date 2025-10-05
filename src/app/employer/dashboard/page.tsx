"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import EmployerLayout from "@/components/employer/EmployerLayout"
import EmployerHeader from "@/components/employer/EmployerHeader"

export default function EmployerDashboard() {
     const [activeTab, setActiveTab] = useState("Week")

     // Chart data for job statistics
     const chartData = [
          { day: "Mon", jobView: 150, jobApplied: 120 },
          { day: "Tue", jobView: 122, jobApplied: 94 },
          { day: "Wed", jobView: 180, jobApplied: 140 },
          { day: "Thu", jobView: 160, jobApplied: 130 },
          { day: "Fri", jobView: 200, jobApplied: 110 },
          { day: "Sat", jobView: 90, jobApplied: 70 },
          { day: "Sun", jobView: 140, jobApplied: 100 },
     ]

     // Empty functions for user actions
     const handlePostJob = () => {
          console.log("Post job clicked")
     }

     const handleNotificationClick = () => {
          console.log("Notification clicked")
     }

     const handleViewAllPositions = () => {
          console.log("View all positions clicked")
     }

     const handleJobCardClick = (jobTitle: string) => {
          console.log("Job card clicked:", jobTitle)
     }

     return (
          <EmployerLayout>
               <EmployerHeader
                    title="Good morning, Maria"
                    subtitle="Here is your job listings statistic report from July 19 - July 25"
                    dateRange="Jul 19 - Jul 25"
               />

               {/* Dashboard Content */}
               <div className="p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
                              <h3 className="text-4xl font-bold mb-2">76</h3>
                              <p className="text-purple-100 mb-4">New candidates to review</p>
                              <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                         </div>

                         <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg p-6 text-white">
                              <h3 className="text-4xl font-bold mb-2">3</h3>
                              <p className="text-teal-100 mb-4">Schedule for today</p>
                              <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                         </div>

                         <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                              <h3 className="text-4xl font-bold mb-2">24</h3>
                              <p className="text-blue-100 mb-4">Messages received</p>
                              <svg className="w-6 h-6 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                         </div>
                    </div>

                    {/* Job Statistics and Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                         {/* Job Statistics Chart */}
                         <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6">
                              <div className="flex items-center justify-between mb-6">
                                   <div>
                                        <h2 className="text-lg font-bold text-gray-900 mb-1">Job statistics</h2>
                                        <p className="text-sm text-gray-600">Showing statistic Jun 19 - Jul 25</p>
                                   </div>
                                   <div className="flex space-x-2">
                                        {["Week", "Month", "Year"].map((tab) => (
                                             <button
                                                  key={tab}
                                                  onClick={() => setActiveTab(tab)}
                                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
                                                       }`}
                                             >
                                                  {tab}
                                             </button>
                                        ))}
                                   </div>
                              </div>

                              <div className="flex space-x-4 mb-6 border-b border-gray-200">
                                   <button className="pb-3 px-1 border-b-2 border-blue-600 text-sm font-medium text-blue-600">
                                        Overview
                                   </button>
                                   <button className="pb-3 px-1 text-sm font-medium text-gray-600 hover:text-gray-900">Jobs View</button>
                                   <button className="pb-3 px-1 text-sm font-medium text-gray-600 hover:text-gray-900">Jobs Applied</button>
                              </div>

                              <ResponsiveContainer width="100%" height={300}>
                                   <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="jobView" fill="#fbbf24" name="Job View" radius={[8, 8, 0, 0]} />
                                        <Bar dataKey="jobApplied" fill="#8b5cf6" name="Job Applied" radius={[8, 8, 0, 0]} />
                                   </BarChart>
                              </ResponsiveContainer>

                              <div className="grid grid-cols-2 gap-4 mt-6">
                                   <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                             <p className="text-sm text-gray-600">Job Views</p>
                                             <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                                  <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                       <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                       <path
                                                            fillRule="evenodd"
                                                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                            clipRule="evenodd"
                                                       />
                                                  </svg>
                                             </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">2,342</p>
                                        <p className="text-xs text-gray-600">
                                             This Week <span className="text-green-600">8.5% ↑</span>
                                        </p>
                                   </div>

                                   <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                             <p className="text-sm text-gray-600">Job Applied</p>
                                             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                       <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                       <path
                                                            fillRule="evenodd"
                                                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                                                            clipRule="evenodd"
                                                       />
                                                  </svg>
                                             </div>
                                        </div>
                                        <p className="text-2xl font-bold text-gray-900 mb-1">654</p>
                                        <p className="text-xs text-gray-600">
                                             This Week <span className="text-green-600">0.5% ↑</span>
                                        </p>
                                   </div>
                              </div>
                         </div>

                         {/* Open Positions */}
                         <div className="bg-white rounded-lg border border-gray-200 p-6">
                              <div className="flex items-center justify-between mb-6">
                                   <h2 className="text-lg font-bold text-gray-900">Open Positions</h2>
                                   <button
                                        onClick={handleViewAllPositions}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
                                   >
                                        View All
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                   </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                   {/* Job Card 1 */}
                                   <div
                                        onClick={() => handleJobCardClick("Social Media Assistant")}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                   >
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                             <div className="w-8 h-8 bg-teal-400 rounded-full"></div>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded mb-3">
                                             Part-Time
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mb-2">Social Media Assistant</h3>
                                        <p className="text-sm text-gray-600 mb-1">Nomad</p>
                                        <p className="text-sm text-gray-500 mb-4">Paris, France</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                             <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">Marketing</span>
                                             <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Design</span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                             <span className="font-semibold text-gray-900">5 applied</span> of 10 capacity
                                        </p>
                                   </div>

                                   {/* Job Card 2 */}
                                   <div
                                        onClick={() => handleJobCardClick("Brand Designer")}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                   >
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                             <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                                                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                                                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                                             </svg>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded mb-3">
                                             Part-Time
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mb-2">Brand Designer</h3>
                                        <p className="text-sm text-gray-600 mb-1">Dropbox</p>
                                        <p className="text-sm text-gray-500 mb-4">San Francisco, US</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                             <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Design</span>
                                             <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Business</span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                             <span className="font-semibold text-gray-900">5 applied</span> of 5 capacity
                                        </p>
                                   </div>

                                   {/* Job Card 3 */}
                                   <div
                                        onClick={() => handleJobCardClick("Interactive Developer")}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                   >
                                        <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                                             <div className="w-8 h-8 bg-cyan-400 rounded-full"></div>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded mb-3">
                                             Part-Time
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mb-2">Interactive Developer</h3>
                                        <p className="text-sm text-gray-600 mb-1">Terraform</p>
                                        <p className="text-sm text-gray-500 mb-4">Hamburg, Germany</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                             <span className="px-2 py-1 bg-yellow-50 text-yellow-700 text-xs rounded">Marketing</span>
                                             <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Design</span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                             <span className="font-semibold text-gray-900">5 applied</span> of 10 capacity
                                        </p>
                                   </div>

                                   {/* Job Card 4 */}
                                   <div
                                        onClick={() => handleJobCardClick("Product Designer")}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                   >
                                        <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                             <div className="w-8 h-8 bg-teal-400 rounded-full"></div>
                                        </div>
                                        <span className="inline-block px-2 py-1 bg-teal-50 text-teal-600 text-xs font-medium rounded mb-3">
                                             Part-Time
                                        </span>
                                        <h3 className="font-semibold text-gray-900 mb-2">Product Designer</h3>
                                        <p className="text-sm text-gray-600 mb-1">ClassPass</p>
                                        <p className="text-sm text-gray-500 mb-4">Berlin, Germany</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                             <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">Business</span>
                                             <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">Design</span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                             <span className="font-semibold text-gray-900">5 applied</span> of 10 capacity
                                        </p>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </EmployerLayout>
     )
}
