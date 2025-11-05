"use client"

import type React from "react"
import { EmployerSidebar } from "@/components/employer-sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LoadingScreen from "@/components/LoadingScreen"

export default function EmployerLayout({
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

               // If user is not employer, redirect to normal dashboard
               if (userRole !== 'employer') {
                    setIsRedirecting(true)
                    router.push('/find-jobs')
               }
          }
     }, [user, loading, userRole, router])

     // Show loading while checking auth or redirecting
     if (loading || isRedirecting) {
          return <LoadingScreen />
     }

     // Don't render if not authenticated or if not employer
     if (!user || userRole !== 'employer') {
          return null
     }

     return (
          <div className="flex h-screen bg-gray-50">
               <EmployerSidebar />
               <main className="flex-1 overflow-auto">{children}</main>
          </div>
     )
}
