'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { Product } from '@/lib/types'

interface ProductsListProps {
  products: Product[]
}

export default function ProductsList({ products: initialProducts }: ProductsListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    setIsDeleting(productId)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete product')
      }
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Failed to delete product. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Product
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Category
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Price
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Stock
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {initialProducts.map((product) => (
            <tr key={product.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="flex items-center">
                  <td className="px-4 py-2">
                    {product.image_url && (
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                  </td>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-gray-500">{product.slug}</div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.category}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                €{product.price.toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {product.stock_quantity}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  product.is_active
                    ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                    : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                }`}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-yellow-600 hover:text-yellow-900"
                  >
                    <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={isDeleting === product.id}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 