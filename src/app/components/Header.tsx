'use client'

import { RefObject } from 'react'

interface HeaderProps {
  onSubmitClick: () => void
  onLoginClick?: () => void
  onFavouritesClick?: () => void
  onUserAccountClick?: () => void
  isLoggedIn?: boolean
  username?: string
  searchQuery?: string
  onSearchInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onSearchSubmit?: () => void
  onClearSearch?: () => void
  searchInputRef?: RefObject<HTMLInputElement | null>
}

export default function Header({ 
  onSubmitClick,
  onLoginClick,
  onFavouritesClick,
  onUserAccountClick,
  isLoggedIn = false,
  username,
  searchQuery = '',
  onSearchInputChange,
  onSearchKeyDown,
  onSearchSubmit,
  onClearSearch,
  searchInputRef
}: HeaderProps) {
  const userInitial = username ? username.charAt(0).toUpperCase() : ''
  return (
    <header className="bg-[#fbf9f4]">
      <div className="max-w-full mx-auto px-4 md:px-[52px] py-3">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Search bar - only show if search props are provided */}
          {searchInputRef && onSearchInputChange && onSearchKeyDown && onSearchSubmit && onClearSearch && (
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
                  className="flex items-center justify-center mx-2 transition-colors hover:opacity-70 cursor-pointer"
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
                  className="flex items-center justify-center mx-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ width: '32px', height: '32px' }}
                  aria-label="Search"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L21.7051 20.291C22.0955 20.6815 22.0956 21.3146 21.7051 21.7051C21.3146 22.0956 20.6815 22.0955 20.291 21.7051L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.8873 18 14.5985 17.2514 15.8574 16.0371C15.8831 16.0039 15.911 15.9719 15.9414 15.9414C15.9719 15.911 16.0039 15.8831 16.0371 15.8574C17.2514 14.5985 18 12.8873 18 11C18 7.13401 14.866 4 11 4Z" fill="black"/>
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={onSubmitClick}
              className="text-gray-900 px-4 py-2 rounded-lg hover:bg-[#f5f3ed] transition-colors cursor-pointer"
            >
              Submit
            </button>
            {isLoggedIn ? (
              <>
                <button 
                  onClick={onFavouritesClick || (() => {})}
                  className="relative text-gray-900 w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-[#f5f3ed] transition-colors cursor-pointer"
                  aria-label="Favourites"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
                    <path d="M21.4502 8.50195C21.4502 7.91086 21.3337 7.32537 21.1074 6.7793C20.8811 6.23319 20.5489 5.73723 20.1309 5.31934V5.31836C19.7131 4.90042 19.2168 4.56901 18.6709 4.34277C18.1248 4.1165 17.5393 4.00001 16.9482 4C16.3571 4 15.7717 4.1165 15.2256 4.34277C14.6796 4.569 14.1834 4.90042 13.7656 5.31836V5.31934L12.7051 6.37891C12.3145 6.76935 11.6815 6.7694 11.291 6.37891L10.2314 5.31934C9.38729 4.47518 8.24167 4.00098 7.04785 4.00098C5.85415 4.00106 4.70932 4.47525 3.86523 5.31934C3.02122 6.16347 2.54688 7.30824 2.54688 8.50195C2.54691 9.69568 3.02117 10.8405 3.86523 11.6846L11.998 19.8174L20.1309 11.6846L20.2842 11.5244C20.6308 11.1421 20.9094 10.7024 21.1074 10.2246C21.3337 9.67854 21.4502 9.09303 21.4502 8.50195ZM23.4502 8.50195C23.4502 9.35576 23.2819 10.2015 22.9551 10.9902C22.6283 11.7789 22.1487 12.4951 21.5449 13.0986L12.7051 21.9385C12.3146 22.329 11.6815 22.329 11.291 21.9385L2.45117 13.0986C1.23203 11.8794 0.546909 10.2261 0.546875 8.50195C0.546875 6.7777 1.23194 5.12353 2.45117 3.9043C3.6703 2.68531 5.32384 2.00106 7.04785 2.00098C8.77206 2.00098 10.4263 2.68513 11.6455 3.9043L11.998 4.25684L12.3506 3.9043C12.9542 3.30048 13.6712 2.82194 14.46 2.49512C15.2488 2.16827 16.0944 2 16.9482 2C17.8021 2.00001 18.6477 2.16828 19.4365 2.49512C20.225 2.82186 20.9415 3.3007 21.5449 3.9043C22.1488 4.50792 22.6282 5.22486 22.9551 6.01367C23.2819 6.80247 23.4502 7.64812 23.4502 8.50195Z" fill="currentColor"/>
                  </svg>
                </button>
                <button 
                  onClick={onUserAccountClick || (() => {})}
                  className="relative text-gray-900 w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-[#f5f3ed] transition-colors cursor-pointer font-medium"
                  aria-label="User account"
                >
                  {userInitial ? (
                    <span className="pointer-events-none">{userInitial}</span>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
                      <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C7.58172 14 4 16.2386 4 19V21H20V19C20 16.2386 16.4183 14 12 14Z" fill="currentColor"/>
                    </svg>
                  )}
                </button>
              </>
            ) : (
              <button 
                onClick={onLoginClick || (() => {})}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                Login
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile layout: stacked vertically */}
        <div className="flex md:hidden flex-col gap-3">
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              <button 
                onClick={onSubmitClick}
                className="text-gray-900 px-3 py-1.5 text-sm rounded-lg hover:bg-[#f5f3ed] transition-colors cursor-pointer"
              >
                Submit
              </button>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={onFavouritesClick || (() => {})}
                    className="relative text-gray-900 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-[#f5f3ed] transition-colors cursor-pointer"
                    aria-label="Favourites"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
                      <path d="M21.4502 8.50195C21.4502 7.91086 21.3337 7.32537 21.1074 6.7793C20.8811 6.23319 20.5489 5.73723 20.1309 5.31934V5.31836C19.7131 4.90042 19.2168 4.56901 18.6709 4.34277C18.1248 4.1165 17.5393 4.00001 16.9482 4C16.3571 4 15.7717 4.1165 15.2256 4.34277C14.6796 4.569 14.1834 4.90042 13.7656 5.31836V5.31934L12.7051 6.37891C12.3145 6.76935 11.6815 6.7694 11.291 6.37891L10.2314 5.31934C9.38729 4.47518 8.24167 4.00098 7.04785 4.00098C5.85415 4.00106 4.70932 4.47525 3.86523 5.31934C3.02122 6.16347 2.54688 7.30824 2.54688 8.50195C2.54691 9.69568 3.02117 10.8405 3.86523 11.6846L11.998 19.8174L20.1309 11.6846L20.2842 11.5244C20.6308 11.1421 20.9094 10.7024 21.1074 10.2246C21.3337 9.67854 21.4502 9.09303 21.4502 8.50195ZM23.4502 8.50195C23.4502 9.35576 23.2819 10.2015 22.9551 10.9902C22.6283 11.7789 22.1487 12.4951 21.5449 13.0986L12.7051 21.9385C12.3146 22.329 11.6815 22.329 11.291 21.9385L2.45117 13.0986C1.23203 11.8794 0.546909 10.2261 0.546875 8.50195C0.546875 6.7777 1.23194 5.12353 2.45117 3.9043C3.6703 2.68531 5.32384 2.00106 7.04785 2.00098C8.77206 2.00098 10.4263 2.68513 11.6455 3.9043L11.998 4.25684L12.3506 3.9043C12.9542 3.30048 13.6712 2.82194 14.46 2.49512C15.2488 2.16827 16.0944 2 16.9482 2C17.8021 2.00001 18.6477 2.16828 19.4365 2.49512C20.225 2.82186 20.9415 3.3007 21.5449 3.9043C22.1488 4.50792 22.6282 5.22486 22.9551 6.01367C23.2819 6.80247 23.4502 7.64812 23.4502 8.50195Z" fill="currentColor"/>
                    </svg>
                  </button>
                  <button 
                    onClick={onUserAccountClick || (() => {})}
                    className="relative text-gray-900 w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-[#f5f3ed] transition-colors cursor-pointer font-medium"
                    aria-label="User account"
                  >
                    {userInitial ? (
                      <span className="pointer-events-none">{userInitial}</span>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                        <path d="M12 14C7.58172 14 4 16.2386 4 19V21H20V19C20 16.2386 16.4183 14 12 14Z" fill="currentColor"/>
                      </svg>
                    )}
                  </button>
                </>
              ) : (
                <button 
                  onClick={onLoginClick || (() => {})}
                  className="bg-gray-900 text-white px-3 py-1.5 text-sm rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>
          </div>
          {/* Mobile search bar - only show if search props are provided */}
          {searchInputRef && onSearchInputChange && onSearchKeyDown && onSearchSubmit && onClearSearch && (
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
                  className="flex items-center justify-center mx-2 transition-colors hover:opacity-70 cursor-pointer"
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
                  className="flex items-center justify-center mx-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ width: '32px', height: '32px' }}
                  aria-label="Search"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L21.7051 20.291C22.0955 20.6815 22.0956 21.3146 21.7051 21.7051C21.3146 22.0956 20.6815 22.0955 20.291 21.7051L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.8873 18 14.5985 17.2514 15.8574 16.0371C15.8831 16.0039 15.911 15.9719 15.9414 15.9414C15.9719 15.911 16.0039 15.8831 16.0371 15.8574C17.2514 14.5985 18 12.8873 18 11C18 7.13401 14.866 4 11 4Z" fill="black"/>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

