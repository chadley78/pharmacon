import { Suspense } from 'react'
import SuccessContent from './SuccessContent'

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900">Loading order confirmation...</h2>
          </div>
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  )
} 