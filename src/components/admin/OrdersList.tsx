'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Order, OrderItem, OrderStatus } from '@/lib/types'

interface OrdersListProps {
  orders: Order[]
}

export default function OrdersList({ orders: initialOrders }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const [showCancelModal, setShowCancelModal] = useState<string | null>(null)

  const toggleOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy HH:mm')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'packed':
        return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingStatus(orderId)
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const updatedOrder = await response.json()
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ))
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      setUpdatingStatus(orderId)
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: OrderStatus.CANCELLED }),
      })

      if (!response.ok) {
        throw new Error('Failed to cancel order')
      }

      const updatedOrder = await response.json()
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ))
      setShowCancelModal(null)
    } catch (error) {
      console.error('Error cancelling order:', error)
      alert('Failed to cancel order')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusButtons = (order: Order) => {
    const workflowStages = [
      { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Mark as Out for Delivery' },
      { status: OrderStatus.DELIVERED, label: 'Mark as Delivered' }
    ]

    return (
      <div className="mt-4 space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Order Status Actions</h4>
          <div className="flex flex-wrap gap-2">
            {workflowStages.map((stage) => {
              const isNextStage = (() => {
                switch (order.status) {
                  case OrderStatus.PROCESSING:
                  case OrderStatus.PACKED:
                    return stage.status === OrderStatus.OUT_FOR_DELIVERY
                  case OrderStatus.OUT_FOR_DELIVERY:
                    return stage.status === OrderStatus.DELIVERED
                  default:
                    return false
                }
              })()
              
              const isDisabled = !isNextStage || order.status === OrderStatus.CANCELLED || order.status === OrderStatus.DELIVERED

              return (
                <button
                  key={stage.status}
                  onClick={(e) => {
                    e.stopPropagation()
                    updateOrderStatus(order.id, stage.status)
                  }}
                  disabled={isDisabled || updatingStatus === order.id}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDisabled
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : updatingStatus === order.id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {updatingStatus === order.id && isNextStage ? 'Updating...' : stage.label}
                </button>
              )
            })}
          </div>
        </div>

        {order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED && (
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCancelModal(order.id)
              }}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Cancel Order
            </button>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelModal === order.id && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Order</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => cancelOrder(order.id)}
                  disabled={updatingStatus === order.id}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingStatus === order.id ? 'Cancelling...' : 'Yes, Cancel Order'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <>
              <tr 
                key={order.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleOrder(order.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.guest_email || 'Registered User'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.order_items?.length || 0} items
                </td>
              </tr>
              {expandedOrder === order.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Order ID:</span>{' '}
                        {order.id}
                      </div>
                      {order.out_for_delivery_at && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-md">
                          <div className="text-sm text-purple-800">
                            <span className="font-medium">Out for Delivery Since:</span>{' '}
                            {format(new Date(order.out_for_delivery_at), 'PPpp')}
                          </div>
                        </div>
                      )}
                      {getStatusButtons(order)}
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Shipping Address:</span>
                        <br />
                        {order.shipping_address.full_name}
                        <br />
                        {order.shipping_address.address_line1}
                        {order.shipping_address.address_line2 && (
                          <>
                            <br />
                            {order.shipping_address.address_line2}
                          </>
                        )}
                        <br />
                        {order.shipping_address.city}
                        {order.shipping_address.state && `, ${order.shipping_address.state}`}
                        <br />
                        {order.shipping_address.postal_code}
                        <br />
                        {order.shipping_address.country}
                        <br />
                        {order.shipping_address.phone}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Order Items</h4>
                        <div className="mt-2 border-t border-gray-200">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Quantity</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dosage</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tablets</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.order_items?.map((item: OrderItem) => (
                                <tr key={item.id}>
                                  <td className="px-4 py-2 text-sm text-gray-900">{item.product?.name}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500">{item.quantity}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500">{item.dosage}mg</td>
                                  <td className="px-4 py-2 text-sm text-gray-500">{item.tablet_count}</td>
                                  <td className="px-4 py-2 text-sm text-gray-500">
                                    {formatCurrency(item.product?.price || 0)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
} 