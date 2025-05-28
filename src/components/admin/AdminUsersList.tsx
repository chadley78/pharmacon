'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Toast from '@/components/ui/Toast'
import type { AdminUser } from '@/types/admin'

interface ToastState {
  message: string
  type: 'success' | 'error'
  show: boolean
}

interface AdminUsersListProps {
  admins: AdminUser[]
}

export function AdminUsersList({ admins: initialAdmins }: AdminUsersListProps) {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success', show: false })
  const router = useRouter()

  const handleDelete = async (id: string) => {
    console.log('Starting delete process for admin:', id)
    if (!confirm('Are you sure you want to remove this admin?')) {
      console.log('Delete cancelled by user')
      return
    }

    // Check if user is still authenticated
    try {
      console.log('Checking authentication status...')
      const authCheck = await fetch('/api/auth/check')
      if (!authCheck.ok) {
        console.log('Auth check failed, redirecting to login')
        router.push('/login?redirect=/admin/users')
        return
      }
      console.log('Auth check passed')
    } catch (error) {
      console.error('Error checking auth status:', error)
      router.push('/login?redirect=/admin/users')
      return
    }

    setIsDeleting(id)
    try {
      console.log('Making delete request to:', `/api/admin/users/${id}`)
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      })

      console.log('Delete response status:', response.status)
      console.log('Delete response headers:', Object.fromEntries(response.headers.entries()))

      // Handle 204 No Content response (successful deletion)
      if (response.status === 204) {
        console.log('Delete successful (204 No Content), updating UI')
        setAdmins(admins.filter(admin => admin.id !== id))
        setToast({
          message: 'Admin user deleted successfully',
          type: 'success',
          show: true
        })
        return
      }

      // For all other responses, try to parse as JSON
      const contentType = response.headers.get('content-type')
      console.log('Response content type:', contentType)
      
      if (!contentType || !contentType.includes('application/json')) {
        // If we get HTML back, it likely means we were redirected to login or there was a server error
        if (contentType?.includes('text/html')) {
          if (response.status === 500) {
            console.error('Server error occurred during delete')
            setToast({
              message: 'A server error occurred while trying to delete the admin. Please try again.',
              type: 'error',
              show: true
            })
            return
          }
          console.log('Received HTML response, redirecting to login')
          router.push('/login?redirect=/admin/users')
          return
        }
        throw new Error('Unexpected response from server')
      }

      if (!response.ok) {
        const data = await response.json()
        console.log('Delete failed with error:', data)
        setToast({
          message: data.error || 'Failed to delete admin',
          type: 'error',
          show: true
        })
        return
      }

      // This should not be reached for DELETE operations, but keeping it for completeness
      console.log('Delete successful, updating UI')
      setAdmins(admins.filter(admin => admin.id !== id))
      setToast({
        message: 'Admin user deleted successfully',
        type: 'success',
        show: true
      })
    } catch (error) {
      console.error('Error in delete process:', error)
      if (error instanceof Error) {
        if (error.message === 'Unexpected response from server') {
          setToast({
            message: 'Your session may have expired. Please try logging in again.',
            type: 'error',
            show: true
          })
          router.push('/login?redirect=/admin/users')
        } else {
          setToast({
            message: error.message,
            type: 'error',
            show: true
          })
        }
      } else {
        setToast({
          message: 'An unexpected error occurred while trying to delete the admin',
          type: 'error',
          show: true
        })
      }
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Email
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Role
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Permissions
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Created At
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {admin.user.email}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    admin.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  <div className="space-y-1">
                    {admin.can_add_admins && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        Can Add Admins
                      </span>
                    )}
                    {admin.can_delete_admins && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                        Can Delete Admins
                      </span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {format(new Date(admin.created_at), 'PPp')}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/users/${admin.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      disabled={isDeleting === admin.id}
                      className={`text-red-600 hover:text-red-900 ${
                        isDeleting === admin.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </>
  )
} 