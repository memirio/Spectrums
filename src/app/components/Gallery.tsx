'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
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
}

export default function Gallery({ category }: GalleryProps = {} as GalleryProps) {
  const [sites, setSites] = useState<Site[]>([])
  const [allSites, setAllSites] = useState<Site[]>([]) // Store all sites for lazy loading
  const [displayedCount, setDisplayedCount] = useState(50) // Number of sites to display initially
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
  const [sliderPositions, setSliderPositions] = useState<Map<string, number>>(new Map()) // Map of concept -> slider position (0-1, where 1 is right/default)
  const [conceptResults, setConceptResults] = useState<Map<string, Site[]>>(new Map()) // Map of concept -> results for that concept
  const [oppositeResults, setOppositeResults] = useState<Map<string, Site[]>>(new Map()) // Map of concept -> results for its opposite
  const [lastSliderSide, setLastSliderSide] = useState<Map<string, 'left' | 'right'>>(new Map()) // Track which side of 50% we're on
  const [resultsVersion, setResultsVersion] = useState(0) // Version counter to trigger reordering when results change
  const [sliderVersion, setSliderVersion] = useState(0) // Version counter to trigger reordering when slider moves
  const [isDrawerOpen, setIsDrawerOpen] = useState(true) // Drawer open/closed state
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false) // Drawer collapsed state (80px vs 280px)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSites()
  }, [])

  // Lazy loading: Update displayed sites when allSites or displayedCount changes
  useEffect(() => {
    setSites(allSites.slice(0, displayedCount))
  }, [allSites, displayedCount])

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCount < allSites.length) {
          // Load 50 more sites when user scrolls to bottom
          setDisplayedCount((prev) => Math.min(prev + 50, allSites.length))
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [displayedCount, allSites.length])

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
  }, [selectedConcepts, customConcepts]) // Fetch when concepts change, not just when panel opens

  // Fetch sites when concepts or category change (but not when slider moves)
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
    console.log(`[STOP DEBUG] useEffect triggered - sliderVersion: ${sliderVersion}`)
    
    if (selectedConcepts.length === 0) {
      console.log(`[STOP DEBUG] No concepts selected, returning`)
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
      
      console.log(`[STOP DEBUG] Concept: ${concept}, sliderPos: ${sliderPos.toFixed(3)} (${(sliderPos * 100).toFixed(1)}%)`)
      console.log(`[STOP DEBUG] conceptResultSet.length: ${conceptResultSet.length}, oppositeResultSet.length: ${oppositeResultSet.length}`)
      
      if (conceptResultSet.length === 0 && oppositeResultSet.length === 0) {
        console.log(`[STOP DEBUG] No results available, returning`)
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
      
      console.log(`[STOP DEBUG] Calculated stopNumber: ${stopNumber} from sliderPos: ${sliderPos.toFixed(3)} (${(sliderPos * 100).toFixed(1)}%)`)
      if (clampedPos === 1.0) {
        console.log(`[STOP DEBUG] Edge case: position is exactly 1.0, using stop 10`)
      } else {
        console.log(`[STOP DEBUG] Calculation: Math.floor(${clampedPos.toFixed(3)} * 10) + 1 = ${Math.floor(clampedPos * 10)} + 1 = ${stopNumber}`)
      }
      
      if (sliderPos > 0.5) {
        console.log(`[STOP DEBUG] RIGHT SIDE (sliderPos ${sliderPos.toFixed(3)} > 0.5) - Using concept results`)
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
        
        console.log(`[TIER DEBUG] Concept tiers - t1: ${t1.length}, t2: ${t2.length}, t3: ${t3.length}, t4: ${t4.length}, t5: ${t5.length}, t6: ${t6.length}, t7: ${t7.length}, t8: ${t8.length}, t9: ${t9.length}, t10: ${t10.length}`)
        console.log(`[TIER DEBUG] First 3 tier1 IDs: ${t1.slice(0, 3).map(s => s.id.substring(0, 8)).join(', ')}`)
        console.log(`[TIER DEBUG] First 3 tier2 IDs: ${t2.slice(0, 3).map(s => s.id.substring(0, 8)).join(', ')}`)
        console.log(`[TIER DEBUG] First 3 tier5 IDs: ${t5.slice(0, 3).map(s => s.id.substring(0, 8)).join(', ')}`)
        
        // Right side: Stops 6-10 (51-100%) - each stop prioritizes a different 10% tier for smooth transitions
        // Stop 10 (100%): Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (best matches first)
        // Stop 9 (90%): Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (next tier first)
        // Stop 8 (80%): Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2
        // Stop 7 (70%): Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3
        // Stop 6 (60%): Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4
        if (stopNumber === 10) {
          console.log(`[STOP DEBUG] STOP 10 EXECUTED - Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (best matches first)`)
          orderedResults = [...t1, ...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10]
        } else if (stopNumber === 9) {
          console.log(`[STOP DEBUG] STOP 9 EXECUTED - Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first)`)
          orderedResults = [...t2, ...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1]
          console.log(`[ORDER DEBUG] Stop 9 - First 5 IDs: ${orderedResults.slice(0, 5).map(s => s.id.substring(0, 8)).join(', ')}`)
        } else if (stopNumber === 8) {
          console.log(`[STOP DEBUG] STOP 8 EXECUTED - Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first)`)
          orderedResults = [...t3, ...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2]
        } else if (stopNumber === 7) {
          console.log(`[STOP DEBUG] STOP 7 EXECUTED - Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first)`)
          orderedResults = [...t4, ...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2, ...t3]
          console.log(`[ORDER DEBUG] Stop 7 - First 5 IDs: ${orderedResults.slice(0, 5).map(s => s.id.substring(0, 8)).join(', ')}`)
        } else {
          // Stop 6
          console.log(`[STOP DEBUG] STOP 6 EXECUTED - Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first)`)
          orderedResults = [...t5, ...t6, ...t7, ...t8, ...t9, ...t10, ...t1, ...t2, ...t3, ...t4]
        }
        console.log(`[STOP DEBUG] Right side orderedResults.length: ${orderedResults.length}`)
        console.log(`[STOP DEBUG] First 10 IDs: ${orderedResults.slice(0, 10).map(s => s.id.substring(0, 8)).join(', ')}`)
        console.log(`[STOP DEBUG] First 10 scores: ${orderedResults.slice(0, 10).map(s => (s.score ?? 0).toFixed(3)).join(', ')}`)
      } else {
        // sliderPos <= 0.5
        console.log(`[STOP DEBUG] LEFT SIDE (sliderPos ${sliderPos.toFixed(3)} <= 0.5) - Using opposite results`)
        // Slider towards opposite (left side) - Stops 1-5 (0-50%)
        if (oppositeResultSet.length === 0) {
          console.log(`[STOP DEBUG] Opposite results NOT loaded - using concept results with varied ordering`)
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
          
          console.log(`[TIER DEBUG] Concept tiers (no opposite) - t1: ${t1NoOpp.length}, t2: ${t2NoOpp.length}, t3: ${t3NoOpp.length}, t4: ${t4NoOpp.length}, t5: ${t5NoOpp.length}, t6: ${t6NoOpp.length}, t7: ${t7NoOpp.length}, t8: ${t8NoOpp.length}, t9: ${t9NoOpp.length}, t10: ${t10NoOpp.length}`)
          
          // Left side without opposite: use concept results with reverse tier ordering (tier 5 down to tier 1)
          // Same pattern as stops 6-10 but in reverse, using concept results as fallback
          // Stop 5 (50%): Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first)
          // Stop 4 (40%): Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first)
          // Stop 3 (30%): Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first)
          // Stop 2 (20%): Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first)
          // Stop 1 (0%): Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (tier 1 first - best matches)
          if (stopNumber === 1) {
            console.log(`[STOP DEBUG] STOP 1 EXECUTED (no opposite) - Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (tier 1 first - best matches)`)
            orderedResults = [...t1NoOpp, ...t2NoOpp, ...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp]
          } else if (stopNumber === 2) {
            console.log(`[STOP DEBUG] STOP 2 EXECUTED (no opposite) - Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first)`)
            orderedResults = [...t2NoOpp, ...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp]
            console.log(`[ORDER DEBUG] Stop 2 (no opp) - First 5 IDs: ${orderedResults.slice(0, 5).map(s => s.id.substring(0, 8)).join(', ')}`)
          } else if (stopNumber === 3) {
            console.log(`[STOP DEBUG] STOP 3 EXECUTED (no opposite) - Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first)`)
            orderedResults = [...t3NoOpp, ...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp]
          } else if (stopNumber === 4) {
            console.log(`[STOP DEBUG] STOP 4 EXECUTED (no opposite) - Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first)`)
            orderedResults = [...t4NoOpp, ...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp, ...t3NoOpp]
            console.log(`[ORDER DEBUG] Stop 4 (no opp) - First 5 IDs: ${orderedResults.slice(0, 5).map(s => s.id.substring(0, 8)).join(', ')}`)
          } else {
            // Stop 5
            console.log(`[STOP DEBUG] STOP 5 EXECUTED (no opposite) - Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first)`)
            orderedResults = [...t5NoOpp, ...t6NoOpp, ...t7NoOpp, ...t8NoOpp, ...t9NoOpp, ...t10NoOpp, ...t1NoOpp, ...t2NoOpp, ...t3NoOpp, ...t4NoOpp]
          }
          console.log(`[STOP DEBUG] Left side (no opposite) orderedResults.length: ${orderedResults.length}`)
          console.log(`[STOP DEBUG] First 10 IDs: ${orderedResults.slice(0, 10).map(s => s.id.substring(0, 8)).join(', ')}`)
          console.log(`[STOP DEBUG] First 10 scores: ${orderedResults.slice(0, 10).map(s => (s.score ?? 0).toFixed(3)).join(', ')}`)
        } else {
          console.log(`[STOP DEBUG] Opposite results loaded - using opposite results`)
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
          
          console.log(`[TIER DEBUG] Opposite tiers - t1: ${t1Opp.length}, t2: ${t2Opp.length}, t3: ${t3Opp.length}, t4: ${t4Opp.length}, t5: ${t5Opp.length}, t6: ${t6Opp.length}, t7: ${t7Opp.length}, t8: ${t8Opp.length}, t9: ${t9Opp.length}, t10: ${t10Opp.length}`)
          console.log(`[TIER DEBUG] First 3 tier1 opposite IDs: ${t1Opp.slice(0, 3).map(s => s.id.substring(0, 8)).join(', ')}`)
          console.log(`[TIER DEBUG] First 3 tier10 opposite IDs: ${t10Opp.slice(0, 3).map(s => s.id.substring(0, 8)).join(', ')}`)
          
          // Left side: Stops 1-5 (0-50%) - with opposite results using 10 tiers, in reverse order
          // Same logic as stops 6-10 but for opposite concept, going from tier 5 down to tier 1
          // Stop 5 (50%): Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first - opposite concept)
          // Stop 4 (40%): Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first - opposite concept)
          // Stop 3 (30%): Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first - opposite concept)
          // Stop 2 (20%): Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first - opposite concept)
          // Stop 1 (0%): Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (tier 1 first - opposite concept, best opposite matches)
          if (stopNumber === 1) {
            console.log(`[STOP DEBUG] STOP 1 EXECUTED (with opposite) - Tier 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 (tier 1 first - best opposite matches)`)
            orderedResults = [...t1Opp, ...t2Opp, ...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp]
          } else if (stopNumber === 2) {
            console.log(`[STOP DEBUG] STOP 2 EXECUTED (with opposite) - Tier 2, 3, 4, 5, 6, 7, 8, 9, 10, 1 (tier 2 first - opposite concept)`)
            orderedResults = [...t2Opp, ...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp]
            console.log(`[ORDER DEBUG] Stop 2 (with opp) - First 5 IDs: ${orderedResults.slice(0, 5).map(s => s.id.substring(0, 8)).join(', ')}`)
          } else if (stopNumber === 3) {
            console.log(`[STOP DEBUG] STOP 3 EXECUTED (with opposite) - Tier 3, 4, 5, 6, 7, 8, 9, 10, 1, 2 (tier 3 first - opposite concept)`)
            orderedResults = [...t3Opp, ...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp]
          } else if (stopNumber === 4) {
            console.log(`[STOP DEBUG] STOP 4 EXECUTED (with opposite) - Tier 4, 5, 6, 7, 8, 9, 10, 1, 2, 3 (tier 4 first - opposite concept)`)
            orderedResults = [...t4Opp, ...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp, ...t3Opp]
            console.log(`[ORDER DEBUG] Stop 4 (with opp) - First 5 IDs: ${orderedResults.slice(0, 5).map(s => s.id.substring(0, 8)).join(', ')}`)
          } else {
            // Stop 5
            console.log(`[STOP DEBUG] STOP 5 EXECUTED (with opposite) - Tier 5, 6, 7, 8, 9, 10, 1, 2, 3, 4 (tier 5 first - opposite concept)`)
            orderedResults = [...t5Opp, ...t6Opp, ...t7Opp, ...t8Opp, ...t9Opp, ...t10Opp, ...t1Opp, ...t2Opp, ...t3Opp, ...t4Opp]
          }
          console.log(`[STOP DEBUG] Left side (with opposite) orderedResults.length: ${orderedResults.length}`)
          console.log(`[STOP DEBUG] First 10 IDs: ${orderedResults.slice(0, 10).map(s => s.id.substring(0, 8)).join(', ')}`)
          console.log(`[STOP DEBUG] First 10 scores: ${orderedResults.slice(0, 10).map(s => (s.score ?? 0).toFixed(3)).join(', ')}`)
        }
      }
      
      console.log(`[STOP DEBUG] Final orderedResults.length before deduplication: ${orderedResults.length}`)
      console.log(`[STOP DEBUG] First 10 IDs before deduplication: ${orderedResults.slice(0, 10).map(s => s.id.substring(0, 8)).join(', ')}`)
      
      // Deduplicate results by site ID before setting
      // IMPORTANT: Use Array.from with a new array to ensure React detects the change
      const deduplicatedResults = Array.from(
        new Map(orderedResults.map(site => [site.id, site])).values()
      )
      
      console.log(`[DEDUP DEBUG] Stop ${stopNumber} - Before dedup: ${orderedResults.length}, After dedup: ${deduplicatedResults.length}`)
      if (orderedResults.length !== deduplicatedResults.length) {
        console.log(`[DEDUP DEBUG] Duplicates found! Duplicate IDs: ${orderedResults.length - deduplicatedResults.length} duplicates removed`)
        const allIds = orderedResults.map(s => s.id)
        const uniqueIds = new Set(allIds)
        const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index)
        console.log(`[DEDUP DEBUG] Duplicate IDs: ${[...new Set(duplicates)].map(id => id.substring(0, 8)).join(', ')}`)
      }
      
      // Log the first 10 IDs to verify ordering is different
      console.log(`[FINAL DEBUG] Stop ${stopNumber} - First 10 site IDs after deduplication: ${deduplicatedResults.slice(0, 10).map(s => s.id.substring(0, 8)).join(', ')}`)
      console.log(`[FINAL DEBUG] Stop ${stopNumber} - First 10 site scores: ${deduplicatedResults.slice(0, 10).map(s => (s.score ?? 0).toFixed(3)).join(', ')}`)
      
      // Only set sites if we have results
      // Create a completely new array reference to force React to re-render
      if (deduplicatedResults.length > 0) {
        const newSitesArray = [...deduplicatedResults] // Create new array reference
        console.log(`[FINAL DEBUG] Stop ${stopNumber} - Setting ${newSitesArray.length} sites, first ID: ${newSitesArray[0]?.id.substring(0, 8)}`)
        setAllSites(newSitesArray)
        setDisplayedCount(50)
      } else if (conceptResultSet.length > 0) {
        // Fallback: if reordering produced no results, use original concept results
        const fallbackArray = [...conceptResultSet].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        console.log(`[FINAL DEBUG] Using fallback, first ID: ${fallbackArray[0]?.id.substring(0, 8)}`)
        setAllSites(fallbackArray)
        setDisplayedCount(50)
      }
    } else {
      // Multiple concepts: apply slider-based ranking for each concept, then combine
      console.log(`[MULTI DEBUG] Processing ${selectedConcepts.length} concepts`)
      
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

  const fetchSites = async () => {
    try {
      setLoading(true)
      
      // Build search query from selected concepts
      const query = selectedConcepts.join(' ')
      
      if (query.trim()) {
        // Zero-shot search: rank images by cosine similarity
        // Pass category parameter: "website", "packaging", or "all" (or omit for "all")
        const categoryParam = category || 'all'
        
        // Don't pass slider positions - we'll reorder client-side
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
        const deduplicatedSites = Array.from(siteMap.values())
        
        // Store results for each concept
        if (selectedConcepts.length === 1) {
          const concept = selectedConcepts[0]
          setConceptResults(prev => new Map(prev).set(concept, deduplicatedSites))
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
          console.log(`[OPPOSITE DEBUG] Concept info for ${concept}:`, conceptInfo)
          const opposites = conceptInfo?.opposites || []
          console.log(`[OPPOSITE DEBUG] Opposites for ${concept}:`, opposites)
          if (opposites.length > 0) {
            const firstOpposite = opposites[0]
            console.log(`[OPPOSITE DEBUG] Fetching opposite immediately for ${concept}: ${firstOpposite}`)
            // Fetch opposite immediately, don't wait for slider to cross 50%
            fetchOppositeResults(concept, firstOpposite, categoryParam)
          } else {
            console.log(`[OPPOSITE DEBUG] No opposites found for ${concept}`)
          }
        } else {
          // Multiple concepts: fetch results for each concept individually
          console.log(`[MULTI FETCH] Fetching results for ${selectedConcepts.length} concepts individually`)
          
          const conceptResultsMap = new Map<string, Site[]>()
          const fetchPromises: Promise<void>[] = []
          
          for (const concept of selectedConcepts) {
            const fetchPromise = (async () => {
              try {
                const conceptSearchUrl = `/api/search?q=${encodeURIComponent(concept.trim())}&category=${encodeURIComponent(categoryParam)}`
                const conceptResponse = await fetch(conceptSearchUrl)
                if (!conceptResponse.ok) {
                  console.error(`[MULTI FETCH] Failed to fetch results for concept "${concept}":`, conceptResponse.status)
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
                console.log(`[MULTI FETCH] Fetched ${deduplicatedConceptSites.length} results for concept "${concept}"`)
                
                // Initialize last slider side
                const sliderPos = sliderPositions.get(concept) ?? 1.0
                setLastSliderSide(prev => new Map(prev).set(concept, sliderPos < 0.5 ? 'left' : 'right'))
                
                // Fetch opposite results for this concept (will use conceptData state)
                // Note: conceptData is fetched separately, so opposites will be fetched
                // when conceptData is available via checkAndFetchOpposites
              } catch (error) {
                console.error(`[MULTI FETCH] Error fetching results for concept "${concept}":`, error)
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
        // OPTIMIZATION: Limit initial load to 100 sites for faster page load
        const sitesUrl = category 
          ? `/api/sites?category=${encodeURIComponent(category)}&limit=100`
          : '/api/sites?limit=100'
        try {
          const response = await fetch(sitesUrl)
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Failed response fetching sites', response.status, errorData)
            setAllSites([])
            setDisplayedCount(50)
            return
          }
          const data = await response.json()
          setAllSites(Array.isArray(data.sites) ? data.sites : [])
          setDisplayedCount(50)
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
        // If a suggestion is highlighted, select it
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < conceptSuggestions.length) {
          handleSuggestionSelect(conceptSuggestions[selectedSuggestionIndex])
        } else if (inputValue.trim()) {
          // Check if input exactly matches a concept (label or ID) before adding as custom
          const trimmed = inputValue.trim()
          const trimmedLower = trimmed.toLowerCase()
          const queryId = trimmedLower.replace(/[^a-z0-9]+/g, '-')
          
          // Find exact match in suggestions
          const exactMatch = conceptSuggestions.find((suggestion: ConceptSuggestion) => {
            const labelLower = suggestion.label.toLowerCase()
            const idLower = suggestion.id.toLowerCase()
            return labelLower === trimmedLower || idLower === trimmedLower || idLower === queryId
          })
          
          if (exactMatch) {
            // Auto-select exact match
            handleSuggestionSelect(exactMatch)
          } else {
            // No exact match - add as custom tag
            addConcept(trimmed, true)
            setShowSuggestions(false)
            setConceptSuggestions([])
            setSelectedSuggestionIndex(-1)
          }
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
        // Even without suggestions visible, check if query matches a concept exactly
        // by fetching concepts API
        const trimmed = inputValue.trim()
        fetch(`/api/concepts?q=${encodeURIComponent(trimmed)}`)
          .then(res => res.json())
          .then(data => {
            const suggestions = Array.isArray(data.concepts) ? data.concepts : []
            const trimmedLower = trimmed.toLowerCase()
            const queryId = trimmedLower.replace(/[^a-z0-9]+/g, '-')
            
            const exactMatch = suggestions.find((suggestion: ConceptSuggestion) => {
              const labelLower = suggestion.label.toLowerCase()
              const idLower = suggestion.id.toLowerCase()
              return labelLower === trimmedLower || idLower === trimmedLower || idLower === queryId
            })
            
            if (exactMatch) {
              addConcept(exactMatch.label, false) // Use concept label
            } else {
              addConcept(trimmed, true) // Custom tag
            }
          })
          .catch(() => {
            // If API fails, add as custom tag
            addConcept(trimmed, true)
          })
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
    <div className="min-h-screen bg-[#fbf9f4] flex">
      {/* Left Drawer - Dynamic, max width 280px */}
      <div className={`bg-[#fbf9f4] border-r border-gray-300 transition-all duration-300 ease-in-out relative ${
        isDrawerOpen ? (isDrawerCollapsed ? 'w-20' : 'w-[280px]') : 'w-0'
      } overflow-hidden`}>
        <div className="h-full flex flex-col">
          {/* Logo and collapse button at top of drawer */}
          <div className="p-4 md:p-6 border-b border-gray-300 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <img src="/Logo.svg" alt="Logo" className="h-6 w-auto" />
            </Link>
            <button
              onClick={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label={isDrawerCollapsed ? 'Expand drawer' : 'Collapse drawer'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                {isDrawerCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Drawer content - can add navigation or other content here */}
          <div className={`flex-1 p-4 md:p-6 ${isDrawerCollapsed ? 'hidden' : ''}`}>
            {/* Drawer content placeholder - can add navigation, filters, etc. */}
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 transition-all duration-300 ease-in-out min-w-0">
        {/* Header - without logo (logo is now in drawer) */}
        <Header 
          onSubmitClick={() => setShowSubmissionForm(true)}
        />
        
        {/* Searchbar - Sticky at the top */}
        <div className="sticky top-0 bg-[#fbf9f4] z-50">
          <div className="max-w-full mx-auto px-4 md:px-[52px] pt-4 pb-6">
          {/* Search field container - 52px tall */}
          <div className="border border-gray-300 rounded-md relative z-20 flex items-center" style={{ height: '52px' }}>
            <div className="flex-1 min-w-0 relative h-full">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setShowSuggestions(inputValue.length > 0 || conceptSuggestions.length > 0)
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(false)
                  }, 200)
                }}
                  placeholder="Search for anything..."
                className="w-full h-full px-3 rounded-md border border-transparent focus:outline-none text-gray-900 placeholder-gray-500 bg-transparent"
                id="search-input"
              />
              
              {/* Autocomplete suggestions dropdown - show below input when at top */}
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
                  onClick={() => addConcept(inputValue.trim(), true)} // Custom tag
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Add "{inputValue.trim()}"
                </button>
                </div>
              )}
            </div>
            {/* Icon-only button - 32px tall */}
            <button
              onClick={() => {
                if (inputValue.trim()) {
                  addConcept(inputValue.trim(), true) // Custom tag
                }
              }}
              disabled={!inputValue.trim()}
              className="flex items-center justify-center mx-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              style={{ width: '32px', height: '32px' }}
              aria-label="Search"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.2619 15.0766 18.0303 16.6162L21.7051 20.291C22.0955 20.6815 22.0956 21.3146 21.7051 21.7051C21.3146 22.0956 20.6815 22.0955 20.291 21.7051L16.6162 18.0303C15.0766 19.2619 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2ZM11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.8873 18 14.5985 17.2514 15.8574 16.0371C15.8831 16.0039 15.911 15.9719 15.9414 15.9414C15.9719 15.911 16.0039 15.8831 16.0371 15.8574C17.2514 14.5985 18 12.8873 18 11C18 7.13401 14.866 4 11 4Z" fill="black"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content and Panel Container */}
      <div className="flex">
        {/* Main Content - shifts when panel opens */}
        <div className="flex-1 transition-all duration-300 ease-in-out min-w-0">


          {/* Gallery Grid */}
          <main className="bg-transparent pb-8">
            <div className="max-w-full mx-auto px-4 md:px-[52px] pt-3 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
                     <div key={`${site.id}-${index}`}>
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
                              loading="lazy"
                              onError={(e) => {
                                // Log all image load errors for debugging
                                console.error('Image failed to load:', {
                                  url: site.imageUrl,
                                  siteId: site.id,
                                  siteTitle: site.title,
                                  error: e
                                });
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => {
                                // Log successful loads for debugging (can remove later)
                                if (process.env.NODE_ENV === 'development') {
                                  console.log('Image loaded successfully:', site.imageUrl);
                                }
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
            {/* Lazy loading trigger - load more when this becomes visible */}
            {displayedCount < allSites.length && (
              <div ref={loadMoreRef} className="col-span-full flex justify-center py-8">
                <div className="text-gray-400 text-sm">Loading more...</div>
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
        />
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
      </div>
      </div>
    </div>
  )
}
