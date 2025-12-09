'use client'

import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import AddToCollectionModal from '../../components/AddToCollectionModal'
import { useSearch } from '../../contexts/SearchContext'

interface Collection {
  id: string
  name: string
  description: string
  createdAt: Date
  images?: Array<{ id: string; url: string; siteUrl?: string | null; siteTitle?: string | null }>
}

export default function CollectionDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const collectionName = params?.name as string
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<{ id: string; url: string } | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [copiedImageId, setCopiedImageId] = useState<string | null>(null)
  const [showAddToCollectionModal, setShowAddToCollectionModal] = useState(false)
  const [selectedImageForCollection, setSelectedImageForCollection] = useState<{ id: string; url: string; title?: string } | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  const globalSearch = useSearch()
  
  // Local state for search query (synced with global context)
  const [searchQuery, setSearchQuery] = useState(globalSearch.searchQuery)
  
  // Sync with global context
  useEffect(() => {
    setSearchQuery(globalSearch.searchQuery)
  }, [globalSearch.searchQuery])
  
  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    globalSearch.setSearchQuery(value)
  }
  
  // Handle search submit - navigate to gallery
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      globalSearch.triggerSearch(searchQuery.trim())
    }
  }
  
  // Handle search key down
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit()
    }
  }
  
  // Clear search
  const clearSearchQuery = () => {
    setSearchQuery('')
    globalSearch.clearSearch()
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsDrawerCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/collections')
    }
  }, [status, router])

  const fetchCollection = async () => {
    try {
      const encodedName = encodeURIComponent(collectionName)
      const response = await fetch(`/api/collections/by-name/${encodedName}`)
      if (!response.ok) {
        console.error('[collection] Failed to fetch collection:', response.status)
        setCollection(null)
        setLoading(false)
        return
      }
      const data = await response.json()
          setCollection({
            id: data.collection.id,
            name: data.collection.name,
            description: data.collection.description || '',
            createdAt: new Date(data.collection.createdAt),
            images: (data.collection.images || []) as Array<{ id: string; url: string; siteUrl?: string | null; siteTitle?: string | null }>
          })
    } catch (error) {
      console.error('[collection] Error fetching collection:', error)
      setCollection(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user && collectionName) {
      fetchCollection()
    }
  }, [status, session, collectionName])

  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!collection) return
    
    if (!confirm('Are you sure you want to remove this image from the collection?')) {
      return
    }

    try {
      setIsDeleting(imageId)
      const response = await fetch(`/api/collections/${collection.id}/images?imageId=${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove image from collection')
      }

      // Refresh collection to update the list
      await fetchCollection()
    } catch (error: any) {
      console.error('[collection] Error removing image:', error)
      alert(error.message || 'Failed to remove image from collection. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDownloadAll = async () => {
    if (!collection || !collection.images || collection.images.length === 0) {
      return
    }

    setIsDownloading(true)

    try {
      // Download images one by one with a small delay to avoid browser blocking
      for (let i = 0; i < collection.images.length; i++) {
        const image = collection.images[i]
        
        try {
          // Fetch the image as a blob
          const response = await fetch(image.url)
          if (!response.ok) {
            console.error(`[download] Failed to fetch image ${i + 1}:`, response.status)
            continue
          }
          
          const blob = await response.blob()
          
          // Convert WebP to JPEG using canvas
          const img = new Image()
          const objectUrl = window.URL.createObjectURL(blob)
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              // Create canvas and draw image
              const canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              
              const ctx = canvas.getContext('2d')
              if (!ctx) {
                reject(new Error('Failed to get canvas context'))
                return
              }
              
              // Draw image to canvas
              ctx.drawImage(img, 0, 0)
              
              // Convert to JPEG blob
              canvas.toBlob((jpegBlob) => {
                if (!jpegBlob) {
                  reject(new Error('Failed to convert to JPEG'))
                  return
                }
                
                // Create download link
                const url = window.URL.createObjectURL(jpegBlob)
                const link = document.createElement('a')
                link.href = url
                
                // Extract filename from URL and change extension to .jpg
                const urlParts = image.url.split('/')
                const originalFilename = urlParts[urlParts.length - 1] || `image-${i + 1}`
                const filename = originalFilename.replace(/\.(webp|png|gif)$/i, '.jpg') || `image-${i + 1}.jpg`
                link.download = filename
                
                // Trigger download
                document.body.appendChild(link)
                link.click()
                
                // Clean up
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)
                window.URL.revokeObjectURL(objectUrl)
                
                resolve()
              }, 'image/jpeg', 0.92) // 0.92 quality for good balance
            }
            
            img.onerror = () => {
              window.URL.revokeObjectURL(objectUrl)
              reject(new Error('Failed to load image'))
            }
            
            img.src = objectUrl
          })
          
          // Small delay between downloads to avoid browser blocking
          if (i < collection.images.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 300))
          }
        } catch (error) {
          console.error(`[download] Error downloading image ${i + 1}:`, error)
          // Continue with next image even if one fails
        }
      }
    } catch (error) {
      console.error('[download] Error downloading images:', error)
      alert('Some images failed to download. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (status !== 'authenticated' || !session?.user) {
    return null
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#fbf9f4] flex items-center justify-center">
        <div className="text-gray-500">Collection not found</div>
      </div>
    )
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
            
            {/* Empty state */}
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No filters yet</p>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className={`flex-1 transition-all duration-300 ease-in-out min-w-0 flex flex-col overflow-hidden h-full ${
          isMobile && isDrawerCollapsed ? 'w-full' : ''
        }`}>
          {/* Header */}
          <div className="flex-shrink-0 z-50">
            <Header 
              onSubmitClick={() => {}}
              onLoginClick={() => router.push('/login')}
              onFavouritesClick={() => router.push('/collections')}
              onUserAccountClick={() => {}}
              isLoggedIn={true}
              username={session?.user?.username}
              searchQuery={searchQuery}
              onSearchInputChange={handleSearchInputChange}
              onSearchKeyDown={handleSearchKeyDown}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={clearSearchQuery}
            />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 md:px-[52px] py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{collection.name}</h1>
            {collection.images && collection.images.length > 0 && (
              <button
                onClick={handleDownloadAll}
                disabled={isDownloading}
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? 'Downloading...' : 'Download images'}
              </button>
            )}
          </div>
          {collection.description && (
            <p className="text-gray-600 mb-8">{collection.description}</p>
          )}
          
          {/* Collection images or empty state */}
          {!collection.images || collection.images.length === 0 ? (
            <div className="w-full max-w-2xl aspect-[4/3] rounded-lg bg-[#EEEDEA] flex items-center justify-center">
              <p className="text-gray-500">No images in this collection yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.images.map((image) => (
                <div
                  key={image.id}
                  className="group"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-200 cursor-pointer">
                    {image.url ? (
                      <img
                        src={image.url}
                        alt={`Image in ${collection.name}`}
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
                    <div className="absolute top-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {/* External link button - far left (only show if siteUrl exists) */}
                      {image.siteUrl && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            window.open(image.siteUrl!, '_blank', 'noopener,noreferrer')
                          }}
                          className="p-2 hover:bg-black/20 rounded-md transition-opacity cursor-pointer"
                          aria-label="Open link"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.7704 17.6484C21.7704 18.2006 21.3225 18.6482 20.7704 18.6484C20.2181 18.6485 19.7705 18.2007 19.7704 17.6484L19.7695 6.41309L5.47649 20.707C5.08596 21.0976 4.45295 21.0976 4.06242 20.707C3.6719 20.3165 3.6719 19.6835 4.06242 19.293L18.3554 5H7.12199C6.56971 5 6.12199 4.55228 6.12199 4C6.12199 3.44772 6.56971 3 7.12199 3H20.7695C21.3217 3 21.7694 3.44773 21.7695 4L21.7704 17.6484Z" fill="white"/>
                          </svg>
                        </button>
                      )}
                      {/* Copy and Bookmark buttons container - right side */}
                      <div className="flex">
                        {/* Copy button */}
                        <button
                          onClick={async (e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            
                            if (!image.url) return
                            
                            try {
                              // Fetch the image as a blob
                              const response = await fetch(image.url)
                              const blob = await response.blob()
                              
                              // Convert to PNG if needed (Clipboard API doesn't support WebP)
                              let imageBlob = blob
                              if (blob.type === 'image/webp' || !blob.type.startsWith('image/')) {
                                // Convert to PNG using canvas
                                const img = new Image()
                                img.crossOrigin = 'anonymous'
                                
                                const canvas = document.createElement('canvas')
                                const ctx = canvas.getContext('2d')
                                
                                await new Promise((resolve, reject) => {
                                  img.onload = () => {
                                    canvas.width = img.width
                                    canvas.height = img.height
                                    ctx?.drawImage(img, 0, 0)
                                    canvas.toBlob((blob) => {
                                      if (blob) {
                                        imageBlob = blob
                                        resolve(blob)
                                      } else {
                                        reject(new Error('Failed to convert image'))
                                      }
                                    }, 'image/png')
                                  }
                                  img.onerror = reject
                                  img.src = image.url
                                })
                              }
                              
                              // Create a ClipboardItem with the image blob
                              const clipboardItem = new ClipboardItem({
                                'image/png': imageBlob
                              })
                              
                              // Copy to clipboard
                              await navigator.clipboard.write([clipboardItem])
                              
                              // Show success message
                              setCopiedImageId(image.id)
                              setTimeout(() => {
                                setCopiedImageId(null)
                              }, 2000)
                            } catch (error) {
                              console.error('Failed to copy image:', error)
                              // Fallback: copy the image URL as text
                              navigator.clipboard.writeText(image.url || '')
                              
                              // Show success message even for fallback
                              setCopiedImageId(image.id)
                              setTimeout(() => {
                                setCopiedImageId(null)
                              }, 2000)
                            }
                          }}
                          className="p-2 hover:bg-black/20 rounded-md transition-opacity cursor-pointer"
                          aria-label="Copy image"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 11C21 10.4477 20.5523 10 20 10H11C10.4477 10 10 10.4477 10 11V20C10 20.5523 10.4477 21 11 21H20C20.5523 21 21 20.5523 21 20V11ZM14 5V4C14 3.73478 13.8946 3.48051 13.707 3.29297C13.5195 3.10543 13.2652 3 13 3H4C3.73478 3 3.48051 3.10543 3.29297 3.29297C3.10543 3.48051 3 3.73478 3 4V13C3 13.2652 3.10543 13.5195 3.29297 13.707C3.48051 13.8946 3.73478 14 4 14H5C5.55228 14 6 14.4477 6 15C6 15.5523 5.55228 16 5 16H4C3.20435 16 2.44152 15.6837 1.87891 15.1211C1.3163 14.5585 1 13.7956 1 13V4C1 3.20435 1.3163 2.44152 1.87891 1.87891C2.44152 1.3163 3.20435 1 4 1H13C13.7956 1 14.5585 1.3163 15.1211 1.87891C15.6837 2.44152 16 3.20435 16 4V5C16 5.55228 15.5523 6 15 6C14.4477 6 14 5.55228 14 5ZM23 20C23 21.6569 21.6569 23 20 23H11C9.34315 23 8 21.6569 8 20V11C8 9.34315 9.34315 8 11 8H20C21.6569 8 23 9.34315 23 11V20Z" fill="white"/>
                          </svg>
                        </button>
                        {/* Bookmark/Save button - far right */}
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedImageForCollection({
                              id: image.id,
                              url: image.url,
                              title: image.siteTitle || undefined
                            })
                            setShowAddToCollectionModal(true)
                          }}
                          className="p-2 hover:bg-black/20 rounded-md transition-opacity cursor-pointer"
                          aria-label="Add to favorites"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.4502 8.50195C21.4502 7.91086 21.3337 7.32537 21.1074 6.7793C20.8811 6.23319 20.5489 5.73723 20.1309 5.31934V5.31836C19.7131 4.90042 19.2168 4.56901 18.6709 4.34277C18.1248 4.1165 17.5393 4.00001 16.9482 4C16.3571 4 15.7717 4.1165 15.2256 4.34277C14.6796 4.569 14.1834 4.90042 13.7656 5.31836V5.31934L12.7051 6.37891C12.3145 6.76935 11.6815 6.7694 11.291 6.37891L10.2314 5.31934C9.38729 4.47518 8.24167 4.00098 7.04785 4.00098C5.85415 4.00106 4.70932 4.47525 3.86523 5.31934C3.02122 6.16347 2.54688 7.30824 2.54688 8.50195C2.54691 9.69568 3.02117 10.8405 3.86523 11.6846L11.998 19.8174L20.1309 11.6846L20.2842 11.5244C20.6308 11.1421 20.9094 10.7024 21.1074 10.2246C21.3337 9.67854 21.4502 9.09303 21.4502 8.50195ZM23.4502 8.50195C23.4502 9.35576 23.2819 10.2015 22.9551 10.9902C22.6283 11.7789 22.1487 12.4951 21.5449 13.0986L12.7051 21.9385C12.3146 22.329 11.6815 22.329 11.291 21.9385L2.45117 13.0986C1.23203 11.8794 0.546909 10.2261 0.546875 8.50195C0.546875 6.7777 1.23194 5.12353 2.45117 3.9043C3.6703 2.68531 5.32384 2.00106 7.04785 2.00098C8.77206 2.00098 10.4263 2.68513 11.6455 3.9043L11.998 4.25684L12.3506 3.9043C12.9542 3.30048 13.6712 2.82194 14.46 2.49512C15.2488 2.16827 16.0944 2 16.9482 2C17.8021 2.00001 18.6477 2.16828 19.4365 2.49512C20.225 2.82186 20.9415 3.3007 21.5449 3.9043C22.1488 4.50792 22.6282 5.22486 22.9551 6.01367C23.2819 6.80247 23.4502 7.64812 23.4502 8.50195Z" fill="white"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Copy success message */}
                    {copiedImageId === image.id && (
                      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="bg-black/60 text-white px-4 py-2 rounded-md text-sm font-medium">
                          Copied to clipboard
                        </div>
                      </div>
                    )}
                    {/* Delete button - always visible in bottom right */}
                    <div className="absolute bottom-2 right-2 z-10">
                      <button
                        onClick={(e) => handleDeleteImage(image.id, e)}
                        disabled={isDeleting === image.id}
                        className="p-2 bg-black/60 hover:bg-black/80 rounded-md transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Remove from collection"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Image Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                <img
                  src={selectedImage.url}
                  alt="Full size image"
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 bg-black/50 rounded-md"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Add to Collection Modal */}
          {showAddToCollectionModal && selectedImageForCollection && (
            <AddToCollectionModal
              isOpen={showAddToCollectionModal}
              onClose={() => {
                setShowAddToCollectionModal(false)
                setSelectedImageForCollection(null)
              }}
              image={selectedImageForCollection}
            />
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

