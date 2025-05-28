'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  created_at: string
  user: {
    email: string
  }
  can_add_admins: boolean
  can_delete_admins: boolean
}

interface AdminUserFormProps {
  admin?: AdminUser
}

interface FormValues {
  email: string
  role: 'admin' | 'super_admin'
  can_add_admins: boolean
  can_delete_admins: boolean
}

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'super_admin']),
  can_add_admins: z.boolean(),
  can_delete_admins: z.boolean()
})

export function AdminUserForm({ admin }: AdminUserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: admin?.user.email ?? '',
      role: admin?.role ?? 'admin',
      can_add_admins: admin?.can_add_admins ?? false,
      can_delete_admins: admin?.can_delete_admins ?? false
    }
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = admin 
        ? `/api/admin/users/${admin.id}`
        : '/api/admin/users'
      
      const method = admin ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save admin')
      }

      router.push('/admin/users')
      router.refresh()
    } catch (error) {
      console.error('Error saving admin:', error)
      setError(error instanceof Error ? error.message : 'Failed to save admin')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            type="email"
            id="email"
            disabled={!!admin}
            {...register('email')}
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.email
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500'
            }`}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <div className="mt-1">
          <select
            id="role"
            {...register('role')}
            className={`block w-full rounded-md shadow-sm sm:text-sm ${
              errors.role
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:border-yellow-500 focus:ring-yellow-500'
            }`}
          >
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
          {errors.role && (
            <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              id="can_add_admins"
              {...register('can_add_admins')}
              className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="can_add_admins" className="font-medium text-gray-700">
              Can Add Admins
            </label>
            <p className="text-gray-500">Allow this admin to create new admin users</p>
          </div>
        </div>

        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              type="checkbox"
              id="can_delete_admins"
              {...register('can_delete_admins')}
              className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="can_delete_admins" className="font-medium text-gray-700">
              Can Delete Admins
            </label>
            <p className="text-gray-500">Allow this admin to remove other admin users</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : admin ? 'Update Admin' : 'Create Admin'}
        </button>
      </div>
    </form>
  )
} 