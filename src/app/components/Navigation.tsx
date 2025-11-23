'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

const navItems = [
  { href: '/all', label: 'All' },
  { href: '/webb', label: 'Webb' },
  { href: '/fonts', label: 'Fonts' },
  { href: '/apps', label: 'Apps' },
  { href: '/packaging', label: 'Packaging' },
  { href: '/brand', label: 'Brand' },
]

  return (
    <nav className="flex items-center justify-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/all' && pathname === '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              isActive
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

