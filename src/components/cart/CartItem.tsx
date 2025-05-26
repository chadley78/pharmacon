'use client'

import { LocalCartItem } from '@/stores/cartStore'
import { TrashIcon } from '@heroicons/react/24/outline'
import { ProductImage } from '@/components/common/ProductImage'

interface CartItemProps {
  item: LocalCartItem
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, quantity = 1, dosage = 0, tablet_count = 0 } = item

  if (!product) {
    return null
  }

  const price = product.price || 0
  const totalPrice = (price * quantity).toFixed(2)

  return (
    <li className="flex py-6 sm:py-10 relative">
      <div className="flex-shrink-0">
        <ProductImage 
          product={product}
          size="md"
          className="rounded-lg"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
        <div>
          <div className="flex justify-between">
            <h4 className="text-sm">
              <a href={`/products/${product.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                {product.name}
              </a>
            </h4>
            <p className="ml-4 text-sm font-medium text-gray-900">€{totalPrice}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{dosage}mg - {tablet_count} tablets</p>
        </div>

        <div className="mt-4 flex flex-1 items-end justify-between">
          <div className="flex items-center space-x-4">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              Quantity
            </label>
            <select
              id={`quantity-${item.id}`}
              name={`quantity-${item.id}`}
              value={quantity}
              onChange={(e) => onUpdateQuantity(Number(e.target.value))}
              className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-primary-base focus:outline-none focus:ring-1 focus:ring-primary-base sm:text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onRemove}
              className="inline-flex p-2 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Remove</span>
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}