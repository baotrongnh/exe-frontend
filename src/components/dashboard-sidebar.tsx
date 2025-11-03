"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, MessageSquare, FileText, Search, Building2, User, Settings, HelpCircle, FileUser, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"

const navItems = [
     { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
     { href: "/messages", label: "Messages", icon: MessageSquare, badge: 1 },
     { href: "/my-applications", label: "My Applications", icon: FileText },
     { href: "/find-jobs", label: "Find Jobs", icon: Search },
     { href: "/browse-employers", label: "Browse Employers", icon: Building2 },
     { href: "/my-profile", label: "My Profile", icon: User },
     { href: "/my-cv", label: "My CV", icon: FileUser },
]

const settingsItems = [
     { href: "/dashboard/settings", label: "Settings", icon: Settings },
     { href: "/dashboard/help", label: "Help Center", icon: HelpCircle },
]

export function DashboardSidebar() {
     const pathname = usePathname()
     const router = useRouter()

     const handleSignOut = async () => {
          try {
               await supabase.auth.signOut()
               router.push("/login")
          } catch (error) {
               console.error("Error signing out:", error)
          }
     }

     return (
          <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
               {/* Logo */}
               <div className="p-6 border-b border-border">
                    <Link href="/dashboard" className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-primary-foreground font-bold text-lg">J</span>
                         </div>
                         <span className="font-bold text-xl text-foreground">JobBoost</span>
                    </Link>
               </div>

               {/* Navigation */}
               <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                         const Icon = item.icon
                         const isActive = pathname === item.href

                         return (
                              <Link
                                   key={item.href}
                                   href={item.href}
                                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                        }`}
                              >
                                   <Icon className="w-5 h-5" />
                                   <span className="text-sm font-medium">{item.label}</span>
                                   {item.badge && <Badge className="ml-auto bg-primary text-primary-foreground">{item.badge}</Badge>}
                              </Link>
                         )
                    })}

                    {/* Settings Section */}
                    <div className="pt-6">
                         <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">SETTINGS</p>
                         {settingsItems.map((item) => {
                              const Icon = item.icon
                              const isActive = pathname === item.href

                              return (
                                   <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                                             ? "bg-primary/10 text-primary"
                                             : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                             }`}
                                   >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">{item.label}</span>
                                   </Link>
                              )
                         })}
                    </div>
               </nav>

               {/* User Profile */}
               <div className="p-4 border-t border-border space-y-3">
                    <div className="flex items-center gap-3">
                         <Avatar>
                              <AvatarImage src="/placeholder.svg?height=40&width=40" />
                              <AvatarFallback>JG</AvatarFallback>
                         </Avatar>
                         <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">Jake Gyll</p>
                              <p className="text-xs text-muted-foreground truncate">jake@gmail.com</p>
                         </div>
                    </div>
                    <Button
                         onClick={handleSignOut}
                         variant="outline"
                         className="w-full justify-center items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                         <LogOut className="w-4 h-4" />
                         <span className="text-sm font-medium">Sign Out</span>
                    </Button>
               </div>
          </aside>
     )
}
