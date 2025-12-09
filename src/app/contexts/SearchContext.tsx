'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedConcepts: string[]
  addConcept: (concept: string) => void
  removeConcept: (concept: string) => void
  clearSearch: () => void
  triggerSearch: (query?: string) => void
  triggerVibeFilter: (concept: string) => void
  navigateToGallery: () => void
  openVibeFilterModal: () => void
  shouldOpenVibeFilterModal: boolean
  clearVibeFilterModalFlag: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([])
  const [shouldOpenVibeFilterModal, setShouldOpenVibeFilterModal] = useState(false)
  
  // Determine if we're on the gallery page
  const isGalleryPage = pathname === '/all' || pathname === '/app/all'
  
  // Determine if we're on the logged-in subdomain
  const isLoggedInDomain = typeof window !== 'undefined' 
    ? window.location.hostname.startsWith('app.')
    : pathname?.startsWith('/app/')
  
  // Navigate to gallery page
  const navigateToGallery = useCallback(() => {
    const galleryPath = isLoggedInDomain ? '/app/all' : '/all'
    if (!isGalleryPage) {
      router.push(galleryPath)
    }
  }, [isGalleryPage, isLoggedInDomain, router])
  
  // Open vibe filter modal - navigate to gallery if needed, then set flag
  const openVibeFilterModal = useCallback(() => {
    const galleryPath = isLoggedInDomain ? '/app/all' : '/all'
    if (!isGalleryPage) {
      // Navigate to gallery and set flag to open modal after navigation
      setShouldOpenVibeFilterModal(true)
      router.push(galleryPath)
    } else {
      // Already on gallery page, just set the flag
      setShouldOpenVibeFilterModal(true)
    }
  }, [isGalleryPage, isLoggedInDomain, router])
  
  // Clear the vibe filter modal flag
  const clearVibeFilterModalFlag = useCallback(() => {
    setShouldOpenVibeFilterModal(false)
  }, [])
  
  // Trigger search - navigate to gallery if needed, then set query
  const triggerSearch = useCallback((query?: string) => {
    const queryToUse = query || searchQuery
    if (queryToUse.trim()) {
      navigateToGallery()
      // The Gallery component will handle the actual search
      // We just need to navigate and the query will be picked up
      setSearchQuery(queryToUse.trim())
    }
  }, [searchQuery, navigateToGallery])
  
  // Trigger vibe filter - navigate to gallery if needed, then add concept
  const triggerVibeFilter = useCallback((concept: string) => {
    if (concept.trim()) {
      navigateToGallery()
      // The Gallery component will handle adding the concept
      setSelectedConcepts(prev => {
        if (!prev.includes(concept.trim())) {
          return [...prev, concept.trim()]
        }
        return prev
      })
    }
  }, [navigateToGallery])
  
  // Add concept
  const addConcept = useCallback((concept: string) => {
    setSelectedConcepts(prev => {
      if (!prev.includes(concept.trim())) {
        return [...prev, concept.trim()]
      }
      return prev
    })
  }, [])
  
  // Remove concept
  const removeConcept = useCallback((concept: string) => {
    setSelectedConcepts(prev => prev.filter(c => c !== concept.trim()))
  }, [])
  
  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSelectedConcepts([])
  }, [])
  
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedConcepts,
        addConcept,
        removeConcept,
        clearSearch,
        triggerSearch,
        triggerVibeFilter,
        navigateToGallery,
        openVibeFilterModal,
        shouldOpenVibeFilterModal,
        clearVibeFilterModalFlag,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

