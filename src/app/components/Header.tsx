'use client'

import Navigation from './Navigation'

interface HeaderProps {
  onSubmitClick: () => void
}

export default function Header({ onSubmitClick }: HeaderProps) {
  return (
    <header className="bg-transparent">
      <div className="max-w-full mx-auto px-4 md:px-[52px] py-3">
        {/* Desktop layout: horizontal with centered nav */}
        <div className="hidden md:flex items-center justify-between relative">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Navigation />
          </div>
          <div className="flex gap-3 ml-auto">
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
        
        {/* Mobile layout: stacked vertically */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <button 
                onClick={onSubmitClick}
                className="text-gray-900 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Submit
              </button>
              <button 
                onClick={() => {}}
                className="border border-gray-300 text-gray-900 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </button>
            </div>
          </div>
          <div className="w-full">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  )
}

