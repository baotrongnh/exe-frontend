"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { authHelpers } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect nếu user đã đăng nhập
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const { error } = await authHelpers.resetPassword(email.trim())

      if (error) {
        console.error('Error sending reset email:', error.message)
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err: unknown) {
      console.error('Unexpected error:', err)
      setError('Đã xảy ra lỗi không mong muốn')
    } finally {
      setIsLoading(false)
    }
  }

  // Hiển thị loading trong khi kiểm tra auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Nếu user đã đăng nhập, không hiển thị form
  if (user) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Email đã được gửi!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong>. 
            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Không nhận được email?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Kiểm tra thư mục spam/junk</li>
              <li>• Đợi vài phút để email được gửi đến</li>
              <li>• Đảm bảo địa chỉ email chính xác</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
              className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Gửi lại email
            </button>
            <Link 
              href="/login"
              className="block text-blue-600 hover:text-blue-500 text-sm"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m2-2V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4.17M15 11v4.17" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Quên mật khẩu?</h1>
          <p className="text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi link đặt lại mật khẩu
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Nhập địa chỉ email của bạn"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Đang gửi email...
              </>
            ) : (
              'Gửi link đặt lại mật khẩu'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            href="/login"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            ← Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}