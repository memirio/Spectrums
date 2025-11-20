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
}

interface ConceptSuggestion {
  id: string
  label: string // The concept label to use for search
  displayText?: string // What to display in the UI (synonym or label)
  isSynonym?: boolean // Whether this is a synonym suggestion
  synonyms: string[]
}

export default function Gallery() {
  const [sites, setSites] = useState<Site[]>([])
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [conceptSuggestions, setConceptSuggestions] = useState<ConceptSuggestion[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [clickStartTimes, setClickStartTimes] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    fetchSites()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetchSites()
    }, 300)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [selectedConcepts])

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
        // Zero-shot search: rank ALL images by cosine similarity (no hard cutoff)
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
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
        
        // Map sites to their corresponding images
        const sitesWithImageIds = (data.sites || []).map((site: Site) => {
          const image = imageMap.get(site.id)
          return {
            ...site,
            imageId: image?.imageId || undefined,
          }
        })
        setSites(sitesWithImageIds)
      } else {
        // No search query: show all sites
        const response = await fetch('/api/sites')
        if (!response.ok) {
          console.error('Failed response fetching sites', response.status)
          setSites([])
          return
        }
        const data = await response.json()
        setSites(Array.isArray(data.sites) ? data.sites : [])
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

  const addConcept = (concept: string) => {
    const cleaned = concept.trim()
    if (!cleaned || selectedConcepts.includes(cleaned)) return
    setSelectedConcepts(prev => [...prev, cleaned])
    setInputValue('')
    setShowSuggestions(false)
    setConceptSuggestions([])
    setSelectedSuggestionIndex(-1)
  }

  const handleSuggestionSelect = (suggestion: ConceptSuggestion) => {
    // Use the concept label for search (even if displayText is a synonym)
    // This ensures synonyms map to their parent concept
    addConcept(suggestion.label)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (conceptSuggestions.length > 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
        // If a suggestion is highlighted, select it; otherwise add exact input value
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < conceptSuggestions.length) {
          handleSuggestionSelect(conceptSuggestions[selectedSuggestionIndex])
        } else if (inputValue.trim()) {
          addConcept(inputValue.trim())
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
        addConcept(inputValue.trim().replace(',', ''))
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
        setConceptSuggestions([])
        setSelectedSuggestionIndex(-1)
      }
    } else {
      // Fallback to original behavior when no suggestions
      if (e.key === 'Enter' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim())
      } else if (e.key === 'Tab' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim())
      } else if (e.key === ',' && inputValue.trim()) {
        e.preventDefault()
        addConcept(inputValue.trim().replace(',', ''))
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    }
  }

  const removeConcept = (concept: string) => {
    setSelectedConcepts(prev => prev.filter(c => c !== concept))
  }

  const clearAllConcepts = () => {
    setSelectedConcepts([])
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
    try {
      const u = new URL(site.url)
      // Prefer suffix from title when it starts with the brand
      if (brand && title && title.toLowerCase().startsWith(brand.toLowerCase())) {
        let suffix = title.slice(brand.length).trim()
        suffix = suffix.replace(/^[-–—:\s]+/, '').trim()
        if (suffix.length > 0) return `${brand} - ${suffix}`
      }
      // Else derive from path
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
      // Fallbacks
      if (brand && title && title.toLowerCase().startsWith(brand.toLowerCase())) {
        const suffix = title.slice(brand.length).trim().replace(/^[-–—:\s]+/, '').trim()
        return suffix ? `${brand} - ${suffix}` : brand
      }
      return brand || title || 'Untitled'
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f4]">
      {/* Header */}
      <Header 
        onSubmitClick={() => setShowSubmissionForm(true)}
      />

      {/* Concept Filters */}
      <div className="bg-transparent">
        <div className="max-w-full mx-auto px-[52px] py-4">
          <div className="mb-2"></div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex-1 min-w-[220px] relative flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowSuggestions(inputValue.length > 0 || conceptSuggestions.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Add search concepts (e.g., playful, 3d, minimalistic)"
                  className="w-full px-3 rounded-md border border-transparent focus:outline-none focus:border-2 focus:border-gray-300 text-gray-900 placeholder-gray-500 bg-[#ededeb]"
                  id="search-input"
                  style={{ height: '40px' }}
                />
                
                {/* Autocomplete suggestions dropdown */}
                {showSuggestions && conceptSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
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
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    <button
                      onClick={() => addConcept(inputValue.trim())}
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
                    addConcept(inputValue.trim())
                  }
                }}
                disabled={!inputValue.trim()}
                className="bg-gray-900 text-white rounded-md hover:bg-gray-900 transition-colors disabled:cursor-not-allowed flex items-center justify-center"
                style={{ height: '40px', width: '40px' }}
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

          {/* Selected concept chips */}
          {selectedConcepts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={clearAllConcepts}
                className="text-sm text-gray-500 hover:text-gray-700 mr-2"
              >
                Clear all
              </button>
              {selectedConcepts.map((concept) => (
                <span
                  key={concept}
                  className="magical-glow inline-flex items-center gap-1 rounded-full bg-[#fbf9f4] text-blue-900 px-3 py-1 text-sm relative z-0 font-medium"
                >
                  {concept}
                  <button
                    onClick={() => removeConcept(concept)}
                    className="ml-1 text-blue-600 hover:text-blue-800 relative z-10"
                    aria-label={`Remove ${concept}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Gallery Grid */}
      <main className="bg-transparent">
        <div className="max-w-full mx-auto px-[52px] py-8">
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
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black no-underline text-xs focus:outline-none hover:underline"
                          onClick={() => handleSiteClick(site)}
                        >
                          {getDisplayName(site)}
                        </a>
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
    </div>
  )
}
