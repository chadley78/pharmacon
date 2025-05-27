import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { 
  CubeIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

export default async function AdminDashboardPage() {
  const adminClient = createAdminClient()

  // Fetch some basic stats
  const [
    { count: productCount },
    { count: questionnaireCount },
    { count: orderCount },
    { count: customerCount }
  ] = await Promise.all([
    adminClient.from('products').select('*', { count: 'exact', head: true }),
    adminClient.from('questionnaire_approvals').select('*', { count: 'exact', head: true }),
    adminClient.from('orders').select('*', { count: 'exact', head: true }),
    adminClient.from('profiles').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    { name: 'Total Products', value: productCount || 0, icon: CubeIcon, href: '/admin/products' },
    { name: 'Pending Questionnaires', value: questionnaireCount || 0, icon: ClipboardDocumentListIcon, href: '/admin/questionnaires' },
    { name: 'Total Orders', value: orderCount || 0, icon: ChartBarIcon, href: '/admin/orders' },
    { name: 'Total Customers', value: customerCount || 0, icon: UsersIcon, href: '/admin/customers' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store&apos;s products and orders
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-6 py-5 shadow hover:shadow-md transition-shadow"
          >
            <dt>
              <div className="absolute rounded-md bg-yellow-50 p-3">
                <stat.icon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <div className="mt-6">
              <Link
                href="/admin/orders"
                className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Questionnaires */}
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900">Pending Questionnaires</h2>
            <div className="mt-6">
              <Link
                href="/admin/questionnaires"
                className="text-sm font-medium text-yellow-600 hover:text-yellow-500"
              >
                Review questionnaires →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 