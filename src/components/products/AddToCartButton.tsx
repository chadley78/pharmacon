'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/stores/cartStore'
import { Product } from '@/lib/types'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  questionnaireApprovalId?: string
  dosage?: number
  tablet_count?: number
  className?: string
}

export default function AddToCartButton({
  product,
  quantity = 1,
  questionnaireApprovalId,
  dosage,
  tablet_count,
  className = ''
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const addItem = useCartStore(state => state.addItem)

  const handleAddToCart = async () => {
    try {
      setIsLoading(true)
      addItem(product, quantity, questionnaireApprovalId, dosage, tablet_count)
      router.push('/cart')
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`inline-flex items-center justify-center rounded-md border border-transparent bg-primary-base px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-base focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
} 