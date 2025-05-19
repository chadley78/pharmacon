'use client'

import { useState } from 'react'
import { Address } from '@/lib/types'

interface BillingFormProps {
  initialData: Address | null
  shippingAddress: Address | null
  onSubmit: (address: Address) => void
  onBack: () => void
}

export default function BillingForm({ initialData, shippingAddress, onSubmit, onBack }: BillingFormProps) {
  const [useShippingAddress, setUseShippingAddress] = useState(!initialData)
  const [formData, setFormData] = useState<Address>(initialData || {
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Ireland',
    phone: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (useShippingAddress && shippingAddress) {
      onSubmit(shippingAddress)
    } else {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide your billing address details.
        </p>
      </div>

      <div className="relative flex items-start">
        <div className="flex h-6 items-center">
          <input
            id="use-shipping"
            name="use-shipping"
            type="checkbox"
            checked={useShippingAddress}
            onChange={(e) => setUseShippingAddress(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="use-shipping" className="font-medium text-gray-900">
            Use shipping address for billing
          </label>
          <p className="text-gray-500">
            Your billing address will be the same as your shipping address.
          </p>
        </div>
      </div>

      {!useShippingAddress && (
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">
              Address Line 1
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                required
                value={formData.address_line1}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">
              Address Line 2 (Optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="address_line2"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="city"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                required
                value={formData.postal_code}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (Optional)
            </label>
            <div className="mt-1">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="country"
                name="country"
                required
                value={formData.country}
                disabled
                className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Shipping
        </button>
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  )
} 