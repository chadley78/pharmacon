'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatAmountFromStripe } from '@/lib/stripe'
import { Order, OrderItem } from '@/lib/types'
import Image from 'next/image'

export default function SuccessPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const paymentIntentId = searchParams.get('payment_intent')

  useEffect(() => {
    const fetchOrder = async () => {
      if (!paymentIntentId) {
        setError('No payment information found')
        setLoading(false)
        return
      }

      try {
        const supabase = createClient()

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          throw new Error('Authentication required')
        }

        // Get the order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_payment_intent_id', paymentIntentId)
          .eq('user_id', user.id)
          .single()

        if (orderError) {
          throw new Error('Order not found')
        }

        setOrder(orderData)

        // Get order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            product:products(*)
          `)
          .eq('order_id', orderData.id)

        if (itemsError) {
          throw new Error('Failed to fetch order items')
        }

        setOrderItems(itemsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [paymentIntentId])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Loading order details...</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Error</h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't find your order. Please contact support if you believe this is an error.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Return to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">Thank you for your order!</h1>
        <p className="mt-2 text-sm text-gray-500">
          We&apos;ve received your order and it's being processed.
        </p>
      </div>

      <div className="mt-12">
        <div className="border-t border-gray-200 py-6">
          <h2 className="text-lg font-medium text-gray-900">Order Details</h2>
          <dl className="mt-4 space-y-4">
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Order number</dt>
              <dd className="text-sm text-gray-900">{order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="text-sm text-gray-900">
                {new Date(order.created_at).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Total</dt>
              <dd className="text-sm font-medium text-gray-900">
                €{formatAmountFromStripe(order.total).toFixed(2)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900 capitalize">{order.status}</dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200 py-6">
          <h2 className="text-lg font-medium text-gray-900">Items</h2>
          <ul className="mt-4 divide-y divide-gray-200">
            {orderItems.map((item) => (
              <li key={item.id} className="py-4 flex">
                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                  {item.product?.image_url && (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-center object-cover"
                    />
                  )}
                </div>
                <div className="ml-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>{item.product?.name || 'Product not found'}</h3>
                      <p className="ml-4">€{formatAmountFromStripe(item.price_at_time * item.quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-gray-200 py-6">
          <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
          <address className="mt-4 text-sm text-gray-500 not-italic">
            {order.shipping_address.full_name}<br />
            {order.shipping_address.address_line1}<br />
            {order.shipping_address.address_line2 && (
              <>
                {order.shipping_address.address_line2}<br />
              </>
            )}
            {order.shipping_address.city}, {order.shipping_address.postal_code}<br />
            {order.shipping_address.country}
          </address>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
} 