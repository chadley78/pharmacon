'use client'

import Image from 'next/image'
import { Product } from '@/lib/types'
import { useCart } from '@/lib/context/CartContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = async () => {
    setLoading(true)
    setError(null)
    try {
      await addToCart(product)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart'
      setError(errorMessage)
      
      // If the error is about authentication, redirect to login
      if (errorMessage.includes('sign in')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRequestConsultation = () => {
    router.push(`/consultations/${product.id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={800}
              height={800}
              className="h-full w-full object-cover object-center"
              priority
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {product.name}
          </h1>

          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-gray-900">
              €{product.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700">
              {product.description}
            </div>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-md">
                {error}
              </div>
            )}
            {product.category === 'doctor_consultation' ? (
              <button
                type="button"
                onClick={handleRequestConsultation}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Request Consultation'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 