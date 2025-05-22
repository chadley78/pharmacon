import { Suspense } from 'react'
import { CheckoutPage } from './CheckoutPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  )
} 