"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
     LayoutDashboard,
     MessageSquare,
     FileText,
     Search,
     Building2,
     User,
     Settings,
     HelpCircle,
     Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const menuItems = [
     { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
     { icon: MessageSquare, label: "Messages", href: "/messages", badge: 1 },
     { icon: FileText, label: "My Applications", href: "/applications" },
     { icon: Search, label: "Find Jobs", href: "/find-jobs" },
     { icon: Building2, label: "Browse Employers", href: "/employers" },
     { icon: User, label: "My Public Profile", href: "/profile" },
]

const settingsItems = [
     { icon: Settings, label: "Settings", href: "/settings" },
     { icon: HelpCircle, label: "Help Center", href: "/help" },
]

export function Sidebar() {
     const pathname = usePathname()

     return (
          <aside className="w-[176px] bg-background border-r border-border flex flex-col h-screen fixed left-0 top-0">
               {/* Logo */}
               <div className="p-6 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                         <Circle className="w-4 h-4 text-white fill-white" />
                    </div>
                    <span className="font-semibold text-lg text-foreground">JobBoost</span>
               </div>

               {/* Main Navigation */}
               <nav className="flex-1 px-3">
                    <ul className="space-y-1">
                         {menuItems.map((item) => {
                              const Icon = item.icon
                              const isActive = pathname === item.href
                              return (
                                   <li key={item.href}>
                                        <Link
                                             href={item.href}
                                             className={cn(
                                                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors relative",
                                                  isActive
                                                       ? "bg-indigo-50 text-indigo-600"
                                                       : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                             )}
                                        >
                                             <Icon className="w-5 h-5" />
                                             <span>{item.label}</span>
                                             {item.badge && (
                                                  <span className="absolute right-3 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                                                       {item.badge}
                                                  </span>
                                             )}
                                        </Link>
                                   </li>
                              )
                         })}
                    </ul>

                    {/* Settings Section */}
                    <div className="mt-8">
                         <p className="px-3 text-xs font-medium text-muted-foreground mb-2">SETTINGS</p>
                         <ul className="space-y-1">
                              {settingsItems.map((item) => {
                                   const Icon = item.icon
                                   const isActive = pathname === item.href
                                   return (
                                        <li key={item.href}>
                                             <Link
                                                  href={item.href}
                                                  className={cn(
                                                       "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                                                       isActive
                                                            ? "bg-indigo-50 text-indigo-600"
                                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                                  )}
                                             >
                                                  <Icon className="w-5 h-5" />
                                                  <span>{item.label}</span>
                                             </Link>
                                        </li>
                                   )
                              })}
                         </ul>
                    </div>
               </nav>

               {/* User Profile */}
               <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3">
                         <Avatar className="w-10 h-10">
                              <AvatarImage src="/placeholder.svg?height=40&width=40" />
                              <AvatarFallback>JG</AvatarFallback>
                         </Avatar>
                         <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">Jake Gyll</p>
                              <p className="text-xs text-muted-foreground truncate">jakegyll@email.com</p>
                         </div>
                    </div>
               </div>
          </aside>
     )
}
