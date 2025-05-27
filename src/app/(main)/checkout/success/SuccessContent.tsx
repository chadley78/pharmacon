'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Order, Address } from '@/lib/types'
import { useCartStore } from '@/stores/cartStore'

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cartCleared, setCartCleared] = useState(false)
  const orderId = searchParams.get('orderId')
  const paymentIntentId = searchParams.get('payment_intent')
  const guestEmail = searchParams.get('guest_email')

  useEffect(() => {
    console.log('Success Page Mount - Debug Info:', {
      orderId,
      paymentIntentId,
      guestEmail,
      allParams: Object.fromEntries(searchParams.entries())
    })

    if (!orderId) {
      router.push('/')
      return
    }

    const fetchOrder = async () => {
      try {
        const url = new URL(`/api/orders/${orderId}`, window.location.origin)
        if (guestEmail) {
          url.searchParams.set('guest_email', guestEmail)
        }
        const response = await fetch(url.toString(), {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        })
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const orderData = await response.json()
        setOrder(orderData)

        // Clear the cart only after we've successfully loaded the order
        if (!cartCleared) {
          clearCart()
          setCartCleared(true)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router, guestEmail, searchParams, paymentIntentId, clearCart, cartCleared])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">Loading order details...</h2>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-lg font-medium text-red-600">Error</h2>
          <p className="mt-2 text-gray-600">{error || 'Order not found'}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Order Successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your order. Your order number is {order.id}
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Order placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
            </div>

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Order Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.status}
              </dd>
            </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <AddressDisplay address={order.shipping_address} />
              </dd>
            </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Billing Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <AddressDisplay address={order.billing_address} />
              </dd>
        </div>

            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Items</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {order.order_items?.map((item) => (
                    <li key={item.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate">
                          {item.product?.name || 'Unknown Product'} x {item.quantity}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        €{(item.product?.price || 0 * item.quantity).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
        </div>

            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                €{order.total.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>
        </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
          Return to Home
        </button>
        {order.user_id && (
          <button
            onClick={() => router.push('/account/orders')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            View All Orders
          </button>
        )}
      </div>
    </div>
  )
}

function AddressDisplay({ address }: { address: Address }) {
  return (
    <div>
      <p>{address.full_name}</p>
      <p>{address.address_line1}</p>
      {address.address_line2 && <p>{address.address_line2}</p>}
      <p>{address.city}{address.state ? `, ${address.state}` : ''} {address.postal_code}</p>
      <p>{address.country}</p>
      <p>{address.phone}</p>
    </div>
  )
} 