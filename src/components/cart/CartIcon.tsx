'use client'

import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface CartIconProps {
  className?: string
}

export default function CartIcon({ className = '' }: CartIconProps) {
  const { cart, loading } = useCart()
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Link href="/cart" className="group -m-2 flex items-center p-2">
      <ShoppingCartIcon
        className={`h-8 w-8 flex-shrink-0 text-gray-400 group-hover:text-gray-500 ${className}`}
        aria-hidden="true"
      />
      <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
        {loading ? '...' : itemCount}
      </span>
      <span className="sr-only">items in cart, view cart</span>
    </Link>
  )
} 