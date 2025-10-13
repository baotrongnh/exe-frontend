"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { EmployerSidebar } from "@/components/employer-sidebar"

export default function EmployerLayout({
     children,
}: {
     children: React.ReactNode
}) {
     const router = useRouter()
     const pathname = usePathname()

     // useEffect(() => {
     //      // Check auth for all employer pages except login
     //      if (pathname !== "/employer/login") {
     //           const isAuthenticated = localStorage.getItem("employerAuth") === "true"
     //           if (!isAuthenticated) {
     //                router.push("/employer/login")
     //           }
     //      }
     // }, [pathname, router])

     // Don't show sidebar on login page
     // if (pathname === "/employer/login") {
     //      return <>{children}</>
     // }

     return (
          <div className="flex min-h-screen bg-gray-50">
               <EmployerSidebar />
               <main className="flex-1">{children}</main>
          </div>
     )
}
