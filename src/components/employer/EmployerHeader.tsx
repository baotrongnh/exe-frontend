"use client"

import type React from "react"
import { useState } from "react"
import PostJobModal from "./PostJobModal"

interface EmployerHeaderProps {
     title: string
     subtitle?: string
     dateRange?: string
     actions?: React.ReactNode
}

export default function EmployerHeader({ title, subtitle, dateRange, actions }: EmployerHeaderProps) {
     const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false)

     return (
          <>
               <div className="bg-white border-b border-gray-200 px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                         {/* Employer Info */}
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

                         {/* Actions */}
                         <div className="flex items-center gap-4">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                   <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                   </svg>
                              </button>
                              <button
                                   onClick={() => setIsPostJobModalOpen(true)}
                                   className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                              >
                                   <span>+</span>
                                   <span>Post a job</span>
                              </button>
                         </div>
                    </div>

                    {/* Page Title */}
                    <div className="flex items-center justify-between">
                         <div>
                              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                         </div>
                         {dateRange && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                   <span>{dateRange}</span>
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                   </svg>
                              </div>
                         )}
                         {actions}
                    </div>
               </div>

               <PostJobModal isOpen={isPostJobModalOpen} onClose={() => setIsPostJobModalOpen(false)} />
          </>
     )
}
