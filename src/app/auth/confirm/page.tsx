"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ConfirmPage() {
  const [loading, setLoading] = useState(true)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const hash = window.location.hash
        const params = new URLSearchParams(hash.slice(1))
        const error = params.get('error')
        if (error) {
          setError('Link xác thực không hợp lệ hoặc đã hết hạn.')
        }
        
        if (!error) {
            setConfirmed(true)
            
            // Redirect đến trang chính sau 3 giây
            setTimeout(() => {
              router.push('/')
            }, 3000)
        } else {
          setError('Link xác thực không hợp lệ hoặc đã hết hạn.')
        }
      } catch (err: unknown) {
        console.error('Unexpected error:', err)
        setError('Đã xảy ra lỗi không mong muốn')
      } finally {
        setLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Đang xác thực email...
          </h2>
          <p className="text-gray-600">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Email đã được xác thực!
          </h2>
          <p className="text-gray-600 mb-6">
            Tài khoản của bạn đã được kích hoạt thành công. Bạn sẽ được chuyển đến trang chính trong giây lát.
          </p>
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đi đến trang chính
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Xác thực thất bại
        </h2>
        <p className="text-gray-600 mb-6">
          {error || 'Không thể xác thực email. Link có thể đã hết hạn hoặc không hợp lệ.'}
        </p>
        <div className="space-y-3">
          <Link 
            href="/sign-up"
            className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đăng ký lại
          </Link>
          <Link 
            href="/login"
            className="block text-blue-600 hover:text-blue-500 text-sm"
          >
            Đã có tài khoản? Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}