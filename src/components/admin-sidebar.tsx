"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
     const pathname = usePathname()
     const router = useRouter()

     const handleLogout = () => {
          localStorage.removeItem("adminAuth")
          router.push("/admin/login")
     }

     const navItems = [
          {
               title: "Dashboard",
               href: "/admin/dashboard",
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
               title: "User Management",
               href: "/admin/users",
               icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                         />
                    </svg>
               ),
          },
          {
               title: "Employer Applications",
               href: "/admin/employer-applications",
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
               title: "Job Post Approvals",
               href: "/admin/job-approvals",
               icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                         />
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
                              <div className="text-xs text-gray-500">Admin Panel</div>
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
                                        {item.title}
                                   </Link>
                              )
                         })}
                    </div>
               </nav>

               {/* Admin Profile & Logout */}
               <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-sm">AD</span>
                         </div>
                         <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">Admin User</div>
                              <div className="text-xs text-gray-500 truncate">admin@jobboost.com</div>
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
