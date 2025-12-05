'use client'

import { RefObject } from 'react'

interface HeaderProps {
  onSubmitClick: () => void
  searchQuery: string
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSearchSubmit: () => void
  onClearSearch: () => void
  searchInputRef: RefObject<HTMLInputElement>
}

export default function Header({ 
  onSubmitClick,
  searchQuery,
  onSearchInputChange,
  onSearchKeyDown,
  onSearchSubmit,
  onClearSearch,
  searchInputRef
}: HeaderProps) {
  return (
    <header className="bg-[#fbf9f4]">
      <div className="max-w-full mx-auto px-4 md:px-[52px] py-3">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Search bar */}
          <div className="flex-1 border border-gray-300 rounded-md relative flex items-center" style={{ height: '40px' }}>
            <div className="flex-1 min-w-0 relative h-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={onSearchInputChange}
                onKeyDown={onSearchKeyDown}
                placeholder="Search for anything..."
                className="w-full h-full px-3 rounded-md border border-transparent focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                id="search-input"
              />
            </div>
            {/* Icon-only button - 32px tall - shows X when query exists, search icon otherwise */}
            {searchQuery.trim() ? (
              <button
                onClick={onClearSearch}
                className="flex items-center justify-center mx-2 transition-colors hover:opacity-70"
                style={{ width: '32px', height: '32px' }}
                aria-label="Clear search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={onSearchSubmit}
                disabled={!searchQuery.trim()}
                className="flex items-center justify-center mx-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ width: '32px', height: '32px' }}
                aria-label="Search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L21.7051 20.291C22.0955 20.6815 22.0956 21.3146 21.7051 21.7051C21.3146 22.0956 20.6815 22.0955 20.291 21.7051L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.8873 18 14.5985 17.2514 15.8574 16.0371C15.8831 16.0039 15.911 15.9719 15.9414 15.9414C15.9719 15.911 16.0039 15.8831 16.0371 15.8574C17.2514 14.5985 18 12.8873 18 11C18 7.13401 14.866 4 11 4Z" fill="black"/>
                </svg>
              </button>
            )}
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
          {/* Mobile search bar */}
          <div className="border border-gray-300 rounded-md relative flex items-center" style={{ height: '40px' }}>
            <div className="flex-1 min-w-0 relative h-full">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={onSearchInputChange}
                onKeyDown={onSearchKeyDown}
                placeholder="Search for anything..."
                className="w-full h-full px-3 rounded-md border border-transparent focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                id="search-input"
              />
            </div>
            {searchQuery.trim() ? (
              <button
                onClick={onClearSearch}
                className="flex items-center justify-center mx-2 transition-colors hover:opacity-70"
                style={{ width: '32px', height: '32px' }}
                aria-label="Clear search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={onSearchSubmit}
                disabled={!searchQuery.trim()}
                className="flex items-center justify-center mx-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ width: '32px', height: '32px' }}
                aria-label="Search"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L21.7051 20.291C22.0955 20.6815 22.0956 21.3146 21.7051 21.7051C21.3146 22.0956 20.6815 22.0955 20.291 21.7051L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.8873 18 14.5985 17.2514 15.8574 16.0371C15.8831 16.0039 15.911 15.9719 15.9414 15.9414C15.9719 15.911 16.0039 15.8831 16.0371 15.8574C17.2514 14.5985 18 12.8873 18 11C18 7.13401 14.866 4 11 4Z" fill="black"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

