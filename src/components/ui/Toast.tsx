'use client'

import { useEffect, useState } from 'react'
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const baseClasses = "fixed bottom-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300"
  const typeClasses = type === 'success' 
    ? 'bg-green-50 text-green-800 border border-green-200'
    : 'bg-red-50 text-red-800 border border-red-200'
  const visibilityClasses = isVisible 
    ? 'translate-y-0 opacity-100' 
    : 'translate-y-2 opacity-0'

  return (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`}>
      {type === 'success' ? (
        <CheckCircleIcon className="h-5 w-5 text-green-500" />
      ) : (
        <XCircleIcon className="h-5 w-5 text-red-500" />
      )}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
        className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  )
} 