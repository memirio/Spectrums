'use client'

interface NavigationProps {
  activeCategory: string | undefined
  onCategoryChange: (category: string | undefined) => void
}

export default function Navigation({ activeCategory, onCategoryChange }: NavigationProps) {
const navItems = [
    { category: undefined, label: 'All' },
    { category: 'website', label: 'Webb' },
    { category: 'fonts', label: 'Fonts' },
    { category: 'apps', label: 'Apps' },
    { category: 'packaging', label: 'Packaging' },
    { category: 'brand', label: 'Brand' },
]

  return (
    <nav className="flex items-center justify-start gap-3 md:gap-6 flex-wrap">
      {navItems.map((item) => {
        const isActive = activeCategory === item.category
        return (
          <button
            key={item.category || 'all'}
            onClick={() => onCategoryChange(item.category)}
            className={`text-xs md:text-sm font-medium transition-colors px-2 py-1 ${
              isActive
                ? 'text-gray-900 border-b border-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

