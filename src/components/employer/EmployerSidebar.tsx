"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function EmployerSidebar() {
     const pathname = usePathname()

     const navItems = [
          { name: "Dashboard", icon: "📊", path: "/employer/dashboard" },
          { name: "Messages", icon: "💬", path: "/employer/messages", badge: 3 },
          { name: "Employer Profile", icon: "👤", path: "/employer/profile" },
          { name: "All Applicants", icon: "👥", path: "/employer/applicants" },
          { name: "Job Listing", icon: "📋", path: "/employer/jobs" },
          { name: "My Schedule", icon: "📅", path: "/employer/schedule" },
     ]

     const settingsItems = [
          { name: "Settings", icon: "⚙️", path: "/employer/settings" },
          { name: "Help Center", icon: "❓", path: "/employer/help" },
     ]

     return (
          <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
               {/* Logo */}
               <div className="p-6 border-b border-gray-200">
                    <Link href="/employer/dashboard" className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-bold text-lg">J</span>
                         </div>
                         <span className="text-xl font-bold text-gray-900">JobBoost</span>
                    </Link>
               </div>

               {/* Navigation */}
               <nav className="flex-1 p-4">
                    <ul className="space-y-1">
                         {navItems.map((item) => {
                              const isActive = pathname === item.path
                              return (
                                   <li key={item.path}>
                                        <Link
                                             href={item.path}
                                             className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                                                  }`}
                                        >
                                             <span className="text-xl">{item.icon}</span>
                                             <span>{item.name}</span>
                                             {item.badge && (
                                                  <span className="ml-auto bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                       {item.badge}
                                                  </span>
                                             )}
                                             {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r" />}
                                        </Link>
                                   </li>
                              )
                         })}
                    </ul>

                    {/* Settings Section */}
                    <div className="mt-8">
                         <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Settings</p>
                         <ul className="space-y-1">
                              {settingsItems.map((item) => {
                                   const isActive = pathname === item.path
                                   return (
                                        <li key={item.path}>
                                             <Link
                                                  href={item.path}
                                                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                                                       }`}
                                             >
                                                  <span className="text-xl">{item.icon}</span>
                                                  <span>{item.name}</span>
                                             </Link>
                                        </li>
                                   )
                              })}
                         </ul>
                    </div>
               </nav>

               {/* User Profile */}
               <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                         <img src="/placeholder.svg?height=40&width=40" alt="Maria Kelly" className="w-10 h-10 rounded-full" />
                         <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">Maria Kelly</p>
                              <p className="text-xs text-gray-500 truncate">mariakelly@gmail.com</p>
                         </div>
                    </div>
               </div>
          </aside>
     )
}
