"use client"


import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { authHelpers } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { FiArrowLeft } from "react-icons/fi"
import LoadingScreen from "@/components/LoadingScreen"

export default function SignupPage() {
     const [isLoading, setIsLoading] = useState(false)
     const [isEmailLoading, setIsEmailLoading] = useState(false)
     const [error, setError] = useState("")

     const router = useRouter()
     const { user, loading } = useAuth()

     // Redirect nếu user đã đăng nhập based on role
     useEffect(() => {
          if (!loading && user) {
               const role = user.user_metadata?.role
               if (role === 'employer') {
                    router.push('/employer/dashboard')
               } else {
                    router.push('/find-jobs')
               }
          }
     }, [user, loading, router])

     // Google signup với Supabase OAuth
     const handleGoogleSignup = async () => {
          try {
               setIsLoading(true)
               setError("")

               const { error } = await authHelpers.signInWithOAuth('google')

               if (error) {
                    setError(error.message)
               }
          } catch (err: unknown) {
               setError('Đã xảy ra lỗi không mong muốn')
          } finally {
               setIsLoading(false)
          }
     }

     // Email/Password signup với Supabase
     const handleEmailSignup = async (formData: { fullName: string; email: string; password: string }) => {
          try {
               setIsEmailLoading(true)
               setError("")

               const { data, error } = await authHelpers.signUpWithEmail(
                    formData.email,
                    formData.password,
                    formData.fullName
               )

               if (error) {
                    setError(error.message)
                    return
               }

               if (data.user && !data.session) {
                    router.push(`/auth/signup-success?email=${encodeURIComponent(formData.email)}`)
               } else if (data.session) {
                    router.push('/')
               }
          } catch (err: unknown) {
               setError('Đã xảy ra lỗi không mong muốn')
          } finally {
               setIsEmailLoading(false)
          }
     }

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const signupData = {
               fullName: formData.get("fullName") as string,
               email: formData.get("email") as string,
               password: formData.get("password") as string,
          }
          await handleEmailSignup(signupData)
     }

     // Hiển thị loading trong khi kiểm tra auth state
     if (loading) {
          return <LoadingScreen />
     }

     // Nếu user đã đăng nhập, không hiển thị form
     if (user) {
          return null
     }

     return (
          <div className="relative min-h-screen bg-gray-50 flex">
               {/* Nút quay về góc trái */}
               <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 text-gray-700 py-2 px-4 rounded-lg shadow hover:bg-blue-100 hover:text-blue-700 transition-colors font-medium z-10"
               >
                    <FiArrowLeft size={20} />
                    Back
               </button>
               {/* Left Side - Hero Section */}
               <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
                    <div className="max-w-md">
                         {/* Logo */}
                         <div className="flex items-center mb-12">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                   <span className="text-white font-bold text-sm">S</span>
                              </div>
                              <span className="text-xl font-semibold text-gray-900">Sworker</span>
                         </div>

                         {/* Stats */}
                         <div className="mb-8">
                              <div className="flex items-center mb-2">
                                   <div className="w-4 h-8 bg-blue-600 rounded mr-2"></div>
                                   <div className="w-2 h-6 bg-blue-400 rounded"></div>
                              </div>
                              <h2 className="text-2xl font-bold text-gray-900 mb-1">100K+</h2>
                              <p className="text-gray-600">People got hired</p>
                         </div>

                         {/* Professional Image */}
                         <div className="relative mb-8">
                              <Image
                                   src="/images/professional-man.png"
                                   alt="Professional man in suit"
                                   width={300}
                                   height={400}
                                   className="rounded-lg"
                              />

                              {/* Testimonial Card */}
                              <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-4 max-w-xs">
                                   <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                                             <span className="text-white font-bold text-sm">K</span>
                                        </div>
                                        <div>
                                             <p className="font-semibold text-sm text-gray-900">Karen Sandler</p>
                                             <p className="text-xs text-gray-600">Lead Engineer at Canva</p>
                                        </div>
                                   </div>
                                   <p className="text-sm text-gray-700 italic">
                                        &ldquo;Great platform for the job seeker that searching for new career heights.&rdquo;
                                   </p>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Right Side - Signup Form */}
               <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="max-w-md w-full">
                         <div className="text-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-900 mb-2">Get more opportunities</h1>
                         </div>

                         <div className="space-y-6">
                              {/* Error Message */}
                              {error && (
                                   <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                   </div>
                              )}

                              {/* Google Signup Button */}
                              <button
                                   onClick={handleGoogleSignup}
                                   disabled={isLoading}
                                   className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                   {isLoading ? (
                                        <>
                                             <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                                             Đang đăng ký...
                                        </>
                                   ) : (
                                        <>
                                             <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                                  <path
                                                       fill="#4285F4"
                                                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                  />
                                                  <path
                                                       fill="#34A853"
                                                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                  />
                                                  <path
                                                       fill="#FBBC05"
                                                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                  />
                                                  <path
                                                       fill="#EA4335"
                                                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                  />
                                             </svg>
                                             Sign Up with Google
                                        </>
                                   )}
                              </button>

                              {/* Divider */}
                              <div className="relative">
                                   <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                   </div>
                                   <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-gray-50 text-gray-500">Or sign up with email</span>
                                   </div>
                              </div>

                              <form onSubmit={handleSubmit} className="space-y-4">
                                   <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                             Full name
                                        </label>
                                        <input
                                             id="fullName"
                                             name="fullName"
                                             type="text"
                                             required
                                             disabled={isEmailLoading}
                                             className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                             placeholder="Enter your full name"
                                        />
                                   </div>

                                   <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                             Email Address
                                        </label>
                                        <input
                                             id="email"
                                             name="email"
                                             type="email"
                                             required
                                             disabled={isEmailLoading}
                                             className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                             placeholder="Enter email address"
                                        />
                                   </div>

                                   <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                             Password
                                        </label>
                                        <input
                                             id="password"
                                             name="password"
                                             type="password"
                                             required
                                             disabled={isEmailLoading}
                                             className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                             placeholder="Enter password"
                                        />
                                   </div>

                                   <button
                                        type="submit"
                                        disabled={isEmailLoading}
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                   >
                                        {isEmailLoading ? (
                                             <>
                                                  <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                                  Đang đăng ký...
                                             </>
                                        ) : (
                                             'Continue'
                                        )}
                                   </button>
                              </form>

                              <p className="text-center text-sm text-gray-600">
                                   Already have an account?{" "}
                                   <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                                        Login
                                   </Link>
                              </p>

                              <p className="text-center text-xs text-gray-500">
                                   By clicking Continue, you acknowledge that you have read and accept the{" "}
                                   <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                                        Terms of Service
                                   </Link>{" "}
                                   and our{" "}
                                   <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                                        Privacy Policy
                                   </Link>
                                   .
                              </p>
                         </div>
                    </div>
               </div>
          </div>
     )
}
