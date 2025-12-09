'use client'

import { RefObject } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
        <div className="hidden md:flex items-center gap-4">
          {/* Logo - far left */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/Logo.svg" alt="Spectrums" className="h-5 w-auto" />
          </Link>
          {/* Search bar - centered, max 500px */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-[500px] rounded-md relative flex items-center bg-[#EEEDEA]" style={{ height: '40px' }}>
            {/* Leading icon */}
            <div className="flex items-center justify-center ml-3 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.60729 5.40905C9.69145 5.40905 9.73356 5.35994 9.7546 5.28278C9.97202 4.11136 9.95802 4.08331 11.1785 3.85182C11.2627 3.83781 11.3118 3.7887 11.3118 3.70451C11.3118 3.62035 11.2627 3.57124 11.1785 3.5572C9.96502 3.31173 10.0001 3.28366 9.7546 2.12627C9.73356 2.04911 9.69145 2 9.60729 2C9.5231 2 9.48102 2.04911 9.45998 2.12627C9.21448 3.28366 9.25656 3.31173 8.03605 3.5572C7.95889 3.57124 7.90278 3.62035 7.90278 3.70451C7.90278 3.7887 7.95889 3.83781 8.03605 3.85182C9.25656 4.09735 9.24252 4.11136 9.45998 5.28278C9.48102 5.35994 9.5231 5.40905 9.60729 5.40905ZM6.2123 10.235C6.34558 10.235 6.43677 10.1508 6.45077 10.0246C6.70331 8.15168 6.76643 8.15168 8.70243 7.77994C8.8287 7.75887 8.91986 7.67472 8.91986 7.54145C8.91986 7.41518 8.8287 7.32399 8.70243 7.30295C6.76643 7.0364 6.69628 6.97326 6.45077 5.06532C6.43677 4.93908 6.34558 4.84789 6.2123 4.84789C6.08604 4.84789 5.99484 4.93908 5.98081 5.07236C5.74934 6.95222 5.65112 6.94521 3.72918 7.30295C3.60291 7.33102 3.51172 7.41518 3.51172 7.54145C3.51172 7.68172 3.60291 7.75887 3.75722 7.77994C5.66515 8.08857 5.74934 8.13768 5.98081 10.0105C5.99484 10.1508 6.08604 10.235 6.2123 10.235ZM10.9681 18C11.1505 18 11.2838 17.8667 11.3188 17.6773C11.8168 13.8334 12.357 13.2512 16.1588 12.8303C16.3552 12.8093 16.4885 12.662 16.4885 12.4796C16.4885 12.2972 16.3552 12.1569 16.1588 12.1289C12.357 11.708 11.8168 11.1258 11.3188 7.28191C11.2838 7.09252 11.1505 6.96625 10.9681 6.96625C10.7857 6.96625 10.6524 7.09252 10.6244 7.28191C10.1264 11.1258 9.57924 11.708 5.78439 12.1289C5.581 12.1569 5.44772 12.2972 5.44772 12.4796C5.44772 12.662 5.581 12.8093 5.78439 12.8303C9.57221 13.3284 10.0983 13.8404 10.6244 17.6773C10.6524 17.8667 10.7857 18 10.9681 18Z" fill="black"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0 relative h-full">
              <input
                ref={searchInputRef || null}
                type="text"
                value={searchQuery || ''}
                onChange={onSearchInputChange || (() => {})}
                onKeyDown={onSearchKeyDown || (() => {})}
                placeholder="Search for anything..."
                className="w-full h-full px-3 rounded-md border border-transparent focus:outline-none text-gray-900 placeholder-gray-500 bg-[#EEEDEA]"
                id="search-input"
                disabled={!onSearchInputChange}
                style={{ paddingRight: searchQuery ? '2.5rem' : '0.75rem' }}
              />
              {searchQuery && onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            </div>
          </div>
          {/* Buttons - right side */}
          <div className="flex gap-3 flex-shrink-0">
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
          <div className="flex items-center justify-between">
            {/* Logo - left corner */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <img src="/Logo.svg" alt="Spectrums" className="h-5 w-auto" />
            </Link>
            {/* Buttons on the right */}
            <div className="flex gap-2">
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
          </div>
          {/* Mobile search bar - always visible */}
          <div className="rounded-md relative flex items-center bg-[#EEEDEA]" style={{ height: '40px' }}>
            {/* Leading icon */}
            <div className="flex items-center justify-center ml-3 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.60729 5.40905C9.69145 5.40905 9.73356 5.35994 9.7546 5.28278C9.97202 4.11136 9.95802 4.08331 11.1785 3.85182C11.2627 3.83781 11.3118 3.7887 11.3118 3.70451C11.3118 3.62035 11.2627 3.57124 11.1785 3.5572C9.96502 3.31173 10.0001 3.28366 9.7546 2.12627C9.73356 2.04911 9.69145 2 9.60729 2C9.5231 2 9.48102 2.04911 9.45998 2.12627C9.21448 3.28366 9.25656 3.31173 8.03605 3.5572C7.95889 3.57124 7.90278 3.62035 7.90278 3.70451C7.90278 3.7887 7.95889 3.83781 8.03605 3.85182C9.25656 4.09735 9.24252 4.11136 9.45998 5.28278C9.48102 5.35994 9.5231 5.40905 9.60729 5.40905ZM6.2123 10.235C6.34558 10.235 6.43677 10.1508 6.45077 10.0246C6.70331 8.15168 6.76643 8.15168 8.70243 7.77994C8.8287 7.75887 8.91986 7.67472 8.91986 7.54145C8.91986 7.41518 8.8287 7.32399 8.70243 7.30295C6.76643 7.0364 6.69628 6.97326 6.45077 5.06532C6.43677 4.93908 6.34558 4.84789 6.2123 4.84789C6.08604 4.84789 5.99484 4.93908 5.98081 5.07236C5.74934 6.95222 5.65112 6.94521 3.72918 7.30295C3.60291 7.33102 3.51172 7.41518 3.51172 7.54145C3.51172 7.68172 3.60291 7.75887 3.75722 7.77994C5.66515 8.08857 5.74934 8.13768 5.98081 10.0105C5.99484 10.1508 6.08604 10.235 6.2123 10.235ZM10.9681 18C11.1505 18 11.2838 17.8667 11.3188 17.6773C11.8168 13.8334 12.357 13.2512 16.1588 12.8303C16.3552 12.8093 16.4885 12.662 16.4885 12.4796C16.4885 12.2972 16.3552 12.1569 16.1588 12.1289C12.357 11.708 11.8168 11.1258 11.3188 7.28191C11.2838 7.09252 11.1505 6.96625 10.9681 6.96625C10.7857 6.96625 10.6524 7.09252 10.6244 7.28191C10.1264 11.1258 9.57924 11.708 5.78439 12.1289C5.581 12.1569 5.44772 12.2972 5.44772 12.4796C5.44772 12.662 5.581 12.8093 5.78439 12.8303C9.57221 13.3284 10.0983 13.8404 10.6244 17.6773C10.6524 17.8667 10.7857 18 10.9681 18Z" fill="black"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0 relative h-full">
              <input
                ref={searchInputRef || null}
                type="text"
                value={searchQuery || ''}
                onChange={onSearchInputChange || (() => {})}
                onKeyDown={onSearchKeyDown || (() => {})}
                placeholder="Search for anything..."
                className="w-full h-full px-3 rounded-md border border-transparent focus:outline-none text-gray-900 placeholder-gray-500 bg-[#EEEDEA]"
                id="search-input"
                disabled={!onSearchInputChange}
                style={{ paddingRight: searchQuery ? '2.5rem' : '0.75rem' }}
              />
              {searchQuery && onClearSearch && (
                <button
                  onClick={onClearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

