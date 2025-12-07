/**
 * Performance Logger
 * 
 * Comprehensive performance monitoring system that tracks exact timing
 * for each operation in the application. No guessing - only measured data.
 */

export interface PerformanceMetric {
  operation: string
  duration: number // milliseconds
  timestamp: number
  metadata?: Record<string, any>
  parentOperation?: string
}

class PerformanceLogger {
  private metrics: PerformanceMetric[] = []
  private operationStack: string[] = []
  private startTimes: Map<string, number> = new Map()

  /**
   * Start timing an operation
   */
  start(operation: string, metadata?: Record<string, any>): void {
    const fullOperation = this.operationStack.length > 0
      ? `${this.operationStack[this.operationStack.length - 1]}.${operation}`
      : operation

    this.operationStack.push(fullOperation)
    this.startTimes.set(fullOperation, performance.now())
    
    if (metadata) {
      console.log(`[PERF] START: ${fullOperation}`, metadata)
    } else {
      console.log(`[PERF] START: ${fullOperation}`)
    }
  }

  /**
   * End timing an operation and record the metric
   */
  end(operation: string, metadata?: Record<string, any>): number {
    const fullOperation = this.operationStack.pop()
    if (!fullOperation) {
      console.warn(`[PERF] WARNING: No operation to end for "${operation}"`)
      return 0
    }

    const startTime = this.startTimes.get(fullOperation)
    if (!startTime) {
      console.warn(`[PERF] WARNING: No start time found for "${fullOperation}"`)
      return 0
    }

    const duration = performance.now() - startTime
    this.startTimes.delete(fullOperation)

    const parentOperation = this.operationStack.length > 0
      ? this.operationStack[this.operationStack.length - 1]
      : undefined

    const metric: PerformanceMetric = {
      operation: fullOperation,
      duration,
      timestamp: Date.now(),
      metadata,
      parentOperation,
    }

    this.metrics.push(metric)
    
    const metadataStr = metadata ? ` ${JSON.stringify(metadata)}` : ''
    console.log(`[PERF] END: ${fullOperation} - ${duration.toFixed(2)}ms${metadataStr}`)

    return duration
  }

  /**
   * Measure an async operation
   */
  async measure<T>(
    operation: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(operation, metadata)
    try {
      const result = await fn()
      this.end(operation, metadata)
      return result
    } catch (error) {
      this.end(operation, { ...metadata, error: (error as Error).message })
      throw error
    }
  }

  /**
   * Measure a synchronous operation
   */
  measureSync<T>(
    operation: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.start(operation, metadata)
    try {
      const result = fn()
      this.end(operation, metadata)
      return result
    } catch (error) {
      this.end(operation, { ...metadata, error: (error as Error).message })
      throw error
    }
  }

  /**
   * Get all metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * Get metrics summary grouped by operation
   */
  getSummary(): Record<string, {
    count: number
    totalDuration: number
    avgDuration: number
    minDuration: number
    maxDuration: number
    operations: PerformanceMetric[]
  }> {
    const summary: Record<string, {
      count: number
      totalDuration: number
      avgDuration: number
      minDuration: number
      maxDuration: number
      operations: PerformanceMetric[]
    }> = {}

    for (const metric of this.metrics) {
      if (!summary[metric.operation]) {
        summary[metric.operation] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          minDuration: Infinity,
          maxDuration: 0,
          operations: [],
        }
      }

      const entry = summary[metric.operation]
      entry.count++
      entry.totalDuration += metric.duration
      entry.minDuration = Math.min(entry.minDuration, metric.duration)
      entry.maxDuration = Math.max(entry.maxDuration, metric.duration)
      entry.operations.push(metric)
    }

    // Calculate averages
    for (const key in summary) {
      summary[key].avgDuration = summary[key].totalDuration / summary[key].count
    }

    return summary
  }

  /**
   * Get formatted report
   */
  getReport(): string {
    const summary = this.getSummary()
    const lines: string[] = []
    
    lines.push('='.repeat(80))
    lines.push('PERFORMANCE REPORT')
    lines.push('='.repeat(80))
    lines.push('')

    // Sort by total duration descending
    const sorted = Object.entries(summary).sort((a, b) => 
      b[1].totalDuration - a[1].totalDuration
    )

    for (const [operation, stats] of sorted) {
      lines.push(`Operation: ${operation}`)
      lines.push(`  Count: ${stats.count}`)
      lines.push(`  Total: ${stats.totalDuration.toFixed(2)}ms`)
      lines.push(`  Average: ${stats.avgDuration.toFixed(2)}ms`)
      lines.push(`  Min: ${stats.minDuration.toFixed(2)}ms`)
      lines.push(`  Max: ${stats.maxDuration.toFixed(2)}ms`)
      lines.push('')
    }

    lines.push('='.repeat(80))
    return lines.join('\n')
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics = []
    this.operationStack = []
    this.startTimes.clear()
  }

  /**
   * Export metrics as JSON
   */
  exportJSON(): string {
    return JSON.stringify({
      metrics: this.metrics,
      summary: this.getSummary(),
      report: this.getReport(),
    }, null, 2)
  }
}

// Global instance for server-side use
let globalLogger: PerformanceLogger | null = null

export function getPerformanceLogger(): PerformanceLogger {
  if (!globalLogger) {
    globalLogger = new PerformanceLogger()
  }
  return globalLogger
}

// For client-side use, create a new instance per request
export function createPerformanceLogger(): PerformanceLogger {
  return new PerformanceLogger()
}

