/**
 * Hub Detection Trigger
 * 
 * Debounced trigger for hub detection to avoid running too frequently.
 * Hub detection is expensive (1,517 queries), so we debounce it.
 */

import { runHubDetection, runHubDetectionForImages } from './hub-detection'

// Debounce state
let hubDetectionTimeout: NodeJS.Timeout | null = null
let hubDetectionRunning = false
let hubDetectionPending = false
let pendingImageIds: string[] = []

// Configuration
const HUB_DETECTION_DEBOUNCE_MS = 5 * 60 * 1000 // 5 minutes
const HUB_DETECTION_MIN_INTERVAL_MS = 10 * 60 * 1000 // Minimum 10 minutes between runs

let lastHubDetectionTime = 0

/**
 * Trigger hub detection for specific image(s) (incremental)
 * This is much faster as it only processes the specified images
 */
export async function triggerHubDetectionForImages(
  imageIds: string[],
  options: {
    force?: boolean
    topN?: number
    thresholdMultiplier?: number
  } = {}
): Promise<void> {
  const {
    force = false,
    topN = 40,
    thresholdMultiplier = 1.5,
  } = options

  if (imageIds.length === 0) {
    return
  }

  // Add to pending list
  pendingImageIds.push(...imageIds)
  pendingImageIds = Array.from(new Set(pendingImageIds)) // Deduplicate

  // If already running, mark as pending
  if (hubDetectionRunning) {
    console.log(`[hub-detection-trigger] Hub detection already running, will process ${pendingImageIds.length} image(s) after completion`)
    return
  }

  // If forced, run immediately
  if (force) {
    console.log(`[hub-detection-trigger] Force running incremental hub detection for ${pendingImageIds.length} image(s) immediately`)
    await runHubDetectionForImagesAsync(pendingImageIds, topN, thresholdMultiplier)
    pendingImageIds = []
    return
  }

  // Clear existing timeout
  if (hubDetectionTimeout) {
    clearTimeout(hubDetectionTimeout)
    hubDetectionTimeout = null
  }

  // Debounce: schedule to run after delay
  console.log(`[hub-detection-trigger] Scheduling incremental hub detection for ${pendingImageIds.length} image(s) in ${HUB_DETECTION_DEBOUNCE_MS / 1000}s`)
  hubDetectionTimeout = setTimeout(() => {
    hubDetectionTimeout = null
    const idsToProcess = [...pendingImageIds]
    pendingImageIds = []
    runHubDetectionForImagesAsync(idsToProcess, topN, thresholdMultiplier)
  }, HUB_DETECTION_DEBOUNCE_MS)
}

/**
 * Run incremental hub detection asynchronously (non-blocking)
 */
async function runHubDetectionForImagesAsync(
  imageIds: string[],
  topN: number,
  thresholdMultiplier: number
): Promise<void> {
  if (hubDetectionRunning) {
    console.log(`[hub-detection-trigger] Hub detection already running, skipping`)
    return
  }

  hubDetectionRunning = true

  try {
    console.log(`[hub-detection-trigger] Starting incremental hub detection for ${imageIds.length} image(s)...`)
    await runHubDetectionForImages(imageIds, topN, thresholdMultiplier)
    console.log(`[hub-detection-trigger] ✅ Incremental hub detection completed`)
  } catch (error: any) {
    console.error(`[hub-detection-trigger] ❌ Incremental hub detection failed: ${error.message}`)
    // Don't throw - this is a background job
  } finally {
    hubDetectionRunning = false
  }
}

/**
 * Trigger hub detection with debouncing (for all images - full scan)
 * This will schedule hub detection to run after a delay, or immediately if enough time has passed
 */
export async function triggerHubDetection(options: {
  force?: boolean // Force immediate run (bypass debounce)
  clearExisting?: boolean
  topN?: number
  thresholdMultiplier?: number
} = {}): Promise<void> {
  const {
    force = false,
    clearExisting = false,
    topN = 40,
    thresholdMultiplier = 1.5,
  } = options

  // If already running, mark as pending
  if (hubDetectionRunning) {
    console.log(`[hub-detection-trigger] Hub detection already running, will run again after completion`)
    hubDetectionPending = true
    return
  }

  // Check minimum interval
  const now = Date.now()
  const timeSinceLastRun = now - lastHubDetectionTime
  
  if (!force && timeSinceLastRun < HUB_DETECTION_MIN_INTERVAL_MS) {
    const remainingMs = HUB_DETECTION_MIN_INTERVAL_MS - timeSinceLastRun
    console.log(`[hub-detection-trigger] Too soon since last run (${Math.round(remainingMs / 1000)}s remaining), scheduling for later`)
    
    // Clear existing timeout
    if (hubDetectionTimeout) {
      clearTimeout(hubDetectionTimeout)
    }
    
    // Schedule for after minimum interval
    hubDetectionTimeout = setTimeout(() => {
      hubDetectionTimeout = null
      triggerHubDetection({ force: false, clearExisting, topN, thresholdMultiplier })
    }, remainingMs)
    
    return
  }

  // Clear existing timeout
  if (hubDetectionTimeout) {
    clearTimeout(hubDetectionTimeout)
    hubDetectionTimeout = null
  }

  // If forced, run immediately
  if (force) {
    console.log(`[hub-detection-trigger] Force running hub detection immediately`)
    await runHubDetectionAsync(clearExisting, topN, thresholdMultiplier)
    return
  }

  // Otherwise, debounce
  console.log(`[hub-detection-trigger] Scheduling hub detection in ${HUB_DETECTION_DEBOUNCE_MS / 1000}s`)
  hubDetectionTimeout = setTimeout(() => {
    hubDetectionTimeout = null
    runHubDetectionAsync(clearExisting, topN, thresholdMultiplier)
  }, HUB_DETECTION_DEBOUNCE_MS)
}

/**
 * Run hub detection asynchronously (non-blocking)
 */
async function runHubDetectionAsync(
  clearExisting: boolean,
  topN: number,
  thresholdMultiplier: number
): Promise<void> {
  if (hubDetectionRunning) {
    console.log(`[hub-detection-trigger] Hub detection already running, skipping`)
    return
  }

  hubDetectionRunning = true
  lastHubDetectionTime = Date.now()

  try {
    console.log(`[hub-detection-trigger] Starting hub detection...`)
    await runHubDetection(topN, thresholdMultiplier, clearExisting)
    console.log(`[hub-detection-trigger] ✅ Hub detection completed`)
  } catch (error: any) {
    console.error(`[hub-detection-trigger] ❌ Hub detection failed: ${error.message}`)
    // Don't throw - this is a background job
  } finally {
    hubDetectionRunning = false
    
    // If there was a pending request, run it now
    if (hubDetectionPending) {
      hubDetectionPending = false
      console.log(`[hub-detection-trigger] Running pending hub detection...`)
      // Wait a bit before running again
      setTimeout(() => {
        runHubDetectionAsync(clearExisting, topN, thresholdMultiplier)
      }, 1000)
    }
  }
}

/**
 * Cancel any pending hub detection
 */
export function cancelHubDetection(): void {
  if (hubDetectionTimeout) {
    clearTimeout(hubDetectionTimeout)
    hubDetectionTimeout = null
    console.log(`[hub-detection-trigger] Cancelled pending hub detection`)
  }
}

