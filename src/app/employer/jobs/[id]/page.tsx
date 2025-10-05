"use client"

import { useState } from "react"
import Link from "next/link"
import EmployerLayout from "@/components/employer/EmployerLayout"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data - replace with API call
const mockJobData = {
     id: 1,
     title: "Social Media Assistant",
     department: "Design",
     type: "Part-Time",
     rating: 4,
     hired: 11,
     totalViews: 23564,
     totalApplied: 132,
     viewsChange: 8.4,
     appliedChange: 0.4,
}

const mockChartData = [
     { date: "19 Jul", views: 150 },
     { date: "20 Jul", views: 300 },
     { date: "21 Jul", views: 500 },
     { date: "22 Jul", views: 400 },
     { date: "23 Jul", views: 243 },
     { date: "24 Jul", views: 600 },
     { date: "25 Jul", views: 450 },
]

const mockTrafficChannels = [
     { name: "Direct", value: 48, color: "#FFA500" },
     { name: "Social", value: 23, color: "#4169E1" },
     { name: "Organic", value: 24, color: "#8B5CF6" },
     { name: "Other", value: 5, color: "#10B981" },
]

const mockVisitorsByCountry = [
     { country: "USA", flag: "🇺🇸", visitors: 3240 },
     { country: "France", flag: "🇫🇷", visitors: 3186 },
     { country: "Italy", flag: "🇮🇹", visitors: 2938 },
     { country: "Germany", flag: "🇩🇪", visitors: 2624 },
     { country: "Japan", flag: "🇯🇵", visitors: 2414 },
     { country: "Netherlands", flag: "🇳🇱", visitors: 1014 },
]

export default function JobAnalyticsPage({ params }: { params: { id: string } }) {
     const [activeTab, setActiveTab] = useState("analytics")
     const [timeRange, setTimeRange] = useState("7days")

     // API integration placeholder
     const fetchJobAnalytics = (jobId: string) => {
          console.log("[v0] Fetch job analytics for job:", jobId)
          // TODO: Implement API call to fetch job analytics
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

                         <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                              <span>More Action</span>
                         </button>
                    </div>

                    <div className="flex items-center gap-4">
                         <Link href="/employer/jobs" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                         </Link>
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900">{mockJobData.title}</h1>
                              <p className="text-sm text-gray-600 mt-1">
                                   {mockJobData.department} • {mockJobData.type} • {mockJobData.rating} / {mockJobData.hired} Hired
                              </p>
                         </div>
                    </div>
               </div>

               {/* Tabs */}
               <div className="bg-white border-b border-gray-200 px-8">
                    <div className="flex gap-8">
                         <button
                              onClick={() => setActiveTab("applicants")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "applicants"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Applicants
                         </button>
                         <button
                              onClick={() => setActiveTab("details")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "details"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Job Details
                         </button>
                         <button
                              onClick={() => setActiveTab("analytics")}
                              className={`py-4 border-b-2 font-medium transition-colors ${activeTab === "analytics"
                                        ? "border-blue-600 text-blue-600"
                                        : "border-transparent text-gray-600 hover:text-gray-900"
                                   }`}
                         >
                              Analytics
                         </button>
                    </div>
               </div>

               {/* Content */}
               <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         {/* Left Column - Stats and Chart */}
                         <div className="lg:col-span-2 space-y-6">
                              {/* Stats Cards */}
                              <div className="grid grid-cols-2 gap-6">
                                   <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                             <span className="text-sm text-gray-600">Total Views</span>
                                             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                       />
                                                       <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                       />
                                                  </svg>
                                             </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">{mockJobData.totalViews.toLocaleString()}</div>
                                        <div className="flex items-center gap-1 text-sm">
                                             <span className="text-green-600 font-medium">↑ {mockJobData.viewsChange}%</span>
                                             <span className="text-gray-500">in last day</span>
                                        </div>
                                   </div>

                                   <div className="bg-white rounded-lg p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                             <span className="text-sm text-gray-600">Total Applied</span>
                                             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                       <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                       />
                                                  </svg>
                                             </div>
                                        </div>
                                        <div className="text-3xl font-bold text-gray-900 mb-1">{mockJobData.totalApplied}</div>
                                        <div className="flex items-center gap-1 text-sm">
                                             <span className="text-green-600 font-medium">↑ {mockJobData.appliedChange}%</span>
                                             <span className="text-gray-500">in last day</span>
                                        </div>
                                   </div>
                              </div>

                              {/* Chart */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Job Listing View stats</h3>
                                        <select
                                             value={timeRange}
                                             onChange={(e) => setTimeRange(e.target.value)}
                                             className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        >
                                             <option value="7days">Last 7 days</option>
                                             <option value="30days">Last 30 days</option>
                                             <option value="90days">Last 90 days</option>
                                        </select>
                                   </div>
                                   <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={mockChartData}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                             <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                                             <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                                             <Tooltip />
                                             <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                                        </LineChart>
                                   </ResponsiveContainer>
                              </div>
                         </div>

                         {/* Right Column - Traffic and Visitors */}
                         <div className="space-y-6">
                              {/* Traffic Channel */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic channel</h3>
                                   <div className="relative w-48 h-48 mx-auto mb-4">
                                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                                             {mockTrafficChannels.map((channel, index) => {
                                                  const total = mockTrafficChannels.reduce((sum, c) => sum + c.value, 0)
                                                  const percentage = (channel.value / total) * 100
                                                  const offset = mockTrafficChannels
                                                       .slice(0, index)
                                                       .reduce((sum, c) => sum + (c.value / total) * 100, 0)
                                                  return (
                                                       <circle
                                                            key={channel.name}
                                                            cx="50"
                                                            cy="50"
                                                            r="40"
                                                            fill="none"
                                                            stroke={channel.color}
                                                            strokeWidth="20"
                                                            strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                                                            strokeDashoffset={-offset * 2.51}
                                                       />
                                                  )
                                             })}
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                             <div className="text-center">
                                                  <div className="text-2xl font-bold text-gray-900">243</div>
                                             </div>
                                        </div>
                                   </div>
                                   <div className="space-y-2">
                                        {mockTrafficChannels.map((channel) => (
                                             <div key={channel.name} className="flex items-center justify-between">
                                                  <div className="flex items-center gap-2">
                                                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: channel.color }} />
                                                       <span className="text-sm text-gray-600">{channel.name}</span>
                                                  </div>
                                                  <span className="text-sm font-medium text-gray-900">{channel.value}%</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>

                              {/* Visitors by Country */}
                              <div className="bg-white rounded-lg p-6 shadow-sm">
                                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Visitors by country</h3>
                                   <div className="space-y-3">
                                        {mockVisitorsByCountry.map((visitor) => (
                                             <div key={visitor.country} className="flex items-center justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <span className="text-2xl">{visitor.flag}</span>
                                                       <span className="text-sm text-gray-900">{visitor.country}</span>
                                                  </div>
                                                  <span className="text-sm font-medium text-gray-900">{visitor.visitors.toLocaleString()}</span>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </EmployerLayout>
     )
}
