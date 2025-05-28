'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  ClipboardDocumentListIcon, 
  CubeIcon,
  HomeIcon,
  ChartBarIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Products', href: '/admin/products', icon: CubeIcon },
  { name: 'Questionnaires', href: '/admin/questionnaires', icon: ClipboardDocumentListIcon },
  { name: 'Orders', href: '/admin/orders', icon: ChartBarIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Admin Users', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-900">Admin</h1>
      </div>
      <div className="p-4">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-yellow-50 text-yellow-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
} 