import type React from "react"
import EmployerSidebar from "./EmployerSidebar"

interface EmployerLayoutProps {
     children: React.ReactNode
}

export default function EmployerLayout({ children }: EmployerLayoutProps) {
     return (
          <div className="flex min-h-screen bg-gray-50">
               <EmployerSidebar />
               <main className="flex-1 ml-64">{children}</main>
          </div>
     )
}
