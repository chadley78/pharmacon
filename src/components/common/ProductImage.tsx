'use client'

import Image from 'next/image'
import { useState } from 'react'
import { getProductImageUrl } from '@/lib/utils/images'

interface ProductImageProps {
  product: {
    id: string
    name: string
    image_url: string | null
    gender: 'male' | 'female' | 'either' | null
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
  priority?: boolean
}

const sizeMap = {
  sm: { width: 64, height: 64 },
  md: { width: 96, height: 96 },
  lg: { width: 192, height: 192 }
}

export function ProductImage({ 
  product, 
  size, 
  className = '',
  priority = false 
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const dimensions = size ? sizeMap[size] : undefined
  
  const imageUrl = !error ? getProductImageUrl(product) : null

  return (
    <div 
      className={`relative ${className}`} 
      style={dimensions}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`${className || 'object-contain'}`}
          onError={() => setError(true)}
          sizes={dimensions ? `(max-width: 768px) ${dimensions.width}px, ${dimensions.width}px` : '100vw'}
          quality={75}
          priority={priority}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <span className="text-gray-400 text-sm">No image</span>
        </div>
      )}
    </div>
  )
} 