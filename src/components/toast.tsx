"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, X, AlertCircle } from "lucide-react"

export interface ToastProps {
     message: string
     type: 'success' | 'error' | 'info'
     isVisible: boolean
     onClose: () => void
     duration?: number
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
     useEffect(() => {
          if (isVisible && duration > 0) {
               const timer = setTimeout(() => {
                    onClose()
               }, duration)

               return () => clearTimeout(timer)
          }
     }, [isVisible, duration, onClose])

     if (!isVisible) return null

     const icons = {
          success: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          error: <AlertCircle className="h-5 w-5 text-red-500" />,
          info: <AlertCircle className="h-5 w-5 text-blue-500" />,
     }

     const bgColors = {
          success: 'bg-green-50 border-green-200',
          error: 'bg-red-50 border-red-200',
          info: 'bg-blue-50 border-blue-200',
     }

     const textColors = {
          success: 'text-green-800',
          error: 'text-red-800',
          info: 'text-blue-800',
     }

     return (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
               <div className={`flex items-center gap-3 p-4 border rounded-lg shadow-lg max-w-sm ${bgColors[type]}`}>
                    {icons[type]}
                    <p className={`flex-1 text-sm font-medium ${textColors[type]}`}>
                         {message}
                    </p>
                    <button
                         onClick={onClose}
                         className={`rounded-full p-1 hover:bg-white/50 ${textColors[type]}`}
                    >
                         <X className="h-4 w-4" />
                    </button>
               </div>
          </div>
     )
}

// Hook để sử dụng toast
export function useToast() {
     const [toast, setToast] = useState<{
          message: string
          type: 'success' | 'error' | 'info'
          isVisible: boolean
     }>({
          message: '',
          type: 'info',
          isVisible: false,
     })

     const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
          setToast({
               message,
               type,
               isVisible: true,
          })
     }

     const hideToast = () => {
          setToast(prev => ({ ...prev, isVisible: false }))
     }

     const ToastComponent = () => (
          <Toast
               message={toast.message}
               type={toast.type}
               isVisible={toast.isVisible}
               onClose={hideToast}
          />
     )

     return {
          showToast,
          hideToast,
          ToastComponent,
     }
}