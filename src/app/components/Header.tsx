'use client'

import Link from 'next/link'
import Navigation from './Navigation'

interface HeaderProps {
  onSubmitClick: () => void
}

export default function Header({ onSubmitClick }: HeaderProps) {
  return (
    <header className="bg-transparent">
      <div className="max-w-full mx-auto px-[52px] py-6">
        <div className="flex items-center justify-between relative">
          <Link href="/" className="flex items-center">
            <img src="/Logo.png" alt="Logo" className="h-6 w-auto" />
          </Link>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Navigation />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onSubmitClick}
              className="text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Submit
            </button>
            <button 
              onClick={() => {}}
              className="border border-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
        {/* Border matching search field width */}
        <div className="px-[52px] -mx-[52px] mt-6 -mb-6">
          <div className="flex">
            <div className="flex-1 min-w-[220px] border-b border-gray-400"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

