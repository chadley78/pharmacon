'use client'

import Image from 'next/image'
import { LocalCartItem } from '@/stores/cartStore'
import { TrashIcon } from '@heroicons/react/24/outline'

interface CartItemProps {
  item: LocalCartItem
  onRemove: () => void
  onUpdateQuantity: (quantity: number) => void
}

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const { product, quantity, dosage, tablet_count } = item

  if (!product) {
    return (
      <li className="flex py-6 sm:py-10">
        <div className="flex-shrink-0">
          <div className="h-24 w-24 rounded-md bg-gray-100 flex items-center justify-center sm:h-48 sm:w-48">
            <span className="text-gray-400 text-sm">Product not available</span>
          </div>
        </div>

        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
            <div>
              <div className="flex justify-between">
                <h3 className="text-sm font-medium text-gray-500">Product not available</h3>
              </div>
              <div className="mt-1 flex text-sm">
                {dosage && <p className="text-gray-500">Dosage: {dosage}mg</p>}
                {tablet_count && <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{tablet_count} tablets</p>}
              </div>
            </div>

            <div className="mt-4 sm:mt-0 sm:pr-9">
              <div className="absolute right-0 top-0">
                <button
                  type="button"
                  onClick={onRemove}
                  className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Remove</span>
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="flex py-6 sm:py-10">
      <div className="flex-shrink-0">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          width={150}
          height={150}
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
          <div>
            <div className="flex justify-between">
              <h3 className="text-sm">
                <a href={`/products/${product.slug}`} className="font-medium text-gray-700 hover:text-gray-800">
                  {product.name}
                </a>
              </h3>
            </div>
            <div className="mt-1 flex text-sm">
              {dosage && <p className="text-gray-500">Dosage: {dosage}mg</p>}
              {tablet_count && <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{tablet_count} tablets</p>}
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900">€{product.price.toFixed(2)}</p>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <label htmlFor={`quantity-${item.id}`} className="sr-only">
              Quantity, {product.name}
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

            <div className="absolute right-0 top-0">
              <button
                type="button"
                onClick={onRemove}
                className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Remove</span>
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  )
} 