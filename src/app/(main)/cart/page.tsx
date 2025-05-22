import { Suspense } from 'react'
import { CartContent } from './CartContent'

export default function CartPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading cart...</div>}>
      <CartContent />
    </Suspense>
  )
} 