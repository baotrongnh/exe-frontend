"use client"

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SignupSuccessContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || 'your email'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Kiểm tra email của bạn
        </h2>
        
        <p className="text-gray-600 mb-6">
          Chúng tôi đã gửi email xác thực đến <strong>{email}</strong>. 
          Vui lòng kiểm tra hộp thư và click vào link để kích hoạt tài khoản.
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

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    }>
      <SignupSuccessContent />
    </Suspense>
  )
}