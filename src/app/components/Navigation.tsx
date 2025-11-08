'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/webbdesign', label: 'Webbdesign' },
    { href: '/typography', label: 'Typography' },
    { href: '/appdesign', label: 'App Design' },
  ]

  return (
    <nav className="flex items-center justify-center gap-6">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/webbdesign' && pathname === '/')
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

