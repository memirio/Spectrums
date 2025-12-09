'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Header from '../components/Header'
import SubmissionForm from '../components/SubmissionForm'
import { useSearch } from '../contexts/SearchContext'

interface Site {
  id: string
  title: string
  description: string | null
  url: string
  imageUrl: string
  author: string | null
  tags: Array<{ id: string; name: string }>
  imageId?: string
  category?: string
}

interface Collection {
  id: string
  name: string
  description: string
  createdAt: Date
  images?: Array<{ id: string; url: string }> // Images in the collection
}

export default function CollectionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const globalSearch = useSearch()
  const [sites, setSites] = useState<Site[]>([])
  const [allSites, setAllSites] = useState<Site[]>([]) // Store all sites for filtering
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(globalSearch.searchQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Sync with global context
  useEffect(() => {
    setSearchQuery(globalSearch.searchQuery)
  }, [globalSearch.searchQuery])
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [isAccountDrawerOpen, setIsAccountDrawerOpen] = useState(false)
  const [isAccountSettingsView, setIsAccountSettingsView] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [repeatPasswordValue, setRepeatPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [currentEditView, setCurrentEditView] = useState<'email' | 'password' | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showCreateCollectionModal, setShowCreateCollectionModal] = useState(false)
  const [collectionName, setCollectionName] = useState('')
  const [collectionDescription, setCollectionDescription] = useState('')
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [editCollectionName, setEditCollectionName] = useState('')
  const [editCollectionDescription, setEditCollectionDescription] = useState('')
  
  const isLoggedIn = status === 'authenticated' && !!session?.user

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/collections')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      fetchCollections()
      fetchSavedImages()
    }
  }, [status, session])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections')
      if (!response.ok) {
        console.error('[collections] Failed to fetch collections:', response.status)
        setCollections([])
        return
      }
      const data = await response.json()
      const fetchedCollections = data.collections || []
      
      setCollections(fetchedCollections.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        createdAt: new Date(c.createdAt),
        images: c.images || []
      })))
    } catch (error) {
      console.error('[collections] Error fetching collections:', error)
      setCollections([])
    }
  }

  const fetchSavedImages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/saved-images')
      if (!response.ok) {
        console.error('[collections] Failed to fetch saved images:', response.status)
        setSites([])
        return
      }
      const data = await response.json()
      const savedImages = data.savedImages || []
      
      // Convert saved images to Site format
      const sitesFromSaved = savedImages.map((saved: any) => {
        const image = saved.image
        const site = image?.site
        return {
          id: site?.id || image?.id,
          title: site?.title || 'Untitled',
          description: site?.description || null,
          url: site?.url || image?.url || '',
          imageUrl: image?.url || '',
          author: site?.author || null,
          tags: [],
          imageId: image?.id,
          category: image?.category || 'website',
        } as Site
      })
      
      setSites(sitesFromSaved)
      setAllSites(sitesFromSaved) // Store all sites for filtering
    } catch (error) {
      console.error('[collections] Error fetching saved images:', error)
      setSites([])
      setAllSites([])
    } finally {
      setLoading(false)
    }
  }

  // Filter sites based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSites(allSites)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = allSites.filter(site => {
      const titleMatch = site.title?.toLowerCase().includes(query)
      const descriptionMatch = site.description?.toLowerCase().includes(query)
      const urlMatch = site.url?.toLowerCase().includes(query)
      return titleMatch || descriptionMatch || urlMatch
    })
    setSites(filtered)
  }, [searchQuery, allSites])

  // Search handlers
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    globalSearch.setSearchQuery(value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearchSubmit()
    }
  }

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      globalSearch.triggerSearch(searchQuery.trim())
    }
  }

  const clearSearchQuery = () => {
    setSearchQuery('')
    globalSearch.clearSearch()
  }

  const handleUnsave = async (imageId: string) => {
    try {
      const response = await fetch(`/api/saved-images?imageId=${imageId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        // Remove from local state
        setAllSites(prev => prev.filter(site => site.imageId !== imageId))
        setSites(prev => prev.filter(site => site.imageId !== imageId))
      }
    } catch (error) {
      console.error('[collections] Error unsaving image:', error)
    }
  }

  const handlePasswordUpdate = async () => {
    // Clear previous errors
    setPasswordError('')

    // Validate passwords
    if (!passwordValue || !repeatPasswordValue) {
      setPasswordError('Both fields are required')
      return
    }

    if (passwordValue !== repeatPasswordValue) {
      setPasswordError('Passwords do not match')
      return
    }

    if (passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters')
      return
    }

    try {
      setIsUpdatingPassword(true)
      const response = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordValue }),
      })

      if (!response.ok) {
        const data = await response.json()
        setPasswordError(data.error || 'Failed to update password')
        return
      }

      // Success - clear form and close edit view
      setPasswordValue('')
      setRepeatPasswordValue('')
      setCurrentEditView(null)
    } catch (error) {
      console.error('[collections] Error updating password:', error)
      setPasswordError('Failed to update password')
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleSubmissionSuccess = () => {
    setShowSubmissionForm(false)
    // Optionally refresh the page or show a success message
  }

  // Show nothing while checking authentication
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Only show content if authenticated
  if (status !== 'authenticated' || !session?.user) {
    return null
  }

  return (
    <div className="h-screen bg-[#fbf9f4] flex overflow-hidden relative">
      {/* Content area - Drawer and main content side by side */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile: Floating chevron button when collapsed */}
        {isMobile && isDrawerCollapsed && (
          <button
            onClick={() => setIsDrawerCollapsed(false)}
            className="fixed top-20 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:bg-[#f5f3ed] transition-colors md:hidden cursor-pointer"
            aria-label="Expand drawer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Mobile backdrop when drawer is open */}
        {isMobile && !isDrawerCollapsed && (
          <div 
            className="fixed inset-0 z-[55] md:hidden"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)' }}
            onClick={() => setIsDrawerCollapsed(true)}
          />
        )}

        {/* Left Drawer - Dynamic, max width 280px - Below menu */}
        <div className={`bg-[#fbf9f4] border-r border-gray-300 transition-all duration-300 ease-in-out ${
          isMobile 
            ? (isDrawerCollapsed ? 'hidden' : 'fixed left-0 top-[73px] z-[60] w-[280px] h-[calc(100vh-73px)] shadow-lg') 
            : (isDrawerOpen ? (isDrawerCollapsed ? 'w-20' : 'w-[280px]') : 'w-0')
        } overflow-hidden flex flex-col h-full`}>
          {/* Collapse button at top of drawer - sticky */}
          <div className="sticky top-0 z-50 bg-[#fbf9f4] px-6 py-3 border-b border-gray-300 flex items-center justify-end">
            <button
              onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
              className="p-1 text-gray-600 hover:text-gray-900 hover:bg-[#f5f3ed] rounded transition-colors cursor-pointer"
              aria-label={isDrawerCollapsed ? 'Expand drawer' : 'Collapse drawer'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 2C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H19ZM10 20H19C19.5523 20 20 19.5523 20 19V10H10V20ZM4 19C4 19.5523 4.44772 20 5 20H8V10H4V19ZM5 4C4.44772 4 4 4.44772 4 5V8H20V5C20 4.44772 19.5523 4 19 4H5Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
          
          {/* Drawer content - scrollable */}
          <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${isDrawerCollapsed ? 'hidden' : ''}`}>
            {/* Add vibes button */}
            <button
              onClick={() => {
                // Navigate to gallery and open vibe filter modal
                globalSearch.openVibeFilterModal()
              }}
              className="w-full mb-4 px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-[#f5f3ed] transition-colors text-sm font-medium cursor-pointer"
            >
              + Vibe filter
            </button>
          </div>
        </div>

        {/* Right Content Area - Fixed height, flex column - Full width on mobile when drawer collapsed */}
        <div className={`flex-1 transition-all duration-300 ease-in-out min-w-0 flex flex-col overflow-hidden h-full ${
          isMobile && isDrawerCollapsed ? 'w-full' : ''
        }`}>
          {/* Header */}
          <div className="flex-shrink-0 z-50">
            <Header 
              onSubmitClick={() => setShowSubmissionForm(true)}
              onLoginClick={() => router.push('/login')}
              onFavouritesClick={() => router.push('/collections')}
              onUserAccountClick={() => setIsAccountDrawerOpen(true)}
              isLoggedIn={isLoggedIn}
              username={session?.user?.username}
              searchQuery={searchQuery}
              onSearchInputChange={handleSearchInputChange}
              onSearchKeyDown={handleSearchKeyDown}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={clearSearchQuery}
              searchInputRef={inputRef}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-[52px] py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Collections</h1>
        
        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Create Collection Placeholder Card - Always first */}
          <div className="group">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
              {/* 3-image grid layout with empty states */}
              <div className="w-full h-full flex">
                {/* Left side - Large empty state (50% width, 100% height) */}
                <div className="w-1/2 h-full bg-[#E2DFDA] relative overflow-hidden border-r border-gray-50">
                  <div className="w-full h-full bg-[#E2DFDA]"></div>
                </div>
                {/* Right side - 2 stacked empty states (50% width each, 50% height each) */}
                <div className="w-1/2 h-full flex flex-col">
                  {/* Top right empty state (50% width, 50% height) */}
                  <div className="w-full h-1/2 bg-[#E2DFDA] relative overflow-hidden border-b border-gray-50">
                    <div className="w-full h-full bg-[#E2DFDA]"></div>
                  </div>
                  {/* Bottom right empty state (50% width, 50% height) */}
                  <div className="w-full h-1/2 bg-[#E2DFDA] relative overflow-hidden">
                    <div className="w-full h-full bg-[#E2DFDA]"></div>
                  </div>
                </div>
              </div>
              {/* Button overlay - centered */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <button
                  onClick={() => setShowCreateCollectionModal(true)}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  Create collection
                </button>
              </div>
            </div>
          </div>
          
          {/* Collection Cards */}
          {collections.map((collection) => (
                  <div 
                    key={collection.id} 
                    className="group cursor-pointer"
                    onClick={() => router.push(`/collections/${encodeURIComponent(collection.name)}`)}
                  >
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                      {/* 3-image grid layout */}
                      <div className="w-full h-full flex">
                        {/* Left side - Large image (50% width, 100% height) */}
                        <div className="w-1/2 h-full bg-[#E2DFDA] relative overflow-hidden border-r border-gray-50">
                          {collection.images && collection.images[0] ? (
                            <img
                              src={collection.images[0].url}
                              alt={collection.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-[#E2DFDA]"></div>
                          )}
                        </div>
                        {/* Right side - 2 stacked images (50% width each, 50% height each) */}
                        <div className="w-1/2 h-full flex flex-col">
                          {/* Top right image (50% width, 50% height) */}
                          <div className="w-full h-1/2 bg-[#E2DFDA] relative overflow-hidden border-b border-gray-50">
                            {collection.images && collection.images[1] ? (
                              <img
                                src={collection.images[1].url}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-[#E2DFDA]"></div>
                            )}
                          </div>
                          {/* Bottom right image (50% width, 50% height) */}
                          <div className="w-full h-1/2 bg-[#E2DFDA] relative overflow-hidden">
                            {collection.images && collection.images[2] ? (
                              <img
                                src={collection.images[2].url}
                                alt={collection.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-[#E2DFDA]"></div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Scrim overlay - appears on hover */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                      {/* Action button container - appears on hover */}
                      <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        {/* Button with icon - positioned on the right */}
                        <div className="flex ml-auto">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setEditingCollection(collection)
                              setEditCollectionName(collection.name)
                              setEditCollectionDescription(collection.description)
                              setShowEditCollectionModal(true)
                            }}
                            className="p-2 hover:bg-black/20 rounded-md transition-opacity cursor-pointer z-20"
                            aria-label="Edit collection"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 1.17188C19.5026 1.17187 20.0005 1.2706 20.4648 1.46289C20.9293 1.65526 21.3516 1.93755 21.707 2.29297C22.0625 2.64846 22.3447 3.07068 22.5371 3.53516C22.7295 3.99955 22.8281 4.49735 22.8281 5C22.8281 5.50275 22.7295 6.00133 22.5371 6.46582C22.3447 6.9301 22.0624 7.35165 21.707 7.70703L8.20703 21.207C8.08398 21.3301 7.93058 21.4191 7.7627 21.4648L2.2627 22.9648C1.91659 23.0591 1.54663 22.9607 1.29297 22.707C1.03938 22.4533 0.940823 22.0834 1.03516 21.7373L2.53516 16.2373L2.57715 16.1143C2.62721 15.9946 2.70066 15.8853 2.79297 15.793L16.293 2.29297C16.6484 1.93755 17.0708 1.65526 17.5352 1.46289C17.9995 1.27059 18.4974 1.17188 19 1.17188ZM19 3.17188C18.7599 3.17188 18.5216 3.21964 18.2998 3.31152C18.0783 3.40338 17.8766 3.53748 17.707 3.70703L4.39453 17.0186L3.4248 20.5742L6.98047 19.6045L20.293 6.29297C20.4627 6.12324 20.5976 5.92192 20.6895 5.7002C20.7813 5.47836 20.8281 5.24012 20.8281 5C20.8281 4.76007 20.7812 4.52245 20.6895 4.30078C20.5976 4.07895 20.4628 3.87681 20.293 3.70703C20.1234 3.53748 19.9217 3.40337 19.7002 3.31152C19.4784 3.21965 19.2401 3.17187 19 3.17188Z" fill="white"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{collection.description}</p>
                      )}
                    </div>
                  </div>
                ))}
        </div>
            
        {/* Saved Images Grid */}
        {sites.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sites.map((site, index) => (
              <div key={`${site.id}-${index}`} className="group">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                  {site.imageUrl ? (
                    <img
                      src={site.imageUrl}
                      alt={site.title}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="h-full bg-gray-200 flex items-center justify-center absolute inset-0">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  {/* Scrim overlay - appears on hover */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  {/* Action buttons container - appears on hover */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Visit
                    </a>
                    {site.imageId && (
                      <button
                        onClick={() => handleUnsave(site.imageId!)}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{site.title}</h3>
                  {site.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{site.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Collection Modal */}
      {showEditCollectionModal && editingCollection && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="relative mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit collection</h2>
                <button
                  onClick={() => {
                    setShowEditCollectionModal(false)
                    setEditingCollection(null)
                    setEditCollectionName('')
                    setEditCollectionDescription('')
                  }}
                  className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editCollectionName}
                    onChange={(e) => setEditCollectionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-[#EEEDEA]"
                    placeholder="Enter collection name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editCollectionDescription}
                    onChange={(e) => setEditCollectionDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-[#EEEDEA]"
                    placeholder="Enter collection description"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await fetch(`/api/collections/${editingCollection.id}`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          name: editCollectionName.trim(),
                          description: editCollectionDescription.trim()
                        })
                      })

                      if (!response.ok) {
                        const error = await response.json()
                        console.error('[collections] Failed to update collection:', error)
                        return
                      }

                      const data = await response.json()
                      const updatedCollection = {
                        id: data.collection.id,
                        name: data.collection.name,
                        description: data.collection.description || '',
                        createdAt: new Date(data.collection.createdAt),
                        images: data.collection.images || []
                      }
                      
                      setCollections(prev => prev.map(c => 
                        c.id === editingCollection.id ? updatedCollection : c
                      ))
                      setShowEditCollectionModal(false)
                      setEditingCollection(null)
                      setEditCollectionName('')
                      setEditCollectionDescription('')
                    } catch (error) {
                      console.error('[collections] Error updating collection:', error)
                    }
                  }}
                  disabled={!editCollectionName.trim()}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this collection?')) {
                      try {
                        const response = await fetch(`/api/collections/${editingCollection.id}`, {
                          method: 'DELETE'
                        })

                        if (!response.ok) {
                          const error = await response.json()
                          console.error('[collections] Failed to delete collection:', error)
                          return
                        }

                        setCollections(prev => prev.filter(c => c.id !== editingCollection.id))
                        setShowEditCollectionModal(false)
                        setEditingCollection(null)
                        setEditCollectionName('')
                        setEditCollectionDescription('')
                      } catch (error) {
                        console.error('[collections] Error deleting collection:', error)
                      }
                    }
                  }}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors cursor-pointer"
                >
                  Delete collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateCollectionModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="relative mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create collection</h2>
                <button
                  onClick={() => {
                    setShowCreateCollectionModal(false)
                    setCollectionName('')
                    setCollectionDescription('')
                  }}
                  className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-[#EEEDEA]"
                    placeholder="Enter collection name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={collectionDescription}
                    onChange={(e) => setCollectionDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-[#EEEDEA]"
                    placeholder="Enter collection description"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/collections', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          name: collectionName.trim(),
                          description: collectionDescription.trim()
                        })
                      })

                      if (!response.ok) {
                        const error = await response.json()
                        console.error('[collections] Failed to create collection:', error)
                        return
                      }

                      const data = await response.json()
                      const newCollection = {
                        id: data.collection.id,
                        name: data.collection.name,
                        description: data.collection.description || '',
                        createdAt: new Date(data.collection.createdAt),
                        images: data.collection.images || []
                      }
                      
                      setCollections(prev => [...prev, newCollection])
                      setShowCreateCollectionModal(false)
                      setCollectionName('')
                      setCollectionDescription('')
                    } catch (error) {
                      console.error('[collections] Error creating collection:', error)
                    }
                  }}
                  disabled={!collectionName.trim()}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <SubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={handleSubmissionSuccess}
          onLoginClick={() => {
            setShowSubmissionForm(false)
            router.push('/login')
          }}
          onCreateAccountClick={() => {
            setShowSubmissionForm(false)
          }}
        />
      )}

      {/* Account Drawer - slides from right */}
      {isAccountDrawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[70] transition-opacity"
            onClick={() => {
              setIsAccountDrawerOpen(false)
              setIsAccountSettingsView(false)
              setCurrentEditView(null)
            }}
          />
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full md:w-[440px] bg-[#fbf9f4] border-l border-gray-300 z-[71] shadow-xl transition-transform duration-300 ease-in-out flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-[#fbf9f4] p-4 md:p-6 flex items-center justify-between">
              {(isAccountSettingsView || currentEditView) ? (
                <button
                  onClick={() => {
                    if (currentEditView) {
                      setCurrentEditView(null)
                    } else {
                      setIsAccountSettingsView(false)
                    }
                  }}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-[#f5f3ed] rounded transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ) : (
                <div></div>
              )}
              <button
                onClick={() => {
                  setIsAccountDrawerOpen(false)
                  setIsAccountSettingsView(false)
                  setCurrentEditView(null)
                }}
                className="p-1 text-gray-600 hover:text-gray-900 hover:bg-[#f5f3ed] rounded transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            {/* Content */}
            {!isAccountSettingsView ? (
              /* Main Account View */
              <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col items-center justify-center">
                {session?.user && (
                  <div className="flex flex-col items-center mb-auto">
                    <div className="w-[72px] h-[72px] rounded-full bg-black flex items-center justify-center text-4xl font-medium text-white mb-4">
                      {session.user.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">{session.user.username}</h3>
                    {session.user.email && (
                      <p className="text-sm text-gray-600 mb-4">{session.user.email}</p>
                    )}
                    <button
                      onClick={() => {
                        setIsAccountSettingsView(true)
                        setEmailValue(session.user.email || '')
                      }}
                      className="text-gray-900 px-4 py-2 rounded-lg hover:bg-[#f5f3ed] transition-colors cursor-pointer"
                    >
                      Account settings
                    </button>
                  </div>
                )}
              </div>
            ) : currentEditView ? (
              /* Edit Views (Email or Password) */
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {session?.user && (
                  <div className="space-y-4">
                    {currentEditView === 'email' ? (
                      <>
                        <div className="mb-6">
                          <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                          <input
                            type="email"
                            value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-[#EEEDEA]"
                            autoFocus
                          />
                        </div>
                        <button
                          onClick={() => {
                            // TODO: Update email
                            console.log('Updating email:', emailValue)
                            setCurrentEditView(null)
                          }}
                          className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          Update
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-bold text-gray-900 mb-2">New password</label>
                          <input
                            type="password"
                            value={passwordValue}
                            onChange={(e) => {
                              setPasswordValue(e.target.value)
                              setPasswordError('')
                            }}
                            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-[#EEEDEA]"
                            autoFocus
                          />
                        </div>
                        <div className="mb-6">
                          <label className="block text-sm font-bold text-gray-900 mb-2">Repeat new password</label>
                          <input
                            type="password"
                            value={repeatPasswordValue}
                            onChange={(e) => {
                              setRepeatPasswordValue(e.target.value)
                              setPasswordError('')
                            }}
                            className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 bg-[#EEEDEA]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handlePasswordUpdate()
                              }
                            }}
                          />
                          {passwordError && (
                            <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                          )}
                        </div>
                        <button
                          onClick={handlePasswordUpdate}
                          disabled={isUpdatingPassword || !passwordValue || !repeatPasswordValue}
                          className="w-full px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isUpdatingPassword ? 'Updating...' : 'Update'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Account Settings View */
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {session?.user && (
                  <div>
                    {/* Username - Read only */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-300">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-900 mb-1">User ID</label>
                        <p className="text-gray-900">{session.user.username}</p>
                      </div>
                    </div>

                    {/* Account Type - Read only */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-300">
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Account type</label>
                        <p className="text-gray-900">{(session.user as { accountType?: 'Pro' | 'Agency' | 'Enterprise' | 'VIP' }).accountType || 'Pro'}</p>
                      </div>
                    </div>

                    {/* Email - Editable */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-300 cursor-pointer hover:bg-[#f5f3ed] transition-colors"
                      onClick={() => {
                        setCurrentEditView('email')
                        setEmailValue(session.user.email || '')
                      }}
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Email</label>
                        <p className="text-gray-900">{session.user.email || 'No email'}</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600 flex-shrink-0">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Password - Editable */}
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#f5f3ed] transition-colors"
                      onClick={() => {
                        setCurrentEditView('password')
                        setPasswordValue('')
                        setRepeatPasswordValue('')
                        setPasswordError('')
                      }}
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-900 mb-1">Password</label>
                        <p className="text-gray-900">••••••••</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600 flex-shrink-0">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Logout button at bottom - only show in main view */}
            {!isAccountSettingsView && (
              <div className="p-4 md:p-6">
                <button
                  onClick={async () => {
                    await signOut({ redirect: true, callbackUrl: '/' })
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-[#f5f3ed] transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
