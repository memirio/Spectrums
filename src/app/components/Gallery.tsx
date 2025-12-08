'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import SubmissionForm from './SubmissionForm'
import CreateAccountMessageModal from './CreateAccountMessageModal'
import LoginRequiredModal from './LoginRequiredModal'
import Header from './Header'
import Navigation from './Navigation'
import { useRouter, usePathname } from 'next/navigation'

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
  score?: number // Similarity score for ranking
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
  onCategoryChange?: (category: string | undefined) => void // Callback for category changes
}

export default function Gallery({ category: categoryProp, onCategoryChange }: GalleryProps = {} as GalleryProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Check if we're on the public (logged-out) page
  // Check both pathname and hostname to be more robust
  const isPublicPage = typeof window !== 'undefined' 
    ? !window.location.hostname.startsWith('app.') && !pathname?.startsWith('/app/')
    : !pathname?.startsWith('/app/')
  
  // Internal category state if not provided via props
  const [internalCategory, setInternalCategory] = useState<string | undefined>(categoryProp)
  
  // Sync internal category with prop when prop changes
  useEffect(() => {
    if (categoryProp !== undefined) {
      setInternalCategory(categoryProp)
    }
  }, [categoryProp])
  
  // Use prop category if provided, otherwise use internal state
  const category = categoryProp !== undefined ? categoryProp : internalCategory
  
  // Handle category changes
  const handleCategoryChange = (newCategory: string | undefined) => {
    if (onCategoryChange) {
      onCategoryChange(newCategory)
    } else {
      setInternalCategory(newCategory)
    }
    // Reset sites and pagination when category changes
    setSites([])
    setAllSites([])
    setPaginationOffset(0)
    setDisplayedCount(50)
  }
  
  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
  
  const [sites, setSites] = useState<Site[]>([])
  const [allSites, setAllSites] = useState<Site[]>([]) // Store all sites for lazy loading
  const [displayedCount, setDisplayedCount] = useState(50) // Number of sites to display initially
  const [paginationOffset, setPaginationOffset] = useState(0) // Current API pagination offset
  const [hasMoreResults, setHasMoreResults] = useState(false) // Whether there are more results to fetch
  const [isLoadingMore, setIsLoadingMore] = useState(false) // Loading state for pagination
  // Main search (simple text search, no concepts)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Drawer spectrums (concept-based sliders)
  interface Spectrum {
    id: string
    concept: string
    inputValue: string
    sliderPosition: number
    conceptSuggestions: ConceptSuggestion[]
    selectedSuggestionIndex: number
    showSuggestions: boolean
    isInputVisible: boolean // Track if input is visible or button is shown
  }
  const [spectrums, setSpectrums] = useState<Spectrum[]>([])
  const [showAddConceptModal, setShowAddConceptModal] = useState(false) // Track if "Add Concept" modal is open
  const [showLoginModal, setShowLoginModal] = useState(false) // Track if login required modal is open
  const [addConceptInputValue, setAddConceptInputValue] = useState('') // Track the value of the concept input
  const [addConceptInputRef, setAddConceptInputRef] = useState<HTMLInputElement | null>(null) // Ref for input auto-focus
  const [vibeFieldError, setVibeFieldError] = useState<string | undefined>(undefined) // Error message for vibe field
  
  // Track daily filter creation count (max 3 per day)
  const getDailyFilterCount = (): number => {
    if (typeof window === 'undefined') return 0
    const today = new Date().toDateString()
    const stored = localStorage.getItem('vibeFiltersCreated')
    if (!stored) return 0
    try {
      const data = JSON.parse(stored)
      if (data.date === today) {
        return data.count || 0
      }
    } catch {
      return 0
    }
    return 0
  }
  
  const incrementDailyFilterCount = (): void => {
    if (typeof window === 'undefined') return
    const today = new Date().toDateString()
    const currentCount = getDailyFilterCount()
    localStorage.setItem('vibeFiltersCreated', JSON.stringify({
      date: today,
      count: currentCount + 1
    }))
  }
  
  // Legacy concept state (for backward compatibility with existing logic)
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([])
  const [customConcepts, setCustomConcepts] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const [showCreateAccountMessage, setShowCreateAccountMessage] = useState(false)
  const [clickStartTimes, setClickStartTimes] = useState<Map<string, number>>(new Map())
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [conceptData, setConceptData] = useState<Map<string, { id: string; label: string; opposites: string[] }>>(new Map())
  const [sliderPositions, setSliderPositions] = useState<Map<string, number>>(new Map()) // Map of concept -> slider position (0-1, where 1 is right/default)
  const [conceptResults, setConceptResults] = useState<Map<string, Site[]>>(new Map()) // Map of concept -> results for that concept
  const [oppositeResults, setOppositeResults] = useState<Map<string, Site[]>>(new Map()) // Map of concept -> results for its opposite
  const [lastSliderSide, setLastSliderSide] = useState<Map<string, 'left' | 'right'>>(new Map()) // Track which side of 50% we're on
  const [resultsVersion, setResultsVersion] = useState(0) // Version counter to trigger reordering when results change
  const [sliderVersion, setSliderVersion] = useState(0) // Version counter to trigger reordering when slider moves
  const [isDrawerOpen, setIsDrawerOpen] = useState(true) // Drawer open/closed state
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false) // Drawer collapsed state (80px vs 280px)
  const [isMobile, setIsMobile] = useState(false) // Track if we're on mobile
  const [copiedImageId, setCopiedImageId] = useState<string | null>(null) // Track which image was copied
  const [hoveredLikeButtonId, setHoveredLikeButtonId] = useState<string | null>(null) // Track which like button is being hovered

  // Detect mobile and set initial collapsed state
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 // md breakpoint
      setIsMobile(mobile)
      if (mobile) {
        setIsDrawerCollapsed(true) // Collapsed by default on mobile
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Lazy loading: Update displayed sites when allSites or displayedCount changes
  useEffect(() => {
    setSites(allSites.slice(0, displayedCount))
  }, [allSites, displayedCount])

  // Function to load more images from API
  const loadMoreImages = useCallback(async () => {
    if (isLoadingMore || !hasMoreResults) {
      return
    }

    setIsLoadingMore(true)
    try {
      const query = selectedConcepts.join(' ')
      const categoryParam = category || 'all'
      
      let data: any
      if (query.trim()) {
        // Search query: use search API
        const searchUrl = `/api/search?q=${encodeURIComponent(query.trim())}&category=${encodeURIComponent(categoryParam)}&limit=60&offset=${paginationOffset}`
        const response = await fetch(searchUrl)
        if (!response.ok) {
          console.error('Failed to fetch more images', response.status)
          return
        }
        data = await response.json()
        
        // Map images to sites (extract site data from image.site)
        const sitesWithImageIds = (data.images || []).map((image: any) => {
          const site = image.site || {}
          const siteCategory = image.site?.category || image.category || 'website'
          return {
            id: site.id || image.siteId,
            title: site.title || '',
            description: site.description || null,
            url: site.url || image.siteUrl || '',
            imageUrl: image.url || site.imageUrl || null,
            author: site.author || null,
            tags: [],
            imageId: image.imageId || undefined,
            category: siteCategory,
            score: image.score || 0,
          } as Site
        })
        
        // Deduplicate by site ID
        const siteMap = new Map<string, Site>()
        for (const site of sitesWithImageIds) {
          const existing = siteMap.get(site.id)
          if (!existing || (site.score ?? 0) > (existing.score ?? 0)) {
            siteMap.set(site.id, site)
          }
        }
        const newSites = Array.from(siteMap.values())
        
        // Append new sites to existing ones
        setAllSites(prev => {
          const combined = [...prev, ...newSites]
          // Remove duplicates by ID
          const uniqueMap = new Map<string, Site>()
          for (const site of combined) {
            const existing = uniqueMap.get(site.id)
            if (!existing || (site.score ?? 0) > (existing.score ?? 0)) {
              uniqueMap.set(site.id, site)
            }
          }
          return Array.from(uniqueMap.values()).sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        })
      } else {
        // No search query: use sites API
        const sitesUrl = categoryParam && categoryParam !== 'all'
          ? `/api/sites?category=${encodeURIComponent(categoryParam)}&limit=60&offset=${paginationOffset}`
          : `/api/sites?limit=60&offset=${paginationOffset}`
        const response = await fetch(sitesUrl)
        if (!response.ok) {
          console.error('Failed to fetch more sites', response.status)
          return
        }
        data = await response.json()
        
        // Append new sites to existing ones
        const newSites = Array.isArray(data.sites) ? data.sites : []
        setAllSites(prev => {
          const combined = [...prev, ...newSites]
          // Remove duplicates by ID
          const uniqueMap = new Map<string, Site>()
          for (const site of combined) {
            const existing = uniqueMap.get(site.id)
            if (!existing) {
              uniqueMap.set(site.id, site)
            }
          }
          return Array.from(uniqueMap.values())
        })
      }
      
      // Update pagination state
      setHasMoreResults(data.hasMore || false)
      setPaginationOffset(prev => prev + 60)
      
      // Show more sites (increment displayed count)
      setDisplayedCount(prev => prev + 50)
    } catch (error) {
      console.error('Error loading more images:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMoreResults, selectedConcepts, category, paginationOffset])

  // Intersection Observer for lazy loading - set up when element is rendered
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    // Only set up observer if we have more results to load
    if (!hasMoreResults || isLoadingMore) {
      return
    }

    const currentRef = loadMoreRef.current
    if (!currentRef) {
      // Retry after a short delay to allow React to render the element
      const timeoutId = setTimeout(() => {
        if (loadMoreRef.current && hasMoreResults && !isLoadingMore) {
          const retryRef = loadMoreRef.current
          if (retryRef && observerRef.current === null) {
    const observer = new IntersectionObserver(
      (entries) => {
                if (entries[0].isIntersecting && hasMoreResults && !isLoadingMore) {
                  loadMoreImages()
        }
      },
      { threshold: 0.1 }
    )
            observer.observe(retryRef)
            observerRef.current = observer
          }
        }
      }, 100)
      return () => clearTimeout(timeoutId)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreResults && !isLoadingMore) {
          loadMoreImages()
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    )

    observer.observe(currentRef)
    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [hasMoreResults, isLoadingMore, loadMoreImages, allSites.length])

  // Fetch concept data with opposites when concepts change (not just when panel opens)
  // This ensures opposites are available for fetching opposite results
  useEffect(() => {
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
          
          // Update concept data with opposite labels, but preserve custom opposites
          setConceptData(prev => {
            const newMap = new Map(prev)
            for (const [key, conceptInfo] of conceptMap.entries()) {
              // Check if this concept already has a custom opposite (stored as label, not ID)
              const existingData = newMap.get(key)
              if (existingData && existingData.opposites.length > 0) {
                // Check if the opposite is a label (custom) or an ID (from API)
                const firstOpposite = existingData.opposites[0]
                // If it's not in the oppositeIdToLabel map, it's likely a custom label
                const isCustomOpposite = !oppositeIdToLabel.has(firstOpposite.toLowerCase())
                if (isCustomOpposite) {
                  // Preserve custom opposite
                  newMap.set(key, existingData)
                  continue
                }
              }
              
              // Otherwise, use the fetched opposites
              const oppositeLabels = conceptInfo.opposites.map(id => 
                oppositeIdToLabel.get(id.toLowerCase()) || id
              )
              newMap.set(key, {
                ...conceptInfo,
                opposites: oppositeLabels
              })
            }
            return newMap
          })
        } catch (error) {
          console.error('Error fetching concept data:', error)
        }
      }
      fetchConceptData()
  }, [selectedConcepts, customConcepts]) // Fetch when concepts change, not just when panel opens

  // Fetch sites when concepts or category change (but not when slider moves)
  // Moved to after fetchSites declaration
  
  // Check if we need to fetch opposite results when slider crosses 50%
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => {
      checkAndFetchOpposites()
    }, 100)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [sliderPositions, selectedConcepts, conceptData])
  
  // Reorder results client-side when slider moves (without refetching)
  useEffect(() => {
    if (selectedConcepts.length === 0) {
      return
    }
    
    // Helper function to calculate similarity tiers based on percentile ranking
    // This works correctly even when comparing different concepts with different score ranges
    // Returns 10 tiers: each representing 10% of results, working from top down
    const calculateTiers = (results: Site[]) => {
        if (results.length === 0) return { 
          tier1: [], tier2: [], tier3: [], tier4: [], tier5: [], 
          tier6: [], tier7: [], tier8: [], tier9: [], tier10: [] 
        }
        
        // Deduplicate by site ID - keep the one with the highest score for each ID
        const siteMap = new Map<string, Site>()
        for (const site of results) {
          const existing = siteMap.get(site.id)
          if (!existing || (site.score ?? 0) > (existing.score ?? 0)) {
            siteMap.set(site.id, site)
          }
        }
        const deduplicated = Array.from(siteMap.values())
        
        // Sort results by score (descending) to get relative ranking
        const sorted = [...deduplicated].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        
        // Divide into 10 tiers based on position in sorted array (percentile-based)
        // Each tier represents 10% of results, working from top down
        const total = sorted.length
        const tierSize = Math.ceil(total / 10)
        
        const tier1 = sorted.slice(0, tierSize) // Top 10% (highest similarity)
        const tier2 = sorted.slice(tierSize, tierSize * 2) // Next 10%
        const tier3 = sorted.slice(tierSize * 2, tierSize * 3) // Next 10%
        const tier4 = sorted.slice(tierSize * 3, tierSize * 4) // Next 10%
        const tier5 = sorted.slice(tierSize * 4, tierSize * 5) // Next 10%
        const tier6 = sorted.slice(tierSize * 5, tierSize * 6) // Next 10%
        const tier7 = sorted.slice(tierSize * 6, tierSize * 7) // Next 10%
        const tier8 = sorted.slice(tierSize * 7, tierSize * 8) // Next 10%
        const tier9 = sorted.slice(tierSize * 8, tierSize * 9) // Next 10%
        const tier10 = sorted.slice(tierSize * 9) // Bottom 10% (lowest similarity, includes remainder)
        
        return { tier1, tier2, tier3, tier4, tier5, tier6, tier7, tier8, tier9, tier10 }
      }
    
    // Handle single concept case
    if (selectedConcepts.length === 1) {
      const concept = selectedConcepts[0]
      const sliderPos = sliderPositions.get(concept) ?? 1.0
      const conceptResultSet = conceptResults.get(concept) || []
      const oppositeResultSet = oppositeResults.get(concept) || []
      
      if (conceptResultSet.length === 0 && oppositeResultSet.length === 0) {
        return
      }
      
      let orderedResults: Site[] = []
      
      // Determine which stop (1-10) based on position
      // Each stop represents 10% of the range (0-10%, 10-20%, ..., 90-100%)
      // Stop 1: 0.0-0.1 (0-10%)
      // Stop 2: 0.1-0.2 (10-20%)
      // Stop 3: 0.2-0.3 (20-30%)
      // Stop 4: 0.3-0.4 (30-40%)
      // Stop 5: 0.4-0.5 (40-50%)
      // Stop 6: 0.5-0.6 (50-60%)
      // Stop 7: 0.6-0.7 (60-70%)
      // Stop 8: 0.7-0.8 (70-80%)
      // Stop 9: 0.8-0.9 (80-90%)
      // Stop 10: 0.9-1.0 (90-100%)
      let stopNumber: number
      // Clamp sliderPos to [0, 1] to handle edge cases
      const clampedPos = Math.max(0, Math.min(1, sliderPos))
      // Calculate stop: floor(position * 10) gives us 0-9, then add 1 to get 1-10
      // Special case: if position is exactly 1.0, we want stop 10, not stop 11
      if (clampedPos === 1.0) {
        stopNumber = 10
      } else {
        stopNumber = Math.floor(clampedPos * 10) + 1
      }
      // Ensure stopNumber is in valid range [1, 10]
      stopNumber = Math.max(1, Math.min(10, stopNumber))
      
      if (sliderPos > 0.5) {
        // Slider towards concept (right side) - Stops 6-10 (50-100%)
        const conceptTiers = calculateTiers(conceptResultSet)
        // Tiers are already sorted by score (descending), so just copy them
        const t1 = [...conceptTiers.tier1]
        const t2 = [...conceptTiers.tier2]
        const t3 = [...conceptTiers.tier3]
        const t4 = [...conceptTiers.tier4]
        const t5 = [...conceptTiers.tier5]
        const t6 = [...conceptTiers.tier6]
        const t7 = [...conceptTiers.tier7]
        const t8 = [...conceptTiers.tier8]
        const t9 = [...conceptTiers.tier9]
        const t10 = [...conceptTiers.tier10]
        
        // Right side: Stops 6-10 (51-100%) - each stop prioritizes a different 10% tier for smooth transitions
        // Stop 10 (100%): Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (best matches first)
        // Stop 9 (90%): Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (next tier first)
        // Stop 8 (80%): Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2
        // Stop 7 (70%): Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3
        // Stop 6 (60%): Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4
        if (stopNumber === 10) {
          orderedResults = [...t1, ...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10]
        } else if (stopNumber === 9) {
          orderedResults = [...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1]
        } else if (stopNumber === 8) {
          orderedResults = [...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2]
        } else if (stopNumber === 7) {
          orderedResults = [...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2, ...t3]
        } else {
          // Stop 6
          orderedResults = [...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2, ...t3, ...t4]
        }
      } else {
        // sliderPos <= 0.5
        // Slider towards opposite (left side) - Stops 1-5 (0-50%)
        if (oppositeResultSet.length === 0) {
          // If opposite not loaded, show concept results but still vary the ordering
          const conceptTiersNoOpp = calculateTiers(conceptResultSet)
          const t1NoOpp = [...conceptTiersNoOpp.tier1]
          const t2NoOpp = [...conceptTiersNoOpp.tier2]
          const t3NoOpp = [...conceptTiersNoOpp.tier3]
          const t4NoOpp = [...conceptTiersNoOpp.tier4]
          const t5NoOpp = [...conceptTiersNoOpp.tier5]
          const t6NoOpp = [...conceptTiersNoOpp.tier6]
          const t7NoOpp = [...conceptTiersNoOpp.tier7]
          const t8NoOpp = [...conceptTiersNoOpp.tier8]
          const t9NoOpp = [...conceptTiersNoOpp.tier9]
          const t10NoOpp = [...conceptTiersNoOpp.tier10]
          
          // Left side without opposite: use concept results with reverse tier ordering (tier 5 down to tier 1)
          // Same pattern as stops 6-10 but in reverse, using concept results as fallback
          // Stop 5 (50%): Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first)
          // Stop 4 (40%): Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first)
          // Stop 3 (30%): Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first)
          // Stop 2 (20%): Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first)
          // Stop 1 (0%): Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (tier 1 first - best matches)
          if (stopNumber === 1) {
            orderedResults = [...t1NoOpp, ...t2NoOpp, ...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp]
          } else if (stopNumber === 2) {
            orderedResults = [...t2NoOpp, ...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp]
          } else if (stopNumber === 3) {
            orderedResults = [...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp]
          } else if (stopNumber === 4) {
            orderedResults = [...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp, ...t3NoOpp]
          } else {
            // Stop 5
            orderedResults = [...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp, ...t3NoOpp, ...t4NoOpp]
          }
        } else {
          const oppositeTiers = calculateTiers(oppositeResultSet)
          // For opposite, tiers are sorted descending (best opposite first)
          // We want to show worst opposite matches first to emphasize the "opposite" effect
          const t1Opp = [...oppositeTiers.tier1] // Best opposite matches
          const t2Opp = [...oppositeTiers.tier2]
          const t3Opp = [...oppositeTiers.tier3]
          const t4Opp = [...oppositeTiers.tier4]
          const t5Opp = [...oppositeTiers.tier5]
          const t6Opp = [...oppositeTiers.tier6]
          const t7Opp = [...oppositeTiers.tier7]
          const t8Opp = [...oppositeTiers.tier8]
          const t9Opp = [...oppositeTiers.tier9]
          const t10Opp = [...oppositeTiers.tier10] // Worst opposite matches (most like concept)
          
          // Left side: Stops 1-5 (0-50%) - with opposite results using 10 tiers, in reverse order
          // Same logic as stops 6-10 but for opposite concept, going from tier 5 down to tier 1
          // Stop 5 (50%): Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first - opposite concept)
          // Stop 4 (40%): Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first - opposite concept)
          // Stop 3 (30%): Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first - opposite concept)
          // Stop 2 (20%): Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first - opposite concept)
          // Stop 1 (0%): Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (tier 1 first - opposite concept, best opposite matches)
          if (stopNumber === 1) {
            orderedResults = [...t1Opp, ...t2Opp, ...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp]
          } else if (stopNumber === 2) {
            orderedResults = [...t2Opp, ...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp]
          } else if (stopNumber === 3) {
            orderedResults = [...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp]
          } else if (stopNumber === 4) {
            orderedResults = [...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp, ...t3Opp]
          } else {
            // Stop 5
            orderedResults = [...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp, ...t3Opp, ...t4Opp]
          }
        }
      }
      
      // Deduplicate results by site ID before setting
      // IMPORTANT: Use Array.from with a new array to ensure React detects the change
      const deduplicatedResults = Array.from(
        new Map(orderedResults.map(site => [site.id, site])).values()
      )
      
      // Only set sites if we have results
      // Create a completely new array reference to force React to re-render
      if (deduplicatedResults.length > 0) {
        const newSitesArray = [...deduplicatedResults] // Create new array reference
        setAllSites(newSitesArray)
        setDisplayedCount(50)
      } else if (conceptResultSet.length > 0) {
        // Fallback: if reordering produced no results, use original concept results
        const fallbackArray = [...conceptResultSet].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        setAllSites(fallbackArray)
        setDisplayedCount(50)
      }
    } else {
      // Multiple concepts: apply slider-based ranking for each concept, then combine
      
      // Step 1: For each concept, calculate its tier-based ordering based on slider position
      const conceptOrderedResults = new Map<string, Site[]>() // concept -> ordered results
      
      for (const concept of selectedConcepts) {
        const sliderPos = sliderPositions.get(concept) ?? 1.0
        const conceptResultSet = conceptResults.get(concept) || []
        const oppositeResultSet = oppositeResults.get(concept) || []
        
        if (conceptResultSet.length === 0 && oppositeResultSet.length === 0) {
          console.log(`[MULTI DEBUG] No results for concept: ${concept}`)
          continue
        }
        
        // Calculate stop number (same logic as single concept)
        const clampedPos = Math.max(0, Math.min(1, sliderPos))
        let stopNumber: number
        if (clampedPos === 1.0) {
          stopNumber = 10
        } else {
          stopNumber = Math.floor(clampedPos * 10) + 1
        }
        stopNumber = Math.max(1, Math.min(10, stopNumber))
        
        console.log(`[MULTI DEBUG] Concept: ${concept}, sliderPos: ${sliderPos.toFixed(3)} (${(sliderPos * 100).toFixed(1)}%), stop: ${stopNumber}`)
        
        let orderedResults: Site[] = []
        
        if (sliderPos > 0.5) {
          // Right side: use concept results
          const conceptTiers = calculateTiers(conceptResultSet)
          const t1 = [...conceptTiers.tier1]
          const t2 = [...conceptTiers.tier2]
          const t3 = [...conceptTiers.tier3]
          const t4 = [...conceptTiers.tier4]
          const t5 = [...conceptTiers.tier5]
          const t6 = [...conceptTiers.tier6]
          const t7 = [...conceptTiers.tier7]
          const t8 = [...conceptTiers.tier8]
          const t9 = [...conceptTiers.tier9]
          const t10 = [...conceptTiers.tier10]
          
          // Apply same tier ordering logic as single concept
          if (stopNumber === 10) {
            orderedResults = [...t1, ...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10]
          } else if (stopNumber === 9) {
            orderedResults = [...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1]
          } else if (stopNumber === 8) {
            orderedResults = [...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2]
          } else if (stopNumber === 7) {
            orderedResults = [...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2, ...t3]
          } else {
            // Stop 6
            orderedResults = [...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2, ...t3, ...t4]
          }
        } else {
          // Left side: use opposite results if available, otherwise concept results
          if (oppositeResultSet.length === 0) {
            // No opposite: use concept results with varied ordering
            const conceptTiersNoOpp = calculateTiers(conceptResultSet)
            const t1NoOpp = [...conceptTiersNoOpp.tier1]
            const t2NoOpp = [...conceptTiersNoOpp.tier2]
            const t3NoOpp = [...conceptTiersNoOpp.tier3]
            const t4NoOpp = [...conceptTiersNoOpp.tier4]
            const t5NoOpp = [...conceptTiersNoOpp.tier5]
            const t6NoOpp = [...conceptTiersNoOpp.tier6]
            const t7NoOpp = [...conceptTiersNoOpp.tier7]
            const t8NoOpp = [...conceptTiersNoOpp.tier8]
            const t9NoOpp = [...conceptTiersNoOpp.tier9]
            const t10NoOpp = [...conceptTiersNoOpp.tier10]
            
            if (stopNumber === 1) {
              orderedResults = [...t1NoOpp, ...t2NoOpp, ...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp]
            } else if (stopNumber === 2) {
              orderedResults = [...t2NoOpp, ...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp]
            } else if (stopNumber === 3) {
              orderedResults = [...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp]
            } else if (stopNumber === 4) {
              orderedResults = [...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp, ...t3NoOpp]
            } else {
              // Stop 5
              orderedResults = [...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp, ...t3NoOpp, ...t4NoOpp]
            }
          } else {
            // Use opposite results
            const oppositeTiers = calculateTiers(oppositeResultSet)
            const t1Opp = [...oppositeTiers.tier1]
            const t2Opp = [...oppositeTiers.tier2]
            const t3Opp = [...oppositeTiers.tier3]
            const t4Opp = [...oppositeTiers.tier4]
            const t5Opp = [...oppositeTiers.tier5]
            const t6Opp = [...oppositeTiers.tier6]
            const t7Opp = [...oppositeTiers.tier7]
            const t8Opp = [...oppositeTiers.tier8]
            const t9Opp = [...oppositeTiers.tier9]
            const t10Opp = [...oppositeTiers.tier10]
            
            if (stopNumber === 1) {
              orderedResults = [...t1Opp, ...t2Opp, ...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp]
            } else if (stopNumber === 2) {
              orderedResults = [...t2Opp, ...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp]
            } else if (stopNumber === 3) {
              orderedResults = [...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp]
            } else if (stopNumber === 4) {
              orderedResults = [...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp, ...t3Opp]
            } else {
              // Stop 5
              orderedResults = [...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp, ...t3Opp, ...t4Opp]
            }
          }
        }
        
        conceptOrderedResults.set(concept, orderedResults)
        console.log(`[MULTI DEBUG] Concept ${concept}: ${orderedResults.length} ordered results`)
      }
      
      // Step 2: Combine results from all concepts by scoring each site based on its tier position
      // Sites that appear in higher tiers across multiple concepts get higher combined scores
      const siteScores = new Map<string, { site: Site; score: number; conceptCount: number }>()
      
      for (const [concept, orderedResults] of conceptOrderedResults.entries()) {
        // Score based on position: earlier in the list = higher score
        // Use inverse position (first item gets highest score)
        orderedResults.forEach((site, index) => {
          const positionScore = 1.0 / (index + 1) // First item: 1.0, second: 0.5, third: 0.33, etc.
          const existing = siteScores.get(site.id)
          
          if (existing) {
            // Site appears in multiple concepts: combine scores (additive)
            existing.score += positionScore
            existing.conceptCount += 1
          } else {
            siteScores.set(site.id, {
              site,
              score: positionScore,
              conceptCount: 1
            })
          }
        })
      }
      
      // Step 3: Sort by combined score (higher is better)
      const combinedResults = Array.from(siteScores.values())
        .sort((a, b) => {
          // Primary sort: combined score (higher is better)
          if (Math.abs(a.score - b.score) > 0.001) {
            return b.score - a.score
          }
          // Secondary sort: number of concepts (more concepts = better)
          if (a.conceptCount !== b.conceptCount) {
            return b.conceptCount - a.conceptCount
          }
          // Tertiary sort: original score (higher is better)
          return (b.site.score ?? 0) - (a.site.score ?? 0)
        })
        .map(item => item.site)
      
      console.log(`[MULTI DEBUG] Combined ${combinedResults.length} unique sites from ${selectedConcepts.length} concepts`)
      console.log(`[MULTI DEBUG] First 10 IDs: ${combinedResults.slice(0, 10).map(s => s.id.substring(0, 8)).join(', ')}`)
      
      if (combinedResults.length > 0) {
        setAllSites(combinedResults)
        setDisplayedCount(50)
      }
    }
  }, [
    sliderVersion, // Use version counter instead of Map to detect changes
    selectedConcepts.length,
    resultsVersion,
  ]) // Use sliderVersion to detect slider changes, resultsVersion to detect result changes

  // Fetch concept suggestions for a specific spectrum input
  const fetchSpectrumSuggestions = async (spectrumId: string, query: string) => {
    const trimmed = query.trim()
    if (!trimmed || trimmed.length < 1) {
      setSpectrums(prev => prev.map(s => 
        s.id === spectrumId 
          ? { ...s, conceptSuggestions: [], selectedSuggestionIndex: -1, showSuggestions: false }
          : s
      ))
      return
    }

    try {
      const response = await fetch(`/api/concepts?q=${encodeURIComponent(trimmed)}`)
      if (!response.ok) {
        setSpectrums(prev => prev.map(s => 
          s.id === spectrumId 
            ? { ...s, conceptSuggestions: [], selectedSuggestionIndex: -1 }
            : s
        ))
        return
      }
      const data = await response.json()
      setSpectrums(prev => prev.map(s => 
        s.id === spectrumId 
          ? { ...s, conceptSuggestions: Array.isArray(data.concepts) ? data.concepts : [], selectedSuggestionIndex: -1, showSuggestions: true }
          : s
      ))
    } catch (error: any) {
      console.error('Error fetching concept suggestions:', error)
      setSpectrums(prev => prev.map(s => 
        s.id === spectrumId 
          ? { ...s, conceptSuggestions: [], selectedSuggestionIndex: -1 }
          : s
      ))
    }
  }

  // Fetch opposite results for a concept
  const fetchOppositeResults = async (concept: string, oppositeLabel: string, categoryParam: string) => {
    console.log(`[OPPOSITE DEBUG] Fetching opposite results for concept: ${concept}, opposite: ${oppositeLabel}, category: ${categoryParam}`)
    const searchUrl = `/api/search?q=${encodeURIComponent(oppositeLabel)}&category=${encodeURIComponent(categoryParam)}`
    try {
      const response = await fetch(searchUrl)
      console.log(`[OPPOSITE DEBUG] Fetch response status: ${response.status}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`[OPPOSITE DEBUG] Fetched ${data.sites?.length || 0} sites for opposite`)
        const imageMap = new Map<string, any>()
        for (const image of data.images || []) {
          const siteId = image.siteId || image.site?.id
          if (siteId) {
            if (!imageMap.has(siteId) || (image.score || 0) > (imageMap.get(siteId)?.score || 0)) {
              imageMap.set(siteId, image)
            }
          }
        }
        const sitesWithImageIds = (data.sites || []).map((site: Site) => {
          const image = imageMap.get(site.id)
          const siteCategory = (site as any).category || image?.category || 'website'
          return {
            ...site,
            imageId: image?.imageId || undefined,
            category: siteCategory,
            score: image?.score || (site as any).score || 0, // Preserve similarity score
          }
        })
        // Deduplicate by site ID - keep the one with the highest score for each ID
        const siteMap = new Map<string, Site>()
        for (const site of sitesWithImageIds) {
          const existing = siteMap.get(site.id)
          if (!existing || (site.score ?? 0) > (existing.score ?? 0)) {
            siteMap.set(site.id, site)
          }
        }
        const deduplicatedOppositeSites = Array.from(siteMap.values())
        console.log(`[OPPOSITE DEBUG] Setting opposite results for ${concept}: ${deduplicatedOppositeSites.length} sites (${sitesWithImageIds.length} before deduplication)`)
        setOppositeResults(prev => new Map(prev).set(concept, deduplicatedOppositeSites))
        setResultsVersion(prev => prev + 1) // Trigger reorder after fetching
        // Reorder after fetching opposite
        // Results will be reordered by the useEffect hook when sliderPositions change
      } else {
        console.log(`[OPPOSITE DEBUG] Fetch failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error(`[OPPOSITE DEBUG] Error fetching opposite results for ${concept}:`, error)
    }
  }
  
  
  // Check if slider crossed 50% threshold and fetch opposite if needed
  // Also fetch opposites upfront for all concepts that don't have them yet
  const checkAndFetchOpposites = async () => {
    if (selectedConcepts.length === 0) return
    
    const query = selectedConcepts.join(' ')
    if (!query.trim()) return
    
    const categoryParam = category || 'all'
    const needsOppositeFetch: string[] = []
    
    selectedConcepts.forEach(concept => {
      const sliderPos = sliderPositions.get(concept) ?? 1.0
      const lastSide = lastSliderSide.get(concept)
      const currentSide = sliderPos < 0.5 ? 'left' : 'right'
      
      const conceptInfo = conceptData.get(concept.toLowerCase())
      const opposites = conceptInfo?.opposites || []
      
      // Fetch opposite if:
      // 1. We crossed the 50% threshold, OR
      // 2. We don't have opposite results yet (fetch upfront for all concepts)
      const shouldFetch = opposites.length > 0 && !oppositeResults.has(concept)
      const crossedThreshold = lastSide && lastSide !== currentSide
      
      if (shouldFetch || crossedThreshold) {
        needsOppositeFetch.push(concept)
      }
      
      // Update last side
      setLastSliderSide(prev => new Map(prev).set(concept, currentSide))
    })
    
    // Fetch opposite results for concepts that need them
    for (const concept of needsOppositeFetch) {
      const conceptInfo = conceptData.get(concept.toLowerCase())
      const opposites = conceptInfo?.opposites || []
      if (opposites.length > 0) {
        const firstOpposite = opposites[0]
        fetchOppositeResults(concept, firstOpposite, categoryParam)
      }
    }
  }

  const fetchSites = useCallback(async () => {
    console.log('[fetchSites] Called with selectedConcepts:', selectedConcepts, 'category:', category)
    try {
      setLoading(true)
      
      // Reset pagination state for new search
      setPaginationOffset(0)
      setHasMoreResults(false)
      setIsLoadingMore(false)
      
      // Build search query from selected concepts
      const query = selectedConcepts.join(' ')
      
      if (query.trim()) {
        // Zero-shot search: rank images by cosine similarity
        // Pass category parameter: "website", "packaging", or "all" (or omit for "all")
        const categoryParam = category || 'all'
        
        // Don't pass slider positions - we'll reorder client-side
        // Initial fetch: limit 60, offset 0
        const searchUrl = `/api/search?q=${encodeURIComponent(query.trim())}&category=${encodeURIComponent(categoryParam)}&limit=60&offset=0`
        console.log('[fetchSites] Fetching search URL:', searchUrl)
        const response = await fetch(searchUrl)
        if (!response.ok) {
          console.error('[fetchSites] Failed response fetching search', response.status, response.statusText)
          const errorText = await response.text().catch(() => '')
          console.error('[fetchSites] Error response:', errorText.substring(0, 200))
          setSites([])
          setAllSites([])
          return
        }
        const data = await response.json()
        console.log('[fetchSites] Search response received:', { 
          imageCount: data.images?.length || 0, 
          hasMore: data.hasMore,
          query: query.trim(),
          error: data.error,
          total: data.total
        })
        
        if (data.error) {
          console.error('[fetchSites] API returned error:', data.error)
        }
        
        if (data.images && data.images.length === 0 && !data.error) {
          console.warn('[fetchSites] WARNING: Search returned 0 images but no error. This might indicate a problem with the search API.')
        }
        
        // Update pagination state
        setHasMoreResults(data.hasMore || false)
        setPaginationOffset(60) // Next fetch will be at offset 60
        
        // Search API returns images with embedded site data
        // Extract sites from images array
        const sitesWithImageIds = (data.images || []).map((image: any) => {
          const site = image.site || {}
          const siteCategory = image.site?.category || image.category || 'website'
          return {
            id: site.id || image.siteId,
            title: site.title || '',
            description: site.description || null,
            url: site.url || image.siteUrl || '',
            imageUrl: image.url || site.imageUrl || null,
            author: site.author || null,
            tags: [],
            imageId: image.imageId || undefined,
            category: siteCategory,
            score: image.score || 0,
          } as Site
        })
        // Deduplicate by site ID - keep the one with the highest score for each ID
        const siteMap = new Map<string, Site>()
        for (const site of sitesWithImageIds) {
          const existing = siteMap.get(site.id)
          if (!existing || (site.score ?? 0) > (existing.score ?? 0)) {
            siteMap.set(site.id, site)
          }
        }
        const deduplicatedSites = Array.from(siteMap.values())
        
        // Store results for each concept
        if (selectedConcepts.length === 1) {
          const concept = selectedConcepts[0]
          setConceptResults(prev => {
            const newMap = new Map(prev)
            newMap.set(concept, deduplicatedSites)
            return newMap
          })
          // Initialize last slider side
          const sliderPos = sliderPositions.get(concept) ?? 1.0
          setLastSliderSide(prev => new Map(prev).set(concept, sliderPos < 0.5 ? 'left' : 'right'))
          // Increment version to trigger reordering
          setResultsVersion(prev => prev + 1)
          
          // Store all sites for lazy loading (will be displayed by useEffect)
          if (deduplicatedSites.length > 0) {
            const sorted = [...deduplicatedSites].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            setAllSites(sorted)
            setDisplayedCount(50)
          }
          
          // ALWAYS fetch opposite results upfront so both sides work immediately
          const conceptInfo = conceptData.get(concept.toLowerCase())
          const opposites = conceptInfo?.opposites || []
          if (opposites.length > 0) {
            const firstOpposite = opposites[0]
            // Fetch opposite immediately, don't wait for slider to cross 50%
            fetchOppositeResults(concept, firstOpposite, categoryParam)
          }
        } else {
          // Multiple concepts: fetch results for each concept individually
          
          const conceptResultsMap = new Map<string, Site[]>()
          const fetchPromises: Promise<void>[] = []
          
          for (const concept of selectedConcepts) {
            const fetchPromise = (async () => {
              try {
                const conceptSearchUrl = `/api/search?q=${encodeURIComponent(concept.trim())}&category=${encodeURIComponent(categoryParam)}`
                const conceptResponse = await fetch(conceptSearchUrl)
                if (!conceptResponse.ok) {
                  console.error(`Failed to fetch results for concept "${concept}":`, conceptResponse.status)
                  return
                }
                const conceptData = await conceptResponse.json()
                
                // Map images to sites (same logic as single concept)
                const conceptImageMap = new Map<string, any>()
                for (const image of conceptData.images || []) {
                  const siteId = image.siteId || image.site?.id
                  if (siteId) {
                    if (!conceptImageMap.has(siteId) || (image.score || 0) > (conceptImageMap.get(siteId)?.score || 0)) {
                      conceptImageMap.set(siteId, image)
                    }
                  }
                }
                
                const conceptSitesWithImageIds = (conceptData.sites || []).map((site: Site) => {
                  const image = conceptImageMap.get(site.id)
                  const siteCategory = (site as any).category || image?.category || 'website'
                  return {
                    ...site,
                    imageId: image?.imageId || undefined,
                    category: siteCategory,
                    score: image?.score || (site as any).score || 0,
                  }
                })
                
                // Deduplicate by site ID
                const conceptSiteMap = new Map<string, Site>()
                for (const site of conceptSitesWithImageIds) {
                  const existing = conceptSiteMap.get(site.id)
                  if (!existing || (site.score ?? 0) > (existing.score ?? 0)) {
                    conceptSiteMap.set(site.id, site)
                  }
                }
                const deduplicatedConceptSites = Array.from(conceptSiteMap.values())
                
                conceptResultsMap.set(concept, deduplicatedConceptSites)
                
                // Initialize last slider side
                const sliderPos = sliderPositions.get(concept) ?? 1.0
                setLastSliderSide(prev => new Map(prev).set(concept, sliderPos < 0.5 ? 'left' : 'right'))
                
                // Fetch opposite results for this concept (will use conceptData state)
                // Note: conceptData is fetched separately, so opposites will be fetched
                // when conceptData is available via checkAndFetchOpposites
              } catch (error) {
                console.error(`Error fetching results for concept "${concept}":`, error)
              }
            })()
            
            fetchPromises.push(fetchPromise)
          }
          
          // Wait for all concept fetches to complete
          await Promise.all(fetchPromises)
          
          // Store all concept results
          setConceptResults(prev => {
            const newMap = new Map(prev)
            for (const [concept, results] of conceptResultsMap.entries()) {
              newMap.set(concept, results)
            }
            return newMap
          })
          
          // Increment version to trigger reordering
          setResultsVersion(prev => prev + 1)
          
          // Display initial combined results (will be reordered by useEffect based on sliders)
          const allResults: Site[] = []
          for (const results of conceptResultsMap.values()) {
            allResults.push(...results)
          }
          const deduplicatedAllResults = Array.from(
            new Map(allResults.map(site => [site.id, site])).values()
          )
          if (deduplicatedAllResults.length > 0) {
            const sorted = [...deduplicatedAllResults].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            setAllSites(sorted)
            setDisplayedCount(50)
          }
        }
        
        // Results will be reordered by the useEffect hook when sliderPositions change
      } else {
        // No search query: show all sites (optionally filtered by category)
        // Initial fetch: limit 60, offset 0
        const sitesUrl = category 
          ? `/api/sites?category=${encodeURIComponent(category)}&limit=60&offset=0`
          : '/api/sites?limit=60&offset=0'
        try {
          const response = await fetch(sitesUrl)
          if (!response.ok) {
            // Check if response is JSON before parsing
            const contentType = response.headers.get('content-type')
            let errorData = {}
            if (contentType && contentType.includes('application/json')) {
              try {
                errorData = await response.json()
              } catch (e) {
                // Response is not JSON, might be HTML error page
                const text = await response.text()
                console.error('Failed response fetching sites (non-JSON)', response.status, text.substring(0, 200))
              }
            } else {
              const text = await response.text()
              console.error('Failed response fetching sites (HTML)', response.status, text.substring(0, 200))
            }
            console.error('Failed response fetching sites', response.status, errorData)
            setAllSites([])
            setSites([])
            setDisplayedCount(50)
            setHasMoreResults(false)
            return
          }
          const data = await response.json()
          const sites = Array.isArray(data.sites) ? data.sites : []
          console.log('[fetchSites] Loaded default sites (no filters):', sites.length, 'sites')
          setAllSites(sites)
          setSites(sites.slice(0, 50)) // Show first 50 immediately
          setDisplayedCount(50)
          const hasMore = data.hasMore === true // Explicitly check for true
          setHasMoreResults(hasMore)
          setPaginationOffset(60) // Next fetch will be at offset 60
        } catch (error) {
          console.error('Error fetching sites:', error)
          setSites([])
          setAllSites([])
        }
      }
    } catch (error) {
      console.error('Error in fetchSites:', error)
      setSites([])
    } finally {
      setLoading(false)
    }
  }, [selectedConcepts, category])

  // Fetch sites when concepts or category change (but not when slider moves)
  useEffect(() => {
    console.log('[useEffect] selectedConcepts or category changed, scheduling fetchSites in 300ms. selectedConcepts:', selectedConcepts, 'category:', category)
    const controller = new AbortController()
    const timer = setTimeout(() => {
      console.log('[useEffect] Timer fired, calling fetchSites')
      fetchSites()
    }, 300)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [selectedConcepts, category, fetchSites])

  // Initial fetch on mount
  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  // Main search input handler (simple text search)
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  // Main search submit handler - uses same logic as before (custom queries) but no concept suggestions
  const handleSearchSubmit = () => {
    const trimmed = searchQuery.trim()
    if (trimmed) {
      // Add as custom concept and trigger search (same logic as before, but no concept matching)
      if (!selectedConcepts.includes(trimmed)) {
        setSelectedConcepts(prev => [...prev, trimmed])
        setCustomConcepts(prev => new Set(prev).add(trimmed))
        setSliderPositions(prev => {
          const newMap = new Map(prev)
          newMap.set(trimmed, 1.0) // Default position
          return newMap
        })
      }
      // Keep the search query visible in the input field
    }
  }

  // Clear search query
  const clearSearchQuery = () => {
    setSearchQuery('')
    // Also remove from selectedConcepts if it was added
    const trimmed = searchQuery.trim()
    if (trimmed && selectedConcepts.includes(trimmed)) {
      setSelectedConcepts(prev => prev.filter(c => c !== trimmed))
      setCustomConcepts(prev => {
        const next = new Set(prev)
        next.delete(trimmed)
        return next
      })
      setSliderPositions(prev => {
        const newMap = new Map(prev)
        newMap.delete(trimmed)
        return newMap
      })
      // Also remove from spectrums if it exists
      setSpectrums(prev => prev.filter(s => s.concept !== trimmed))
    }
  }

  // Spectrum input change handler
  const handleSpectrumInputChange = (spectrumId: string, value: string) => {
    setSpectrums(prev => prev.map(s => 
      s.id === spectrumId 
        ? { ...s, inputValue: value }
        : s
    ))
  }

  // Debounce concept suggestions for spectrum inputs
  useEffect(() => {
    const timers = new Map<string, NodeJS.Timeout>()
    
    spectrums.forEach(spectrum => {
      const trimmed = spectrum.inputValue.trim()
      if (trimmed && trimmed.length >= 1) {
        const timer = setTimeout(() => {
          fetchSpectrumSuggestions(spectrum.id, trimmed)
        }, 250)
        timers.set(spectrum.id, timer)
      } else {
        setSpectrums(prev => prev.map(s => 
          s.id === spectrum.id 
            ? { ...s, conceptSuggestions: [], selectedSuggestionIndex: -1, showSuggestions: false }
            : s
        ))
      }
    })
    
    return () => {
      timers.forEach(timer => clearTimeout(timer))
    }
  }, [spectrums.map(s => s.inputValue).join(',')])


  // Function to fetch and set opposite for a concept

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (showAddConceptModal && addConceptInputRef) {
      setTimeout(() => {
        addConceptInputRef.focus()
      }, 100)
    }
  }, [showAddConceptModal, addConceptInputRef])

  // Add a new spectrum to the drawer - shows input field
  const addSpectrum = () => {
    const newSpectrum: Spectrum = {
      id: `spectrum-${Date.now()}`,
      concept: '',
      inputValue: '',
      sliderPosition: 1.0,
      conceptSuggestions: [],
      selectedSuggestionIndex: -1,
      showSuggestions: false,
      isInputVisible: true // Start with input visible
    }
    setSpectrums(prev => [...prev, newSpectrum])
  }

  // Handle creating spectrum from modal
  const handleCreateSpectrum = async () => {
    // Clear previous errors
    setVibeFieldError(undefined)
    
    const concept = addConceptInputValue.trim()
    
    // Validate field
    if (!concept) {
      setVibeFieldError('Vibe is required')
      // Focus the input field
      if (addConceptInputRef) {
        addConceptInputRef.focus()
        addConceptInputRef.select()
      }
      return
    }
    
    // On public page, enforce limits:
    // 1. Max 2 active filters at the same time
    // 2. Max 3 filters created per day
    if (isPublicPage) {
      // Check if already have 2 active filters
      if (spectrums.length >= 2) {
        setShowAddConceptModal(false)
        setShowLoginModal(true)
        return
      }
      
      // Check if already created 3 filters today
      const dailyCount = getDailyFilterCount()
      if (dailyCount >= 3) {
        setShowAddConceptModal(false)
        setShowLoginModal(true)
        return
      }
      
      // Increment daily count
      incrementDailyFilterCount()
    }
    
    // Close modal immediately
    setShowAddConceptModal(false)
    const inputValue = addConceptInputValue
    setAddConceptInputValue('')
    
    // Extensions will be generated on-the-fly during search
    // No need to pre-generate them - the search API handles this automatically
    
    // Now add the concept and trigger search (extensions will be generated on-the-fly)
    console.log('[vibe-filter] Adding concept to selectedConcepts:', concept)
    // Create spectrum (single-pole, no opposite)
    const newSpectrum: Spectrum = {
      id: `spectrum-${Date.now()}`,
      concept: concept,
      inputValue: concept,
      sliderPosition: 1.0,
      conceptSuggestions: [],
      selectedSuggestionIndex: -1,
      showSuggestions: false,
      isInputVisible: false
    }
    
    setSpectrums(prev => [...prev, newSpectrum])
    
    if (!selectedConcepts.includes(concept)) {
      console.log('[vibe-filter] Adding concept to selectedConcepts:', concept, 'Current selectedConcepts:', selectedConcepts)
      setSelectedConcepts(prev => {
        const updated = [...prev, concept]
        console.log('[vibe-filter] Updated selectedConcepts:', updated)
        return updated
      })
      setCustomConcepts(prev => new Set(prev).add(concept))
      setSliderPositions(prev => {
        const newMap = new Map(prev)
        newMap.set(concept, 1.0)
        return newMap
      })
      console.log('[vibe-filter] Concept added successfully, search should trigger in 300ms')
    } else {
      console.log('[vibe-filter] Concept already in selectedConcepts, skipping')
    }
  }

  // Remove a spectrum from the drawer
  const removeSpectrum = (spectrumId: string) => {
    setSpectrums(prev => {
      const filtered = prev.filter(s => s.id !== spectrumId)
      // Also remove from selectedConcepts if it was added
      const spectrum = prev.find(s => s.id === spectrumId)
      if (spectrum && spectrum.concept) {
        console.log('[vibe-filter] Removing concept:', spectrum.concept)
        setSelectedConcepts(prevConcepts => {
          const updated = prevConcepts.filter(c => c !== spectrum.concept)
          console.log('[vibe-filter] Updated selectedConcepts after removal:', updated)
          return updated
        })
        setCustomConcepts(prevCustom => {
          const next = new Set(prevCustom)
          next.delete(spectrum.concept)
          return next
        })
        setSliderPositions(prev => {
          const newMap = new Map(prev)
          newMap.delete(spectrum.concept)
          return newMap
        })
      }
      return filtered
    })
  }

  // Handle spectrum concept selection (when user selects a concept from suggestions)
  const handleSpectrumConceptSelect = (spectrumId: string, suggestion: ConceptSuggestion) => {
    const conceptLabel = suggestion.label
    setSpectrums(prev => prev.map(s => 
      s.id === spectrumId 
        ? { 
            ...s, 
            concept: conceptLabel,
            inputValue: conceptLabel,
            showSuggestions: false,
            conceptSuggestions: [],
            selectedSuggestionIndex: -1,
            sliderPosition: 1.0, // Default slider position
            isInputVisible: false // Hide input after selection
          }
        : s
    ))
    
    // Add to selectedConcepts and trigger search
    if (!selectedConcepts.includes(conceptLabel)) {
      setSelectedConcepts(prev => [...prev, conceptLabel])
      setSliderPositions(prev => {
        const newMap = new Map(prev)
        newMap.set(conceptLabel, 1.0) // Default position
        return newMap
      })
    }
  }

  // Handle spectrum input Enter key (add concept)
  const handleSpectrumKeyDown = (spectrumId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    const spectrum = spectrums.find(s => s.id === spectrumId)
    if (!spectrum) return

    if (spectrum.conceptSuggestions.length > 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (spectrum.selectedSuggestionIndex >= 0 && spectrum.selectedSuggestionIndex < spectrum.conceptSuggestions.length) {
          handleSpectrumConceptSelect(spectrumId, spectrum.conceptSuggestions[spectrum.selectedSuggestionIndex])
        } else if (spectrum.inputValue.trim()) {
          const trimmed = spectrum.inputValue.trim()
          const trimmedLower = trimmed.toLowerCase()
          const queryId = trimmedLower.replace(/[^a-z0-9]+/g, '-')
          
          const exactMatch = spectrum.conceptSuggestions.find((suggestion: ConceptSuggestion) => {
            const labelLower = suggestion.label.toLowerCase()
            const idLower = suggestion.id.toLowerCase()
            return labelLower === trimmedLower || idLower === trimmedLower || idLower === queryId
          })
          
          if (exactMatch) {
            handleSpectrumConceptSelect(spectrumId, exactMatch)
          } else {
            // Add as custom concept
            setSpectrums(prev => prev.map(s => 
              s.id === spectrumId 
                ? { 
                    ...s, 
                    concept: trimmed,
                    inputValue: trimmed,
                    showSuggestions: false,
                    conceptSuggestions: [],
                    selectedSuggestionIndex: -1,
                    sliderPosition: 1.0,
                    isInputVisible: false // Hide input after Enter
                  }
                : s
            ))
            if (!selectedConcepts.includes(trimmed)) {
              setSelectedConcepts(prev => [...prev, trimmed])
              setCustomConcepts(prev => new Set(prev).add(trimmed))
              setSliderPositions(prev => {
                const newMap = new Map(prev)
                newMap.set(trimmed, 1.0)
                return newMap
              })
            }
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSpectrums(prev => prev.map(s => 
          s.id === spectrumId 
            ? { ...s, selectedSuggestionIndex: s.selectedSuggestionIndex < s.conceptSuggestions.length - 1 ? s.selectedSuggestionIndex + 1 : s.selectedSuggestionIndex }
            : s
        ))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSpectrums(prev => prev.map(s => 
          s.id === spectrumId 
            ? { ...s, selectedSuggestionIndex: s.selectedSuggestionIndex > 0 ? s.selectedSuggestionIndex - 1 : -1 }
            : s
        ))
      } else if (e.key === 'Escape') {
        setSpectrums(prev => prev.map(s => 
          s.id === spectrumId 
            ? { ...s, showSuggestions: false, conceptSuggestions: [], selectedSuggestionIndex: -1 }
            : s
        ))
      }
    } else if (e.key === 'Enter' && spectrum.inputValue.trim()) {
      e.preventDefault()
      const trimmed = spectrum.inputValue.trim()
      setSpectrums(prev => prev.map(s => 
        s.id === spectrumId 
          ? { 
              ...s, 
              concept: trimmed,
              inputValue: trimmed,
              showSuggestions: false,
              sliderPosition: 1.0,
              isInputVisible: false // Hide input after Enter
            }
          : s
      ))
      if (!selectedConcepts.includes(trimmed)) {
        setSelectedConcepts(prev => [...prev, trimmed])
        setCustomConcepts(prev => new Set(prev).add(trimmed))
        setSliderPositions(prev => {
          const newMap = new Map(prev)
          newMap.set(trimmed, 1.0)
          return newMap
        })
      }
    }
  }

  // Legacy addConcept function (kept for backward compatibility)
  const addConcept = (concept: string, isCustom: boolean = false) => {
    const cleaned = concept.trim()
    if (!cleaned || selectedConcepts.includes(cleaned)) return
    setSelectedConcepts(prev => [...prev, cleaned])
    if (isCustom) {
      setCustomConcepts(prev => new Set(prev).add(cleaned))
    }
  }

  // Main search keydown handler - same logic as before but no concept suggestions
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearchSubmit()
    } else if (e.key === ',' && searchQuery.trim()) {
      e.preventDefault()
      handleSearchSubmit()
      setSearchQuery('') // Clear after comma
    }
  }

  const removeConcept = (concept: string) => {
    setSelectedConcepts(prev => prev.filter(c => c !== concept))
    setCustomConcepts(prev => {
      const next = new Set(prev)
      next.delete(concept)
      return next
    })
    // Reset slider position and related state for this concept
    setSliderPositions(prev => {
      const newMap = new Map(prev)
      newMap.delete(concept)
      return newMap
    })
    setConceptResults(prev => {
      const newMap = new Map(prev)
      newMap.delete(concept)
      return newMap
    })
    setOppositeResults(prev => {
      const newMap = new Map(prev)
      newMap.delete(concept)
      return newMap
    })
    setLastSliderSide(prev => {
      const newMap = new Map(prev)
      newMap.delete(concept)
      return newMap
    })
  }

  const clearAllConcepts = () => {
    setSelectedConcepts([])
    setCustomConcepts(new Set())
    // Reset all slider positions and related state
    setSliderPositions(new Map())
    setConceptResults(new Map())
    setOppositeResults(new Map())
    setLastSliderSide(new Map())
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
    <div className="h-screen bg-[#fbf9f4] flex overflow-hidden relative">
      {/* Mobile: Floating chevron button when collapsed */}
      {isMobile && isDrawerCollapsed && (
        <button
          onClick={() => setIsDrawerCollapsed(false)}
          className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-300 rounded-md text-gray-600 hover:text-gray-900 hover:bg-[#f5f3ed] transition-colors md:hidden cursor-pointer"
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

      {/* Left Drawer - Dynamic, max width 280px - Fixed position on desktop, overlay on mobile */}
      <div className={`bg-[#fbf9f4] border-r border-gray-300 transition-all duration-300 ease-in-out ${
        isMobile 
          ? (isDrawerCollapsed ? 'hidden' : 'fixed left-0 top-0 z-[60] w-[280px] h-full shadow-lg') 
          : (isDrawerOpen ? (isDrawerCollapsed ? 'w-20' : 'w-[280px]') : 'w-0')
      } overflow-hidden flex flex-col h-full`}>
        {/* Logo and collapse button at top of drawer - sticky */}
        <div className="sticky top-0 z-50 bg-[#fbf9f4] p-4 md:p-6 border-b border-gray-300 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img src="/Logo.svg" alt="Logo" className="h-6 w-auto" />
          </Link>
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
              if (isPublicPage) {
                // Check if already have 2 active filters
                if (spectrums.length >= 2) {
                  setShowLoginModal(true)
                  return
                }
                // Check if already created 3 filters today
                const dailyCount = getDailyFilterCount()
                if (dailyCount >= 3) {
                  setShowLoginModal(true)
                  return
                }
              }
              setShowAddConceptModal(true)
              setAddConceptInputValue('')
            }}
            className="w-full mb-4 px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-[#f5f3ed] transition-colors text-sm font-medium cursor-pointer"
          >
            + Vibe filter
          </button>
          
          {/* Spectrum list */}
          <div className="space-y-10">
            {spectrums.map((spectrum) => {
              const conceptInfo = conceptData.get(spectrum.concept.toLowerCase())
              const opposites = conceptInfo?.opposites || []
              const firstOpposite = opposites.length > 0 ? opposites[0] : null
              // Check if slider is loading (concept exists but data not yet fetched, or results are loading)
              const isSliderLoading = spectrum.concept && (
                (!customConcepts.has(spectrum.concept) && !conceptInfo) || // Concept without data yet
                loading // Or overall loading state
              )
              
              return (
                <div key={spectrum.id} className="relative space-y-2 bg-[#f5f3ed] rounded-lg p-4 pb-6">
                  {/* Spectrum input field with concept suggestions - only show if isInputVisible */}
                  {spectrum.isInputVisible && (
                    <div className="relative">
                      <input
                        type="text"
                        value={spectrum.inputValue}
                        onChange={(e) => handleSpectrumInputChange(spectrum.id, e.target.value)}
                        onKeyDown={(e) => handleSpectrumKeyDown(spectrum.id, e)}
                        onFocus={() => {
                          setSpectrums(prev => prev.map(s => 
                            s.id === spectrum.id 
                              ? { ...s, showSuggestions: s.inputValue.length > 0 || s.conceptSuggestions.length > 0 }
                              : s
                          ))
                        }}
                        onBlur={() => {
                          setTimeout(() => {
                            setSpectrums(prev => prev.map(s => 
                              s.id === spectrum.id 
                                ? { ...s, showSuggestions: false }
                                : s
                            ))
                          }, 200)
                        }}
                        placeholder="e.g., Love, Minimalistic, Tech..."
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-900 placeholder-gray-500"
                        autoFocus
                      />
                      
                      {/* Concept suggestions dropdown */}
                      {spectrum.showSuggestions && spectrum.conceptSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                          {spectrum.conceptSuggestions.map((suggestion, index) => (
                            <button
                              key={`${spectrum.id}-${suggestion.id}-${index}`}
                              onClick={() => handleSpectrumConceptSelect(spectrum.id, suggestion)}
                              className={`w-full px-3 py-2 text-left text-sm transition-colors cursor-pointer ${
                                spectrum.selectedSuggestionIndex === index
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700 hover:bg-[#f5f3ed]'
                              }`}
                            >
                              {suggestion.displayText || suggestion.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Spectrum slider - show different layouts for concept vs custom query */}
                  {spectrum.concept && (
                    <div className="space-y-1">
                      {/* Skeleton loader while slider is loading */}
                      {isSliderLoading ? (
                        <div className="space-y-2">
                          {/* Skeleton for labels - match the actual filter layout */}
                          {customConcepts.has(spectrum.concept) ? (
                            // Single-pole skeleton (centered label)
                            <div className="flex items-center justify-center px-1 mb-6 pt-2">
                              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </div>
                          ) : (
                            // Two-pole skeleton (labels on opposite ends)
                            <div className="flex items-center justify-between px-1 mb-6 pt-2">
                              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                            </div>
                          )}
                          {/* Skeleton for slider */}
                          <div className="flex items-center justify-center">
                            <div className="w-full h-1 bg-gray-200 rounded-full relative">
                              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                      {/* Check if this is a custom concept (single-pole slider) */}
                      {customConcepts.has(spectrum.concept) ? (
                        // Single-pole slider for custom queries
                        <>
                          {/* Label on top, centered */}
                          <div className="flex items-center justify-center px-1 mb-6 pt-2">
                            <span className="text-sm font-medium text-gray-700 truncate">{capitalizeFirst(spectrum.concept)}</span>
                          </div>
                          {/* Single-pole slider (only right half) */}
                          <div className="flex items-center justify-center">
                            <div 
                              className="flex-shrink-0 w-full h-1 bg-gray-300 rounded-full relative cursor-pointer touch-none"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const sliderTrack = e.currentTarget
                                const handleSliderStart = (clientX: number) => {
                                  const initialTrackRect = sliderTrack.getBoundingClientRect()
                                  const initialPosition = spectrum.sliderPosition
                                  
                                  let lastUpdateTime = 0
                                  const throttleDelay = 16
                                  let lastPosition = initialPosition
                                  
                                  const updatePosition = (currentX: number) => {
                                    const now = Date.now()
                                    if (now - lastUpdateTime < throttleDelay) return
                                    lastUpdateTime = now
                                    
                                    const deltaX = currentX - initialTrackRect.left
                                    // For single-pole, map 0-1 to 0.5-1.0 (right half only)
                                    const rawPosition = Math.max(0, Math.min(1, deltaX / initialTrackRect.width))
                                    const newPosition = 0.5 + (rawPosition * 0.5) // Map to 0.5-1.0 range
                                    
                                    if (Math.abs(lastPosition - newPosition) < 0.001) return
                                    
                                    lastPosition = newPosition
                                    
                                    setSpectrums(prev => prev.map(s => 
                                      s.id === spectrum.id 
                                        ? { ...s, sliderPosition: newPosition }
                                        : s
                                    ))
                                    
                                    setSliderPositions(prev => {
                                      const newMap = new Map(prev)
                                      newMap.set(spectrum.concept, newPosition)
                                      return newMap
                                    })
                                    
                                    requestAnimationFrame(() => {
                                      setSliderVersion(v => v + 1)
                                    })
                                  }
                                  
                                  const clickPosition = Math.max(0, Math.min(1, (clientX - initialTrackRect.left) / initialTrackRect.width))
                                  const mappedPosition = 0.5 + (clickPosition * 0.5)
                                  
                                  setSpectrums(prev => prev.map(s => 
                                    s.id === spectrum.id 
                                      ? { ...s, sliderPosition: mappedPosition }
                                      : s
                                  ))
                                  
                                  setSliderPositions(prev => {
                                    const newMap = new Map(prev)
                                    newMap.set(spectrum.concept, mappedPosition)
                                    return newMap
                                  })
                                  
                                  requestAnimationFrame(() => {
                                    setSliderVersion(v => v + 1)
                                  })
                                  
                                  const handleMouseMove = (moveEvent: MouseEvent) => {
                                    updatePosition(moveEvent.clientX)
                                  }
                                  
                                  const handleTouchMove = (moveEvent: TouchEvent) => {
                                    moveEvent.preventDefault()
                                    if (moveEvent.touches.length > 0) {
                                      updatePosition(moveEvent.touches[0].clientX)
                                    }
                                  }
                                  
                                  const handleEnd = () => {
                                    document.removeEventListener('mousemove', handleMouseMove)
                                    document.removeEventListener('mouseup', handleEnd)
                                    document.removeEventListener('touchmove', handleTouchMove)
                                    document.removeEventListener('touchend', handleEnd)
                                    document.removeEventListener('touchcancel', handleEnd)
                                  }
                                  
                                  document.addEventListener('mousemove', handleMouseMove)
                                  document.addEventListener('mouseup', handleEnd)
                                  document.addEventListener('touchmove', handleTouchMove, { passive: false })
                                  document.addEventListener('touchend', handleEnd)
                                  document.addEventListener('touchcancel', handleEnd)
                                }
                                
                                handleSliderStart(e.clientX)
                              }}
                              onTouchStart={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                const sliderTrack = e.currentTarget
                                if (e.touches.length > 0) {
                                  const handleSliderStart = (clientX: number) => {
                                    const initialTrackRect = sliderTrack.getBoundingClientRect()
                                    const initialPosition = spectrum.sliderPosition
                                    
                                    let lastUpdateTime = 0
                                    const throttleDelay = 16
                                    let lastPosition = initialPosition
                                    
                                    const updatePosition = (currentX: number) => {
                                      const now = Date.now()
                                      if (now - lastUpdateTime < throttleDelay) return
                                      lastUpdateTime = now
                                      
                                      const deltaX = currentX - initialTrackRect.left
                                      const rawPosition = Math.max(0, Math.min(1, deltaX / initialTrackRect.width))
                                      const newPosition = 0.5 + (rawPosition * 0.5)
                                      
                                      if (Math.abs(lastPosition - newPosition) < 0.001) return
                                      
                                      lastPosition = newPosition
                                      
                                      setSpectrums(prev => prev.map(s => 
                                        s.id === spectrum.id 
                                          ? { ...s, sliderPosition: newPosition }
                                          : s
                                      ))
                                      
                                      setSliderPositions(prev => {
                                        const newMap = new Map(prev)
                                        newMap.set(spectrum.concept, newPosition)
                                        return newMap
                                      })
                                      
                                      requestAnimationFrame(() => {
                                        setSliderVersion(v => v + 1)
                                      })
                                    }
                                    
                                    const clickPosition = Math.max(0, Math.min(1, (clientX - initialTrackRect.left) / initialTrackRect.width))
                                    const mappedPosition = 0.5 + (clickPosition * 0.5)
                                    
                                    setSpectrums(prev => prev.map(s => 
                                      s.id === spectrum.id 
                                        ? { ...s, sliderPosition: mappedPosition }
                                        : s
                                    ))
                                    
                                    setSliderPositions(prev => {
                                      const newMap = new Map(prev)
                                      newMap.set(spectrum.concept, mappedPosition)
                                      return newMap
                                    })
                                    
                                    requestAnimationFrame(() => {
                                      setSliderVersion(v => v + 1)
                                    })
                                    
                                    const handleMouseMove = (moveEvent: MouseEvent) => {
                                      updatePosition(moveEvent.clientX)
                                    }
                                    
                                    const handleTouchMove = (moveEvent: TouchEvent) => {
                                      moveEvent.preventDefault()
                                      if (moveEvent.touches.length > 0) {
                                        updatePosition(moveEvent.touches[0].clientX)
                                      }
                                    }
                                    
                                    const handleEnd = () => {
                                      document.removeEventListener('mousemove', handleMouseMove)
                                      document.removeEventListener('mouseup', handleEnd)
                                      document.removeEventListener('touchmove', handleTouchMove)
                                      document.removeEventListener('touchend', handleEnd)
                                      document.removeEventListener('touchcancel', handleEnd)
                                    }
                                    
                                    document.addEventListener('mousemove', handleMouseMove)
                                    document.addEventListener('mouseup', handleEnd)
                                    document.addEventListener('touchmove', handleTouchMove, { passive: false })
                                    document.addEventListener('touchend', handleEnd)
                                    document.addEventListener('touchcancel', handleEnd)
                                  }
                                  
                                  handleSliderStart(e.touches[0].clientX)
                                }
                              }}
                            >
                              <div 
                                className="absolute flex items-center justify-center pointer-events-none"
                                style={{ 
                                  left: `calc(${Math.max(0, Math.min(100, ((spectrum.sliderPosition - 0.5) / 0.5) * 100))}% - 12px)`, 
                                  top: '50%',
                                  marginTop: '-12px',
                                  width: '24px',
                                  height: '24px'
                                }}
                              >
                                <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-sm pointer-events-auto cursor-grab active:cursor-grabbing flex-shrink-0"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : firstOpposite ? (
                        // Two-pole slider for concepts with opposites
                        <>
                          {/* Labels on top, opposite ends */}
                          <div className="flex items-center justify-between px-1 mb-6 pt-2">
                            <span className="text-sm font-medium text-gray-700 truncate flex-1 text-left pr-2">{capitalizeFirst(firstOpposite)}</span>
                            <span className="text-sm font-medium text-gray-700 truncate flex-1 text-right pl-2">{capitalizeFirst(spectrum.concept)}</span>
                          </div>
                          {/* Slider */}
                          <div className="flex items-center justify-center">
                        <div 
                          className="flex-shrink-0 w-full h-1 bg-gray-300 rounded-full relative cursor-pointer touch-none"
                          onMouseDown={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const sliderTrack = e.currentTarget
                            const handleSliderStart = (clientX: number) => {
                              const initialTrackRect = sliderTrack.getBoundingClientRect()
                              const initialPosition = spectrum.sliderPosition
                              
                              let lastUpdateTime = 0
                              const throttleDelay = 16
                              let lastPosition = initialPosition
                              
                              const updatePosition = (currentX: number) => {
                                const now = Date.now()
                                if (now - lastUpdateTime < throttleDelay) return
                                lastUpdateTime = now
                                
                                const deltaX = currentX - initialTrackRect.left
                                const newPosition = Math.max(0, Math.min(1, deltaX / initialTrackRect.width))
                                
                                if (Math.abs(lastPosition - newPosition) < 0.001) return
                                
                                lastPosition = newPosition
                                
                                setSpectrums(prev => prev.map(s => 
                                  s.id === spectrum.id 
                                    ? { ...s, sliderPosition: newPosition }
                                    : s
                                ))
                                
                                // Update sliderPositions for backward compatibility
                                setSliderPositions(prev => {
                                  const newMap = new Map(prev)
                                  newMap.set(spectrum.concept, newPosition)
                                  return newMap
                                })
                                
                                requestAnimationFrame(() => {
                                  setSliderVersion(v => v + 1)
                                })
                              }
                              
                              const clickPosition = Math.max(0, Math.min(1, (clientX - initialTrackRect.left) / initialTrackRect.width))
                              
                              setSpectrums(prev => prev.map(s => 
                                s.id === spectrum.id 
                                  ? { ...s, sliderPosition: clickPosition }
                                  : s
                              ))
                              
                              setSliderPositions(prev => {
                                const newMap = new Map(prev)
                                newMap.set(spectrum.concept, clickPosition)
                                return newMap
                              })
                              
                              requestAnimationFrame(() => {
                                setSliderVersion(v => v + 1)
                              })
                              
                              const handleMouseMove = (moveEvent: MouseEvent) => {
                                updatePosition(moveEvent.clientX)
                              }
                              
                              const handleTouchMove = (moveEvent: TouchEvent) => {
                                moveEvent.preventDefault()
                                if (moveEvent.touches.length > 0) {
                                  updatePosition(moveEvent.touches[0].clientX)
                                }
                              }
                              
                              const handleEnd = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleEnd)
                                document.removeEventListener('touchmove', handleTouchMove)
                                document.removeEventListener('touchend', handleEnd)
                                document.removeEventListener('touchcancel', handleEnd)
                              }
                              
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleEnd)
                              document.addEventListener('touchmove', handleTouchMove, { passive: false })
                              document.addEventListener('touchend', handleEnd)
                              document.addEventListener('touchcancel', handleEnd)
                            }
                            
                            handleSliderStart(e.clientX)
                          }}
                          onTouchStart={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const sliderTrack = e.currentTarget
                            if (e.touches.length > 0) {
                              const handleSliderStart = (clientX: number) => {
                                const initialTrackRect = sliderTrack.getBoundingClientRect()
                                const initialPosition = spectrum.sliderPosition
                                
                                let lastUpdateTime = 0
                                const throttleDelay = 16
                                let lastPosition = initialPosition
                                
                                const updatePosition = (currentX: number) => {
                                  const now = Date.now()
                                  if (now - lastUpdateTime < throttleDelay) return
                                  lastUpdateTime = now
                                  
                                  const deltaX = currentX - initialTrackRect.left
                                  const newPosition = Math.max(0, Math.min(1, deltaX / initialTrackRect.width))
                                  
                                  if (Math.abs(lastPosition - newPosition) < 0.001) return
                                  
                                  lastPosition = newPosition
                                  
                                  setSpectrums(prev => prev.map(s => 
                                    s.id === spectrum.id 
                                      ? { ...s, sliderPosition: newPosition }
                                      : s
                                  ))
                                  
                                  setSliderPositions(prev => {
                                    const newMap = new Map(prev)
                                    newMap.set(spectrum.concept, newPosition)
                                    return newMap
                                  })
                                  
                                  requestAnimationFrame(() => {
                                    setSliderVersion(v => v + 1)
                                  })
                                }
                                
                                const clickPosition = Math.max(0, Math.min(1, (clientX - initialTrackRect.left) / initialTrackRect.width))
                                
                                setSpectrums(prev => prev.map(s => 
                                  s.id === spectrum.id 
                                    ? { ...s, sliderPosition: clickPosition }
                                    : s
                                ))
                                
                                setSliderPositions(prev => {
                                  const newMap = new Map(prev)
                                  newMap.set(spectrum.concept, clickPosition)
                                  return newMap
                                })
                                
                                requestAnimationFrame(() => {
                                  setSliderVersion(v => v + 1)
                                })
                                
                                const handleMouseMove = (moveEvent: MouseEvent) => {
                                  updatePosition(moveEvent.clientX)
                                }
                                
                                const handleTouchMove = (moveEvent: TouchEvent) => {
                                  moveEvent.preventDefault()
                                  if (moveEvent.touches.length > 0) {
                                    updatePosition(moveEvent.touches[0].clientX)
                                  }
                                }
                                
                                const handleEnd = () => {
                                  document.removeEventListener('mousemove', handleMouseMove)
                                  document.removeEventListener('mouseup', handleEnd)
                                  document.removeEventListener('touchmove', handleTouchMove)
                                  document.removeEventListener('touchend', handleEnd)
                                  document.removeEventListener('touchcancel', handleEnd)
                                }
                                
                                document.addEventListener('mousemove', handleMouseMove)
                                document.addEventListener('mouseup', handleEnd)
                                document.addEventListener('touchmove', handleTouchMove, { passive: false })
                                document.addEventListener('touchend', handleEnd)
                                document.addEventListener('touchcancel', handleEnd)
                              }
                              
                              handleSliderStart(e.touches[0].clientX)
                            }
                          }}
                        >
                          <div 
                            className="absolute flex items-center justify-center pointer-events-none"
                            style={{ 
                              left: `calc(${Math.max(0, Math.min(100, spectrum.sliderPosition * 100))}% - 12px)`, 
                              top: '50%',
                              marginTop: '-12px',
                              width: '24px',
                              height: '24px'
                            }}
                          >
                            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-sm pointer-events-auto cursor-grab active:cursor-grabbing flex-shrink-0"></div>
                          </div>
                        </div>
                      </div>
                        </>
                      ) : null}
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* Remove spectrum button */}
                  {spectrum.concept && (
                    <button
                      onClick={() => removeSpectrum(spectrum.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-[#ddd5c8] rounded transition-colors cursor-pointer"
                      aria-label="Remove filter"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.2929 5.29289C17.6834 4.90237 18.3164 4.90237 18.707 5.29289C19.0975 5.68342 19.0975 6.31643 18.707 6.70696L13.414 11.9999L18.707 17.2929C19.0975 17.6834 19.0975 18.3164 18.707 18.707C18.3164 19.0975 17.6834 19.0975 17.2929 18.707L11.9999 13.414L6.70696 18.707C6.31643 19.0975 5.68342 19.0975 5.29289 18.707C4.90237 18.3164 4.90237 17.6834 5.29289 17.2929L10.5859 11.9999L5.29289 6.70696C4.90237 6.31643 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31643 4.90237 6.70696 5.29289L11.9999 10.5859L17.2929 5.29289Z" fill="currentColor" className="text-gray-600"/>
                      </svg>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Content Area - Fixed height, flex column - Full width on mobile when drawer collapsed */}
      <div className={`flex-1 transition-all duration-300 ease-in-out min-w-0 flex flex-col overflow-hidden h-full ${
        isMobile && isDrawerCollapsed ? 'w-full' : ''
      }`}>
        {/* Scrollable Gallery Content */}
        <div className="flex-1 overflow-y-auto min-w-0">
          {/* Header with search bar - Sticky at top */}
          <div className="sticky top-0 bg-[#fbf9f4] z-50">
            <Header 
              onSubmitClick={() => setShowSubmissionForm(true)}
              onLoginClick={() => router.push('/login')}
              searchQuery={searchQuery}
              onSearchInputChange={handleSearchInputChange}
              onSearchKeyDown={handleSearchKeyDown}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={clearSearchQuery}
              searchInputRef={inputRef}
            />
        </div>
        
        {/* Main Content and Panel Container */}
        <div className="flex">
          {/* Main Content - shifts when panel opens */}
          <div className="flex-1 transition-all duration-300 ease-in-out min-w-0">

            {/* Gallery Grid */}
            <main className="bg-transparent pb-8">
            <div className="max-w-full mx-auto px-4 md:px-[52px] pt-3 pb-8">
              {/* Tabs - Above gallery images */}
              <div className="mb-4 pb-3">
                <Navigation activeCategory={category} onCategoryChange={handleCategoryChange} />
              </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i}>
                {/* Image skeleton - matches aspect-[4/3] with shimmer effect */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#e8e8e4]">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-br from-transparent via-transparent via-white/60 to-transparent" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%, transparent 100%)' }}></div>
                </div>
                {/* Text section skeleton - matches py-2 structure */}
                <div className="py-2">
                  <div className="flex items-center justify-between gap-2">
                    {/* Title skeleton - flex-1, text-xs size */}
                    <div className="relative h-3 bg-[#e8e8e4] rounded flex-1 overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer bg-gradient-to-br from-transparent via-transparent via-white/60 to-transparent" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%, transparent 100%)' }}></div>
                    </div>
                    {/* Category badge skeleton - matches badge size */}
                    <div className="relative h-5 w-16 bg-[#e8e8e4] rounded overflow-hidden">
                      <div className="absolute inset-0 animate-shimmer bg-gradient-to-br from-transparent via-transparent via-white/60 to-transparent" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%, transparent 100%)' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sites.length > 0 ? (
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
                                // Silently hide failed images
                                e.currentTarget.style.display = 'none';
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
                            {/* External link button - far left */}
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                window.open(site.url, '_blank', 'noopener,noreferrer')
                              }}
                              className="p-2 hover:bg-black/20 rounded-md transition-opacity cursor-pointer"
                              aria-label="Open link"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.7704 17.6484C21.7704 18.2006 21.3225 18.6482 20.7704 18.6484C20.2181 18.6485 19.7705 18.2007 19.7704 17.6484L19.7695 6.41309L5.47649 20.707C5.08596 21.0976 4.45295 21.0976 4.06242 20.707C3.6719 20.3165 3.6719 19.6835 4.06242 19.293L18.3554 5H7.12199C6.56971 5 6.12199 4.55228 6.12199 4C6.12199 3.44772 6.56971 3 7.12199 3H20.7695C21.3217 3 21.7694 3.44773 21.7695 4L21.7704 17.6484Z" fill="white"/>
                              </svg>
                            </button>
                            {/* Copy and Bookmark buttons container - right side */}
                            <div className="flex">
                              {/* Copy button */}
                              <button
                                onClick={async (e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  
                                  if (!site.imageUrl) return
                                  
                                  try {
                                    // Fetch the image as a blob
                                    const response = await fetch(site.imageUrl)
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
                                        if (site.imageUrl) {
                                          img.src = site.imageUrl
                                        } else {
                                          reject(new Error('No image URL'))
                                        }
                                      })
                                    }
                                    
                                    // Create a ClipboardItem with the image blob (use PNG or original type)
                                    const clipboardItem = new ClipboardItem({
                                      'image/png': imageBlob
                                    })
                                    
                                    // Copy to clipboard
                                    await navigator.clipboard.write([clipboardItem])
                                    
                                    // Show success message
                                    setCopiedImageId(site.id || `${site.imageId}-${index}`)
                                    setTimeout(() => {
                                      setCopiedImageId(null)
                                    }, 2000)
                                  } catch (error) {
                                    console.error('Failed to copy image:', error)
                                    // Fallback: copy the image URL as text
                                    navigator.clipboard.writeText(site.imageUrl || site.url || '')
                                    
                                    // Show success message even for fallback
                                    setCopiedImageId(site.id || `${site.imageId}-${index}`)
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
                                  router.push('/login')
                                }}
                                onMouseEnter={() => {
                                  setHoveredLikeButtonId(site.id || `${site.imageId}-${index}`)
                                }}
                                onMouseLeave={() => {
                                  setHoveredLikeButtonId(null)
                                }}
                                className="p-2 hover:bg-black/20 rounded-md transition-opacity cursor-pointer"
                                aria-label="Save to collection"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18 5C18 4.73478 17.8946 4.48051 17.707 4.29297C17.5195 4.10543 17.2652 4 17 4H7C6.73478 4 6.48051 4.10543 6.29297 4.29297C6.10543 4.48051 6 4.73478 6 5V19.0566L11.4189 15.1865L11.5547 15.1045C11.8817 14.9418 12.277 14.9693 12.5811 15.1865L18 19.0566V5ZM20 21C20 21.3745 19.791 21.7182 19.458 21.8896C19.1249 22.0611 18.7238 22.0312 18.4189 21.8135L12 17.2285L5.58105 21.8135C5.27624 22.0312 4.87506 22.0611 4.54199 21.8896C4.209 21.7182 4 21.3745 4 21V5C4 4.20435 4.3163 3.44152 4.87891 2.87891C5.44152 2.3163 6.20435 2 7 2H17C17.7956 2 18.5585 2.3163 19.1211 2.87891C19.6837 3.44152 20 4.20435 20 5V21Z" fill="white"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/* Copy success message */}
                          {copiedImageId === (site.id || `${site.imageId}-${index}`) && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                              <div className="bg-black/60 text-white px-4 py-2 rounded-md text-sm font-medium">
                                Copied to clipboard
                              </div>
                            </div>
                          )}
                          {/* Like button hover message */}
                          {hoveredLikeButtonId === (site.id || `${site.imageId}-${index}`) && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                              <div className="bg-black/60 text-white px-4 py-2 rounded-md text-sm font-medium">
                                Login to save to collection
                              </div>
                            </div>
                          )}
                         </div>
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
            {/* Skeleton loaders while loading more */}
            {isLoadingMore && (
              <>
                {[...Array(9)].map((_, i) => (
                  <div key={`skeleton-${i}`}>
                    {/* Image skeleton - matches aspect-[4/3] with shimmer effect */}
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#e8e8e4]">
                      <div className="absolute inset-0 animate-shimmer bg-gradient-to-br from-transparent via-transparent via-white/60 to-transparent" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%, transparent 100%)' }}></div>
                    </div>
                    {/* Text section skeleton - matches py-2 structure */}
                    <div className="py-2">
                      <div className="flex items-center justify-between gap-2">
                        {/* Title skeleton - flex-1, text-xs size */}
                        <div className="relative h-3 bg-[#e8e8e4] rounded flex-1 overflow-hidden">
                          <div className="absolute inset-0 animate-shimmer bg-gradient-to-br from-transparent via-transparent via-white/60 to-transparent" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%, transparent 100%)' }}></div>
                        </div>
                        {/* Category badge skeleton - matches badge size */}
                        <div className="relative h-5 w-16 bg-[#e8e8e4] rounded overflow-hidden">
                          <div className="absolute inset-0 animate-shimmer bg-gradient-to-br from-transparent via-transparent via-white/60 to-transparent" style={{ background: 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%, transparent 100%)' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            {/* Lazy loading trigger - load more when this becomes visible */}
            {hasMoreResults ? (
              <div 
                ref={loadMoreRef} 
                className="col-span-full flex justify-center py-8"
                data-testid="load-more-trigger"
              >
                <div className="text-gray-400 text-sm">
                  Scroll for more
                </div>
              </div>
            ) : (
              <div className="col-span-full flex justify-center py-8">
                <div className="text-gray-400 text-sm">
                  No more results
                </div>
              </div>
            )}
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
          onLoginClick={() => {
            setShowSubmissionForm(false)
            router.push('/login')
          }}
          onCreateAccountClick={() => {
            setShowSubmissionForm(false)
            setShowCreateAccountMessage(true)
          }}
        />
      )}

      {/* Create Account Message Modal */}
      {showCreateAccountMessage && (
        <CreateAccountMessageModal
          onClose={() => setShowCreateAccountMessage(false)}
        />
      )}

      {/* Login Required Modal */}
      {showLoginModal && (
        <LoginRequiredModal
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* Add vibes Modal */}
      {showAddConceptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="relative mb-6">
                <button
                  onClick={() => {
                    setShowAddConceptModal(false)
                    setAddConceptInputValue('')
                  }}
                  className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 cursor-pointer"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Vibe filter</h2>
              </div>
            
            <div className="space-y-4">
              {/* First input - Vibe */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vibe
                </label>
                <input
                  ref={(el) => setAddConceptInputRef(el)}
                  type="text"
                  value={addConceptInputValue}
                  onChange={(e) => {
                    setAddConceptInputValue(e.target.value)
                    // Clear error when user starts typing
                    if (vibeFieldError) {
                      setVibeFieldError(undefined)
                    }
                  }}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                      handleCreateSpectrum()
                    }
                  }}
                  placeholder="e.g., Romantic, Minimalistic, Techy..."
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
                    vibeFieldError 
                      ? 'border-red-300 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-gray-400'
                  }`}
                />
                {vibeFieldError && (
                  <p className="mt-1 text-sm text-red-600">{vibeFieldError}</p>
                )}
              </div>
              
              {/* Create Spectrum button */}
              <button
                onClick={handleCreateSpectrum}
                className="w-full px-4 py-2 bg-gray-900 hover:bg-gray-700 cursor-pointer text-white rounded-md transition-colors text-sm font-medium"
              >
                Create filter
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

        {/* Side Panel - slides in from right and pushes content */}
        <div
          className={`sticky top-0 h-screen bg-[#fbf9f4] transition-all duration-300 ease-in-out overflow-hidden ${
            isPanelOpen ? 'w-80' : 'w-0'
          }`}
        >
          <div className={`p-6 pr-[52px] ${isPanelOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Concept Spectrum</h2>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
                  (() => {
                const sliderPosition = sliderPositions.get(concept) ?? 1.0 // Default to 1.0 (right)
                // Clamp position to 0-1
                const clampedPosition = Math.max(0, Math.min(1, sliderPosition))
                // Convert to percentage for CSS, accounting for handle width
                // Handle is 24px (w-6), track is 128px (w-32), so handle can move from 12px to 116px
                // This maps to 0% to 100% of the usable track area
                const handlePositionPercent = clampedPosition * 100
                    
                    // Shared function to handle both mouse and touch events
                    const handleSliderStart = (clientX: number, sliderTrack: HTMLElement) => {
                      // Store the initial track rect and position
                      const initialTrackRect = sliderTrack.getBoundingClientRect()
                      const initialPosition = sliderPositions.get(concept) ?? 1.0
                      
                      let lastUpdateTime = 0
                      const throttleDelay = 16 // ~60fps
                      let lastPosition = initialPosition
                      
                      const updatePosition = (currentX: number) => {
                        const now = Date.now()
                        if (now - lastUpdateTime < throttleDelay) return
                        lastUpdateTime = now
                        
                        // Calculate delta from initial position
                        const deltaX = currentX - initialTrackRect.left
                        // Map to position (0-1)
                        const newPosition = Math.max(0, Math.min(1, deltaX / initialTrackRect.width))
                        
                        // Only update if position changed significantly
                        if (Math.abs(lastPosition - newPosition) < 0.001) {
                          return // No change, skip update
                        }
                        
                        lastPosition = newPosition
                        
                        // Update position
                        setSliderPositions(prev => {
                          const newMap = new Map(prev)
                          newMap.set(concept, newPosition)
                          return newMap
                        })
                        
                        // Increment version AFTER state update
                        requestAnimationFrame(() => {
                          setSliderVersion(v => v + 1)
                        })
                      }
                      
                      // Initial click/touch: calculate position from location
                      const clickPosition = Math.max(0, Math.min(1, (clientX - initialTrackRect.left) / initialTrackRect.width))
                      
                      setSliderPositions(prev => {
                        const currentPos = prev.get(concept) ?? 1.0
                        if (Math.abs(currentPos - clickPosition) < 0.001) {
                          return prev // No change
                        }
                        const newMap = new Map(prev)
                        newMap.set(concept, clickPosition)
                        requestAnimationFrame(() => {
                          setSliderVersion(v => v + 1)
                        })
                        return newMap
                      })
                      
                      // Mouse move handler
                      const handleMouseMove = (moveEvent: MouseEvent) => {
                        updatePosition(moveEvent.clientX)
                      }
                      
                      // Touch move handler
                      const handleTouchMove = (moveEvent: TouchEvent) => {
                        moveEvent.preventDefault() // Prevent scrolling
                        if (moveEvent.touches.length > 0) {
                          updatePosition(moveEvent.touches[0].clientX)
                        }
                      }
                      
                      // Cleanup handlers
                      const handleEnd = () => {
                        document.removeEventListener('mousemove', handleMouseMove)
                        document.removeEventListener('mouseup', handleEnd)
                        document.removeEventListener('touchmove', handleTouchMove)
                        document.removeEventListener('touchend', handleEnd)
                        document.removeEventListener('touchcancel', handleEnd)
                      }
                      
                      // Add event listeners
                      document.addEventListener('mousemove', handleMouseMove)
                      document.addEventListener('mouseup', handleEnd)
                      document.addEventListener('touchmove', handleTouchMove, { passive: false })
                      document.addEventListener('touchend', handleEnd)
                      document.addEventListener('touchcancel', handleEnd)
                    }
                    
                    const handleSliderMouseDown = (e: React.MouseEvent) => {
                      e.preventDefault()
                      e.stopPropagation()
                      
                      // Find the actual slider track element
                      let sliderTrack = e.currentTarget as HTMLElement
                      if (!sliderTrack.classList.contains('bg-gray-300')) {
                        sliderTrack = sliderTrack.closest('.bg-gray-300') as HTMLElement
                      }
                      
                      if (!sliderTrack) {
                        console.error('[Slider] Could not find slider track element')
                        return
                      }
                      
                      handleSliderStart(e.clientX, sliderTrack)
                    }
                    
                    const handleSliderTouchStart = (e: React.TouchEvent) => {
                      e.preventDefault()
                      e.stopPropagation()
                      
                      // Find the actual slider track element
                      let sliderTrack = e.currentTarget as HTMLElement
                      if (!sliderTrack.classList.contains('bg-gray-300')) {
                        sliderTrack = sliderTrack.closest('.bg-gray-300') as HTMLElement
                      }
                      
                      if (!sliderTrack) {
                        console.error('[Slider] Could not find slider track element')
                        return
                      }
                      
                      if (e.touches.length > 0) {
                        handleSliderStart(e.touches[0].clientX, sliderTrack)
                      }
                    }
                    
                    return (
                      <div key={concept} className="flex items-center">
                        {firstOpposite && (
                          <>
                            <div className="w-20 p-3 text-left overflow-hidden">
                              <span className="text-sm text-gray-900 truncate block">{firstOpposite}</span>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                              <div 
                                className="flex-shrink-0 w-32 h-1 bg-gray-300 rounded-full relative cursor-pointer touch-none"
                                onMouseDown={handleSliderMouseDown}
                                onTouchStart={handleSliderTouchStart}
                              >
                            <div 
                              className="absolute flex items-center justify-center pointer-events-none"
                              style={{ 
                                left: `calc(${Math.max(0, Math.min(100, handlePositionPercent))}% - 12px)`, 
                                top: '50%',
                                marginTop: '-12px',
                                width: '24px',
                                height: '24px'
                              }}
                            >
                              <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-sm pointer-events-auto cursor-grab active:cursor-grabbing flex-shrink-0"></div>
                            </div>
                              </div>
                            </div>
                          </>
                        )}
                        <div className="w-20 p-3 overflow-hidden flex justify-end">
                          <span className="text-sm text-gray-900 truncate block text-right">{concept}</span>
                        </div>
                      </div>
                    )
                  })()
                )
              })}
          </div>
          </div>
        </div>
        </div>
      {/* End of Main Content */}
      </div>
      {/* End of Main Content and Panel Container */}
      </div>
      {/* End of Scrollable Gallery Content */}
      </div>
    </div>
  )
}
