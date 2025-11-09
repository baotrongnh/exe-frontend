"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
     const router = useRouter()
     const [email, setEmail] = useState("")
     const [password, setPassword] = useState("")
     const [error, setError] = useState("")
     const [loading, setLoading] = useState(false)

     const handleLogin = async (e: React.FormEvent) => {
          e.preventDefault()
          setError("")
          setLoading(true)

          // Simple demo authentication
          if (email === "admin@sworker.com" && password === "admin123") {
               // Store admin session
               localStorage.setItem("adminAuth", "true")
               router.push("/admin/dashboard")
          } else {
               setError("Invalid email or password")
          }

          setLoading(false)
     }

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
               <div className="w-full max-w-md">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                         {/* Logo */}
                         <div className="flex items-center gap-2 mb-8">
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
                              <span className="text-xl font-bold text-gray-900">Sworker Admin</span>
                         </div>

                         <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                         <p className="text-gray-600 mb-6">Sign in to your admin account</p>

                         <form onSubmit={handleLogin} className="space-y-4">
                              <div>
                                   <Label htmlFor="email">Email</Label>
                                   <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@sworker.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="mt-1"
                                   />
                              </div>

                              <div>
                                   <Label htmlFor="password">Password</Label>
                                   <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="mt-1"
                                   />
                              </div>

                              {error && (
                                   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
                              )}

                              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                                   {loading ? "Signing in..." : "Sign in"}
                              </Button>
                         </form>

                         <div className="mt-6 text-center text-sm text-gray-600">Demo credentials: admin@sworker.com / admin123</div>
                    </div>
               </div>
          </div>
     )
}
