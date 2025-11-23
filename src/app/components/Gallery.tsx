'use client'

import { useState, useEffect } from 'react'
import SubmissionForm from './SubmissionForm'
import Header from './Header'

interface Tag {
  id: string
  name: string
}

interface Site {
  id: string
  title: string
  description: string | null
  url: string
  imageUrl: string | null
  author: string | null
  tags: Tag[]
  imageId?: string // For interaction tracking
  category?: string // Category label for UI grouping (e.g., "website", "packaging")
}

interface ConceptSuggestion {
  id: string
  label: string // The concept label to use for search
  displayText?: string // What to display in the UI (synonym or label)
  isSynonym?: boolean // Whether this is a synonym suggestion
  synonyms: string[]
}

interface GalleryProps {
  category?: string // Optional category filter (e.g., 'packaging', 'website', 'app')
}

export default function Gallery({ category }: GalleryProps = {} as GalleryProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([])
  const [customConcepts, setCustomConcepts] = useState<Set<string>>(new Set())
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [conceptSuggestions, setConceptSuggestions] = useState<ConceptSuggestion[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [clickStartTimes, setClickStartTimes] = useState<Map<string, number>>(new Map())
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [conceptData, setConceptData] = useState<Map<string, { id: string; label: string; opposites: string[] }>>(new Map())

  useEffect(() => {
    fetchSites()
  }, [])

  // Fetch concept data with opposites when panel opens or concepts change
  useEffect(() => {
    if (isPanelOpen) {
      const fetchConceptData = async () => {
        const suggestedConcepts = selectedConcepts.filter(concept => !customConcepts.has(concept))
        if (suggestedConcepts.length === 0) {
          setConceptData(new Map())
          return
        }

        try {
          // Fetch each concept individually to get opposites
          const conceptMap = new Map<string, { id: string; label: string; opposites: string[] }>()
          const allOppositeIds = new Set<string>()
          
          // First pass: fetch concepts and collect opposite IDs
          for (const conceptLabel of suggestedConcepts) {
            try {
              const response = await fetch(`/api/concepts?q=${encodeURIComponent(conceptLabel)}`)
              if (response.ok) {
                const data = await response.json()
                if (Array.isArray(data.concepts) && data.concepts.length > 0) {
                  const concept = data.concepts.find((c: any) => c.label.toLowerCase() === conceptLabel.toLowerCase())
                  if (concept) {
                    const opposites = (concept.opposites as string[]) || []
                    opposites.forEach(id => allOppositeIds.add(id))
                    conceptMap.set(conceptLabel.toLowerCase(), {
                      id: concept.id,
                      label: concept.label,
                      opposites: opposites
                    })
                  }
                }
              }
            } catch (error) {
              console.error(`Error fetching concept data for "${conceptLabel}":`, error)
            }
          }
          
          // Second pass: fetch labels for opposite concept IDs
          const oppositeIdToLabel = new Map<string, string>()
          for (const oppositeId of allOppositeIds) {
            try {
              const response = await fetch(`/api/concepts?q=${encodeURIComponent(oppositeId)}`)
              if (response.ok) {
                const data = await response.json()
                if (Array.isArray(data.concepts) && data.concepts.length > 0) {
                  const concept = data.concepts.find((c: any) => c.id.toLowerCase() === oppositeId.toLowerCase())
                  if (concept) {
                    oppositeIdToLabel.set(oppositeId.toLowerCase(), concept.label)
                  }
                }
              }
            } catch (error) {
              // If we can't find the label, use the ID as fallback
              oppositeIdToLabel.set(oppositeId.toLowerCase(), oppositeId)
            }
          }
          
          // Update concept data with opposite labels
          for (const [key, conceptInfo] of conceptMap.entries()) {
            const oppositeLabels = conceptInfo.opposites.map(id => 
              oppositeIdToLabel.get(id.toLowerCase()) || id
            )
            conceptMap.set(key, {
              ...conceptInfo,
              opposites: oppositeLabels
            })
          }
          
          setConceptData(conceptMap)
        } catch (error) {
          console.error('Error fetching concept data:', error)
        }
      }
      fetchConceptData()
    }
  }, [isPanelOpen, selectedConcepts, customConcepts])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchSites()
    }, 300)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [selectedConcepts, category])

  // Fetch concept suggestions when input changes
  useEffect(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || trimmed.length < 1) {
      setConceptSuggestions([])
      setSelectedSuggestionIndex(-1)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/concepts?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        if (!response.ok) {
          setConceptSuggestions([])
          return
        }
        const data = await response.json()
        setConceptSuggestions(Array.isArray(data.concepts) ? data.concepts : [])
        setSelectedSuggestionIndex(-1)
      } catch (error: any) {
        // Ignore abort errors (cancelled requests)
        if (error.name !== 'AbortError') {
          console.error('Error fetching concept suggestions:', error)
        }
        setConceptSuggestions([])
      }
    }, 250) // Debounce for 250ms (slightly increased to reduce API calls)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [inputValue])

  const fetchSites = async () => {
    try {
      setLoading(true)
      
      // Build search query from selected concepts
      const query = selectedConcepts.join(' ')
      
      if (query.trim()) {
        // Zero-shot search: rank images by cosine similarity
        // Pass category parameter: "website", "packaging", or "all" (or omit for "all")
        const categoryParam = category || 'all'
        const searchUrl = `/api/search?q=${encodeURIComponent(query.trim())}&category=${encodeURIComponent(categoryParam)}`
        const response = await fetch(searchUrl)
        if (!response.ok) {
          console.error('Failed response fetching search', response.status)
          setSites([])
          return
        }
        const data = await response.json()
        // Search API returns sites and images
        // Map images to sites for interaction tracking
        // Create a map of siteId -> best image for that site
        const imageMap = new Map<string, any>()
        for (const image of data.images || []) {
          const siteId = image.siteId || image.site?.id
          if (siteId) {
            // Keep the image with highest score for each site
            if (!imageMap.has(siteId) || (image.score || 0) > (imageMap.get(siteId)?.score || 0)) {
              imageMap.set(siteId, image)
            }
          }
        }
        
        // Map sites to their corresponding images and include category info
        const sitesWithImageIds = (data.sites || []).map((site: Site) => {
          const image = imageMap.get(site.id)
          // Get category from site object (already includes category from search API)
          // or fallback to image data, or default to 'website'
          const siteCategory = (site as any).category || image?.category || 'website'
          return {
            ...site,
            imageId: image?.imageId || undefined,
            category: siteCategory, // Include category for UI labeling (only shown in combined view)
          }
        })
        setSites(sitesWithImageIds)
      } else {
        // No search query: show all sites (optionally filtered by category)
        const sitesUrl = category 
          ? `/api/sites?category=${encodeURIComponent(category)}`
          : '/api/sites'
        try {
          const response = await fetch(sitesUrl)
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Failed response fetching sites', response.status, errorData)
            setSites([])
            return
          }
          const data = await response.json()
          setSites(Array.isArray(data.sites) ? data.sites : [])
        } catch (error) {
          console.error('Error fetching sites:', error)
          setSites([])
        }
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
      setSites([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setShowSuggestions(value.length > 0)
    setSelectedSuggestionIndex(-1)
  }

  const addConcept = (concept: string, isCustom: boolean = false) => {
    const cleaned = concept.trim()
    if (!cleaned || selectedConcepts.includes(cleaned)) return
    setSelectedConcepts(prev => [...prev, cleaned])
    if (isCustom) {
      setCustomConcepts(prev => new Set(prev).add(cleaned))
    }
    setInputValue('')
    setShowSuggestions(false)
    setConceptSuggestions([])
    setSelectedSuggestionIndex(-1)
  }

  const handleSuggestionSelect = (suggestion: ConceptSuggestion) => {
    // Use the concept label for search (even if displayText is a synonym)
    // This ensures synonyms map to their parent concept
    addConcept(suggestion.label, false) // Not a custom tag - from suggestions
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (conceptSuggestions.length > 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
        // If a suggestion is highlighted, select it; otherwise add exact input value
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < conceptSuggestions.length) {
          handleSuggestionSelect(conceptSuggestions[selectedSuggestionIndex])
        } else if (inputValue.trim()) {
          addConcept(inputValue.trim(), true) // Custom tag
          setShowSuggestions(false)
          setConceptSuggestions([])
          setSelectedSuggestionIndex(-1)
        }
      } else if (e.key === 'Tab') {
        // Tab to select first suggestion
        e.preventDefault()
        if (conceptSuggestions.length > 0) {
          handleSuggestionSelect(conceptSuggestions[0])
        }
      } else if (e.key === 'ArrowDown') {
        // Arrow down to navigate suggestions
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < conceptSuggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        // Arrow up to navigate suggestions
        e.preventDefault()
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
      } else if (e.key === ',' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim().replace(',', ''), true) // Custom tag
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
        setConceptSuggestions([])
        setSelectedSuggestionIndex(-1)
      }
    } else {
      // Fallback to original behavior when no suggestions
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim(), true) // Custom tag
      } else if (e.key === 'Tab' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim(), true) // Custom tag
      } else if (e.key === ',' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim().replace(',', ''), true) // Custom tag
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    }
  }

  const removeConcept = (concept: string) => {
    setSelectedConcepts(prev => prev.filter(c => c !== concept))
    setCustomConcepts(prev => {
      const next = new Set(prev)
      next.delete(concept)
      return next
    })
  }

  const clearAllConcepts = () => {
    setSelectedConcepts([])
    setCustomConcepts(new Set())
  }

  const handleSubmissionSuccess = () => {
    fetchSites()
  }

  const toTitleCase = (text: string) =>
    text
      .split(/[-_/]+|\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ')

  // Track click and dwell time for interaction logging
  const handleSiteClick = async (site: Site) => {
    if (!site.imageId) return // Skip if no imageId

    const query = selectedConcepts.join(' ')
    if (!query.trim()) return // Skip if no query

    const clickTime = Date.now()
    setClickStartTimes(prev => new Map(prev).set(site.imageId!, clickTime))

    // Log click immediately
    try {
      await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query.trim(),
          imageId: site.imageId,
          clicked: true,
        }),
      })
    } catch (error) {
      console.error('Failed to log click:', error)
    }

    // Track dwell time when user navigates back or closes tab
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const startTime = clickStartTimes.get(site.imageId!)
        if (startTime) {
          const dwellTime = Date.now() - startTime
          // Log dwell time (fire and forget)
          fetch('/api/interactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: query.trim(),
              imageId: site.imageId,
              clicked: true,
              dwellTime,
            }),
          }).catch(() => {}) // Silently fail

          setClickStartTimes(prev => {
            const next = new Map(prev)
            next.delete(site.imageId!)
            return next
          })
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Also track when user comes back (in case they navigate back)
    const handleBeforeUnload = () => {
      const startTime = clickStartTimes.get(site.imageId!)
      if (startTime) {
        const dwellTime = Date.now() - startTime
        // Use sendBeacon for reliability on page unload
        const blob = new Blob([JSON.stringify({
          query: query.trim(),
          imageId: site.imageId,
          clicked: true,
          dwellTime,
        })], { type: 'application/json' })
        navigator.sendBeacon?.('/api/interactions', blob)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  const getDisplayName = (site: Site) => {
    const brand = site.author?.trim() || ''
    const title = site.title?.trim() || ''
    
    // If title exists, prefer it (especially for packaging items where title is the label)
    if (title) {
      // If there's a brand and title starts with brand, format as "brand - suffix"
      if (brand && title.toLowerCase().startsWith(brand.toLowerCase())) {
        let suffix = title.slice(brand.length).trim()
        suffix = suffix.replace(/^[-–—:\s]+/, '').trim()
        if (suffix.length > 0) return `${brand} - ${suffix}`
      }
      // Otherwise, just use the title as-is
      return title
    }
    
    // Fallback to URL-based derivation if no title
    try {
      const u = new URL(site.url)
      const rawPath = u.pathname.replace(/\/+$/, '').replace(/^\/+/, '')
      if (!brand) {
        // If no brand provided, use hostname as brand
        const hostParts = u.hostname.replace(/^www\./, '').split('.')
        const hostBrand = toTitleCase(hostParts[0])
        if (rawPath.length === 0) return hostBrand
        const firstSeg = rawPath.split('/')[0]
        const suffix = toTitleCase(firstSeg)
        return suffix ? `${hostBrand} - ${suffix}` : hostBrand
      }
      if (rawPath.length === 0) return brand
      const firstSeg = rawPath.split('/')[0]
      const suffix = toTitleCase(firstSeg)
      return suffix ? `${brand} - ${suffix}` : brand
    } catch {
      // Final fallback
      return brand || 'Untitled'
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f4]">
      {/* Header - fixed, not affected by panel */}
      <Header 
        onSubmitClick={() => setShowSubmissionForm(true)}
      />
      
      {/* Main Content and Panel Container */}
      <div className="flex">
        {/* Main Content - shifts when panel opens */}
        <div className="flex-1 transition-all duration-300 ease-in-out min-w-0">


      {/* Gradient fade overlay above search bar - fades content as it approaches */}
      <div 
        className="fixed left-0 right-0 pointer-events-none z-40" 
        style={{ 
          bottom: '180px',
          height: '96px',
          background: 'linear-gradient(to top, #fbf9f4 0%, rgba(251, 249, 244, 0.95) 25%, rgba(251, 249, 244, 0.8) 50%, rgba(251, 249, 244, 0.5) 75%, rgba(251, 249, 244, 0.2) 90%, transparent 100%)'
        }}
      ></div>

      {/* Gallery Grid */}
      <main className="bg-transparent pb-32">
        <div className="max-w-full mx-auto px-[52px] pt-3 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : sites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map(site => (
                     <div key={site.id}>
                       <a
                         href={site.url}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="block"
                         onClick={() => handleSiteClick(site)}
                       >
                         <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                           {site.imageUrl ? (
                             <img
                               src={site.imageUrl}
                               alt={site.title}
                               className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                // Silently handle image load errors
                                // Don't log errors for MinIO/localhost URLs (MinIO may not be running)
                                if (site.imageUrl && 
                                    !site.imageUrl.startsWith('/') && 
                                    !site.imageUrl.includes('localhost:9000')) {
                                  console.error('Image failed to load:', site.imageUrl);
                                }
                                e.currentTarget.style.display = 'none';
                              }}
                             />
                           ) : (
                             <div className="h-full bg-gray-200 flex items-center justify-center">
                               <span className="text-gray-400">No image</span>
                             </div>
                           )}
                         </div>
                       </a>
                      <div className="py-2">
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-black no-underline text-xs focus:outline-none hover:underline flex-1 min-w-0"
                            onClick={() => handleSiteClick(site)}
                          >
                            {getDisplayName(site)}
                          </a>
                          {site.category && (
                            <span className="bg-[#f0eeea] text-gray-700 text-xs font-medium whitespace-nowrap px-2 py-0.5 rounded">
                              {site.category === 'packaging' ? 'Packaging' : 
                               site.category === 'app' ? 'App' :
                               site.category === 'fonts' ? 'Fonts' :
                               site.category === 'graphic-design' ? 'Graphic Design' :
                               site.category === 'branding' ? 'Branding' :
                               site.category === 'brand' ? 'Brand' :
                               site.category === 'website' ? 'Website' :
                               // Fallback: show category string as-is for new categories
                               toTitleCase(site.category)}
                            </span>
                          )}
                        </div>
                      </div>
                     </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sites found</h3>
            <p className="text-gray-600">
              {selectedConcepts.length > 0
                ? `No sites match the concepts: ${selectedConcepts.join(' + ')}`
                : 'No sites have been submitted yet.'
              }
            </p>
          </div>
        )}
        </div>
      </main>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <SubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSuccess={handleSubmissionSuccess}
        />
      )}

      {/* Searchbar - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#fbf9f4] z-50 pt-4 pb-8">
        <div className="max-w-full mx-auto px-[52px]">
          {/* Selected concept chips - above search bar */}
          <div className="min-h-[60px] flex flex-wrap items-center gap-2 mb-1">
          {selectedConcepts.length > 0 && (
            <>
              <button
                onClick={clearAllConcepts}
                className="text-sm text-gray-500 hover:text-gray-700 mr-2"
              >
                Clear all
              </button>
              {selectedConcepts.some(concept => !customConcepts.has(concept)) && (
                <button
                  type="button"
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="magical-glow inline-flex items-center justify-center rounded-full bg-[#fbf9f4] text-gray-900 px-1.5 py-1 text-sm font-medium relative z-10"
                  aria-label="Suggested concepts"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C12.5523 2 13 2.44772 13 3V4.36816C14.8993 5.23659 17.3882 5.99996 19 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H20.0684L22.9375 15.6484C23.0935 16.0643 22.956 16.5333 22.6006 16.7998C21.562 17.5784 20.299 17.9999 19.001 18C17.7028 17.9999 16.4391 17.5785 15.4004 16.7998C15.0452 16.5334 14.9076 16.0642 15.0635 15.6484L17.957 7.92969C16.386 7.74156 14.556 7.18366 13 6.5459V20H17C17.5523 20 18 20.4477 18 21C18 21.5523 17.5523 22 17 22H7C6.44778 21.9999 6 21.5522 6 21C6 20.4478 6.44778 20.0001 7 20H11V6.5459C9.4436 7.18379 7.61321 7.74172 6.04199 7.92969L8.9375 15.6484C9.09352 16.0643 8.95599 16.5333 8.60059 16.7998C7.56199 17.5784 6.299 17.9999 5.00098 18C3.7028 17.9999 2.43907 17.5785 1.40039 16.7998C1.0452 16.5334 0.907615 16.0642 1.06348 15.6484L3.93164 8H3C2.44778 7.99992 2 7.55224 2 7C2 6.44777 2.44778 6.00008 3 6H5C6.61174 6 9.10065 5.23657 11 4.36816V3C11 2.44776 11.4478 2.00008 12 2ZM3.22461 15.5811C3.77402 15.8533 4.38127 15.9999 5.00098 16C5.62023 15.9999 6.22631 15.853 6.77539 15.5811L5 10.8477L3.22461 15.5811ZM17.2246 15.5811C17.774 15.8533 18.3813 15.9999 19.001 16C19.6202 15.9999 20.2263 15.853 20.7754 15.5811L19 10.8477L17.2246 15.5811Z" fill="currentColor"/>
                  </svg>
                </button>
              )}
              {selectedConcepts.map((concept) => (
                <span
                  key={concept}
                  className="inline-flex items-center gap-1 rounded-full bg-[#fbf9f4] text-gray-900 px-3 py-1 text-sm relative z-0 font-medium border-2 border-gray-300"
                >
                  {concept}
                  <button
                    onClick={() => removeConcept(concept)}
                    className="ml-1 text-gray-400 hover:text-gray-600 relative z-10 text-base leading-none"
                    aria-label={`Remove ${concept}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </>
          )}
          </div>

          <div className="border border-gray-300 rounded-md p-2">
            <div className="flex flex-col gap-2">
              <div className="flex-1 min-w-[220px] relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    setShowSuggestions(inputValue.length > 0 || conceptSuggestions.length > 0)
                    // Clear placeholder on focus
                    const input = document.getElementById('search-input') as HTMLInputElement
                    if (input) {
                      input.placeholder = ''
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setShowSuggestions(false)
                      // Restore placeholder on blur if empty
                      const input = document.getElementById('search-input') as HTMLInputElement
                      if (input && !inputValue.trim()) {
                        input.placeholder = 'Add search concepts (e.g., playful, 3d, minimalistic)'
                      }
                    }, 200)
                  }}
                  placeholder="Add search concepts (e.g., playful, 3d, minimalistic)"
                  className="w-full px-3 rounded-md border border-transparent focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                  id="search-input"
                  style={{ height: '40px' }}
                />
                
                {/* Autocomplete suggestions dropdown - show above input when at bottom */}
                {showSuggestions && conceptSuggestions.length > 0 && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {conceptSuggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.id}-${index}`}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          selectedSuggestionIndex === index
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {suggestion.displayText || suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Fallback: show typed value if no suggestions but input has value */}
                {showSuggestions && conceptSuggestions.length === 0 && inputValue.trim() && !selectedConcepts.includes(inputValue.trim()) && (
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <button
                    onClick={() => addConcept(inputValue.trim(), true)} // Custom tag
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Add "{inputValue.trim()}"
                  </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (inputValue.trim()) {
                    addConcept(inputValue.trim(), true) // Custom tag
                  }
                }}
                disabled={!inputValue.trim()}
                className="bg-gray-900 text-white rounded-md hover:bg-gray-900 transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center self-end"
                style={{ width: '40px', height: '40px' }}
                aria-label="Add concept"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        </div>
        </div>

        {/* Side Panel - slides in from right and pushes content */}
        <div
          className={`sticky top-0 h-screen bg-[#fbf9f4] transition-all duration-300 ease-in-out overflow-hidden ${
            isPanelOpen ? 'w-80' : 'w-0'
          }`}
        >
          <div className={`p-6 ${isPanelOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Concept Spectrum</h2>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close panel"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="space-y-3">
            {selectedConcepts
              .filter(concept => !customConcepts.has(concept))
              .map((concept) => {
                const conceptInfo = conceptData.get(concept.toLowerCase())
                const opposites = conceptInfo?.opposites || []
                // Opposites are stored as concept IDs, so we'll display them as-is for now
                // In the future, we could fetch concept labels for these IDs
                const firstOpposite = opposites.length > 0 ? opposites[0] : null
                
                return (
                  <div key={concept} className="flex items-center">
                    {firstOpposite && (
                      <>
                        <div className="w-20 p-3 text-left overflow-hidden">
                          <span className="text-sm text-gray-900 truncate block">{firstOpposite}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex-shrink-0 w-32 h-1 bg-gray-300 rounded-full relative">
                            <div className="absolute inset-0 flex items-center justify-end pr-0.5">
                              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-sm"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="w-20 p-3 text-right overflow-hidden">
                      <span className="text-sm text-gray-900 truncate block">{concept}</span>
                    </div>
                  </div>
                )
              })}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
