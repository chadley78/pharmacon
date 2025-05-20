import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const getGradientClass = (category: string) => {
    switch (category) {
      case 'direct_purchase':
        return 'from-yellow-400 to-yellow-100'
      case 'questionnaire_prescription':
        return 'from-fuchsia-700 to-pink-400'
      case 'doctor_consultation':
        return 'from-fuchsia-700 to-pink-400'
      default:
        return 'from-gray-100 to-gray-200'
    }
  }

  const getBorderHoverClass = (category: string) => {
    switch (category) {
      case 'direct_purchase':
        return 'hover:border-yellow-400'
      case 'questionnaire_prescription':
      case 'doctor_consultation':
        return 'hover:border-fuchsia-700'
      default:
        return 'hover:border-gray-400'
    }
  }

  return (
    <Link 
      href={`/products/${product.slug}`}
      aria-label={`View details for ${product.name}`}
      className={`group block rounded-[16px] sm:rounded-[24px] border border-gray-200 shadow-md hover:shadow-xl active:shadow-lg hover:scale-[1.02] active:scale-[0.98] transform transition-all duration-300 ease-in-out ${getBorderHoverClass(product.category)} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-700 focus-visible:ring-offset-2`}
    >
      <div className={`relative aspect-w-1 aspect-h-1 w-full min-h-[200px] sm:min-h-[300px] overflow-hidden rounded-t-[16px] sm:rounded-t-[24px] bg-gradient-to-br ${getGradientClass(product.category)}`}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={500}
            height={500}
            className="absolute inset-0 h-full w-full object-cover object-center rounded-t-[16px] sm:rounded-t-[24px] group-hover:scale-102 group-hover:opacity-90 group-active:scale-100 group-active:opacity-95 transition-all duration-300 ease-in-out"
            style={{ background: 'transparent' }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <span className="text-white/80">No image available</span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-6 bg-white/80 backdrop-blur-sm rounded-b-[16px] sm:rounded-b-[24px]">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-900 group-active:text-black transition-colors duration-300 ease-in-out">
          {product.name}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-2 text-base sm:text-lg font-medium text-gray-900 group-hover:text-gray-900 group-active:text-black transition-colors duration-300 ease-in-out">
          €{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

// JIT seed for Tailwind gradients
export const _JIT_SEED = (
  <div className="hidden">
    from-xefagSleepBase to-xefagSleepTint from-xefagRelaxBase to-xefagRelaxTint
  </div>
) 