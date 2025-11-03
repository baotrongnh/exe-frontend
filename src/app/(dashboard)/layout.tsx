"use client"

import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingScreen from "@/components/LoadingScreen"

export default function DashboardLayout({
     children,
}: {
     children: React.ReactNode
}) {
     const { user, loading, userRole } = useAuth()
     const router = useRouter()
     const [isRedirecting, setIsRedirecting] = useState(false)

     useEffect(() => {
          if (!loading) {
               // If not logged in, redirect to login
               if (!user) {
                    setIsRedirecting(true)
                    router.push('/login')
                    return
               }

               // If user is employer, redirect to employer dashboard
               if (userRole === 'employer') {
                    setIsRedirecting(true)
                    router.push('/employer/dashboard')
               }
          }
     }, [user, loading, userRole, router])

     // Show loading while checking auth or redirecting
     if (loading || isRedirecting) {
          return <LoadingScreen />
     }

     // Don't render if not authenticated or if employer
     if (!user || userRole === 'employer') {
          return null
     }

     return (
          <div className="flex h-screen bg-background">
               <DashboardSidebar />
               <main className="flex-1 overflow-auto">{children}</main>
          </div>
     )
}
