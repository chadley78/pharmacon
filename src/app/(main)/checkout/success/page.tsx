'use client'

import { Suspense } from 'react'
import SuccessContent from './SuccessContent'

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Loading order details...</h1>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
} 