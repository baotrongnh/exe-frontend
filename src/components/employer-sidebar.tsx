"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"

export function EmployerSidebar() {
     const pathname = usePathname()
     const router = useRouter()
     const [unreadCount, setUnreadCount] = useState(0)

     // Fetch unread message count
     useEffect(() => {
          const fetchUnreadCount = async () => {
               try {
                    const response = await api.conversations.getUnreadCount()
                    if (response.success) {
                         setUnreadCount(response.data.count)
                    }
               } catch (error) {
                    console.error("Error fetching unread count:", error)
                    setUnreadCount(0)
               }
          }

          fetchUnreadCount()

          // Fetch unread count every 30 seconds
          const interval = setInterval(fetchUnreadCount, 30000)

          return () => clearInterval(interval)
     }, [])

     const handleLogout = () => {
          localStorage.removeItem("employerAuth")
          router.push("/employer/login")
     }

     const navItems: Array<{
          title: string
          href: string
          badge?: number
          icon: React.ReactNode
     }> = [
               {
                    title: "Dashboard",
                    href: "/employer/dashboard",
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                         </svg>
                    ),
               },
               {
                    title: "Messages",
                    href: "/messages",
                    badge: unreadCount > 0 ? unreadCount : undefined,
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                         </svg>
                    ),
               },
               {
                    title: "Applications",
                    href: "/employer/applications",
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                         </svg>
                    ),
               },
               {
                    title: "My Jobs",
                    href: "/employer/jobs",
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                         </svg>
                    ),
               },
               {
                    title: "Post a Job",
                    href: "/employer/post-job",
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                         </svg>
                    ),
               },
          ]

     return (
          <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
               {/* Logo */}
               <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                         <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                   <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                   />
                              </svg>
                         </div>
                         <div>
                              <div className="font-bold text-gray-900">JobBoost</div>
                              <div className="text-xs text-gray-500">Employer</div>
                         </div>
                    </div>
               </div>

               {/* Navigation */}
               <nav className="flex-1 p-4">
                    <div className="space-y-1">
                         {navItems.map((item) => {
                              const isActive = pathname === item.href
                              return (
                                   <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                             "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                             isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50",
                                        )}
                                   >
                                        {item.icon}
                                        <span className="flex-1">{item.title}</span>
                                        {item.badge && (
                                             <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                                  {item.badge}
                                             </span>
                                        )}
                                   </Link>
                              )
                         })}
                    </div>
               </nav>

               {/* Company Profile */}
               <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-sm">TC</span>
                         </div>
                         <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">TechCorp Inc.</div>
                              <div className="text-xs text-gray-500 truncate">employer@techcorp.com</div>
                         </div>
                    </div>
                    <button
                         onClick={handleLogout}
                         className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                         </svg>
                         Logout
                    </button>
               </div>
          </div>
     )
}
