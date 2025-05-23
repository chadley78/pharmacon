import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'
import { highlightText } from '@/lib/utils/highlight'

interface ProductCardProps {
  product: Product
  searchQuery?: string
}

export default function ProductCard({ product, searchQuery = '' }: ProductCardProps) {
  const getGradientClass = (category: string) => {
    switch (category) {
      case 'direct_purchase':
        return 'from-yellow-400 to-yellow-100'
      case 'prescription':
        return 'from-fuchsia-700 to-pink-400'
      case 'restricted':
        return 'from-fuchsia-700 to-pink-400'
      default:
        return 'from-gray-100 to-gray-200'
    }
  }

  const getBorderHoverClass = (category: string) => {
    switch (category) {
      case 'direct_purchase':
        return 'hover:border-yellow-400'
      case 'prescription':
      case 'restricted':
        return 'hover:border-fuchsia-700'
      default:
        return 'hover:border-gray-400'
    }
  }

  return (
    <Link 
      href={`/products/${product.slug}`}
      aria-label={`View details for ${product.name}`}
      className={`group card-base ${getBorderHoverClass(product.category)}`}
    >
      <div className={`relative aspect-[4/3] w-full min-h-card sm:min-h-card-lg overflow-hidden rounded-t-card sm:rounded-t-card-lg bg-gradient-prescription ${getGradientClass(product.category)}`}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="absolute inset-0 h-full w-full object-cover object-center rounded-t-card sm:rounded-t-card-lg group-hover:scale-102 group-hover:opacity-90 group-active:scale-100 group-active:opacity-95 transition-all duration-300 ease-in-out bg-transparent"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-text-light/80">No image available</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-6 bg-text-light/80 backdrop-blur-sm rounded-b-card sm:rounded-b-card-lg">
        <h3 
          className="text-base sm:text-lg font-medium text-text-dark group-hover:text-text-dark group-active:text-text-dark transition-colors duration-300 ease-in-out"
          dangerouslySetInnerHTML={{ 
            __html: highlightText(product.name, searchQuery)
          }}
        />
        <p 
          className="mt-1 text-xs sm:text-sm text-text-dark/60 line-clamp-2"
          dangerouslySetInnerHTML={{ 
            __html: highlightText(product.description || '', searchQuery)
          }}
        />
        <p className="mt-2 text-base sm:text-lg font-medium text-text-dark group-hover:text-text-dark group-active:text-text-dark transition-colors duration-300 ease-in-out">
          €{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

// JIT seed for Tailwind gradients
export const _JIT_SEED = (
  <div className="hidden">
    from-primary-base to-primary-light from-secondary-base to-secondary-light
  </div>
) 