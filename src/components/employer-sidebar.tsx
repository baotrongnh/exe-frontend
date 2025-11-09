"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { Loader2 } from "lucide-react"

interface EmployerProfile {
     id: string
     user_id: string
     company_name: string
     company_website: string | null
     company_logo: string | null
     company_description: string | null
     industry: string | null
     company_size: string | null
     is_verified: boolean
     created_at: string
     updated_at: string
}

export function EmployerSidebar() {
     const pathname = usePathname()
     const router = useRouter()
     const { user, signOut } = useAuth()
     const [unreadCount, setUnreadCount] = useState(0)
     const [profile, setProfile] = useState<EmployerProfile | null>(null)
     const [loadingProfile, setLoadingProfile] = useState(true)

     // Fetch employer profile
     useEffect(() => {
          const fetchProfile = async () => {
               if (!user) return

               try {
                    setLoadingProfile(true)
                    const data = await api.employer.getProfile()
                    setProfile(data)
               } catch (error) {
                    console.error("Error fetching employer profile:", error)
               } finally {
                    setLoadingProfile(false)
               }
          }

          fetchProfile()
     }, [user])

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

     const handleSignOut = async () => {
          try {
               await signOut()
               router.push("/login")
          } catch (error) {
               console.error("Error signing out:", error)
          }
     }

     const getInitials = (name: string) => {
          return name
               .split(" ")
               .map((n) => n[0])
               .join("")
               .toUpperCase()
               .slice(0, 2)
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
                    title: "Wallet",
                    href: "/employer/wallet",
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                              />
                         </svg>
                    ),
               },
               {
                    title: "Messages",
                    href: "/employer/messages",
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
                    title: "Deliverables",
                    href: "/employer/deliverables",
                    icon: (
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                   strokeLinecap="round"
                                   strokeLinejoin="round"
                                   strokeWidth={2}
                                   d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
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
                              <div className="font-bold text-gray-900">Sworker</div>
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
               <div className="p-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                    {loadingProfile ? (
                         <div className="flex items-center justify-center py-4">
                              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                         </div>
                    ) : profile ? (
                         <>
                              <div className="flex items-center gap-3 mb-3">
                                   {profile.company_logo ? (
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-100">
                                             <Image
                                                  src={profile.company_logo}
                                                  alt={profile.company_name}
                                                  fill
                                                  className="object-cover"
                                                  onError={(e) => {
                                                       const target = e.target as HTMLImageElement
                                                       target.style.display = "none"
                                                  }}
                                             />
                                        </div>
                                   ) : (
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                                             <span className="text-white font-bold text-sm">{getInitials(profile.company_name)}</span>
                                        </div>
                                   )}
                                   <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                             <div className="text-sm font-semibold text-gray-900 truncate">{profile.company_name}</div>
                                             {profile.is_verified && (
                                                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                       <path
                                                            fillRule="evenodd"
                                                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clipRule="evenodd"
                                                       />
                                                  </svg>
                                             )}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                                   </div>
                              </div>
                              <button
                                   onClick={handleSignOut}
                                   className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all shadow-md hover:shadow-lg"
                              >
                                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             strokeWidth={2}
                                             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                   </svg>
                                   Sign Out
                              </button>
                         </>
                    ) : (
                         <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                   <span className="text-gray-500 font-semibold text-sm">?</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                   <div className="text-sm font-medium text-gray-900 truncate">Loading...</div>
                                   <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                              </div>
                         </div>
                    )}
               </div>
          </div>
     )
}
