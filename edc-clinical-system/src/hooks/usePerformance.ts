import { useEffect, useRef } from 'react'

/**
 * 性能监控配置
 */
interface PerformanceConfig {
  /** 是否启用性能监控 */
  enabled?: boolean
  /** 性能数据上报回调 */
  onReport?: (metrics: PerformanceMetrics) => void
  /** 慢组件阈值（毫秒） */
  slowComponentThreshold?: number
}

/**
 * 性能指标
 */
interface PerformanceMetrics {
  /** 组件渲染耗时 */
  renderTime?: number
  /** 首次渲染标记 */
  mountTime?: number
  /** 核心 Web 指标 */
  webVitals?: WebVitalsMetrics
  /** 内存使用情况 */
  memory?: MemoryInfo
}

/**
 * 核心 Web 指标
 */
interface WebVitalsMetrics {
  /** 最大内容绘制 */
  lcp?: number
  /** 首次输入延迟 */
  fid?: number
  /** 累积布局偏移 */
  cls?: number
  /** 首字节时间 */
  ttfb?: number
}

/**
 * 内存信息
 */
interface MemoryInfo {
  usedJSHeapSize?: number
  totalJSHeapSize?: number
  jsHeapSizeLimit?: number
}

/**
 * 组件渲染性能监控 Hook
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePerformance({ componentName: 'MyComponent' })
 *   return <div>内容</div>
 * }
 * ```
 */
export function useComponentPerformance(componentName: string, config?: PerformanceConfig) {
  const { enabled = true, slowComponentThreshold = 16 } = config || {}
  const mountTimeRef = useRef<number>(0)
  const renderCountRef = useRef<number>(0)

  useEffect(() => {
    if (!enabled) return

    mountTimeRef.current = performance.now()
    renderCountRef.current = 0

    return () => {
      const unmountTime = performance.now()
      const lifetime = unmountTime - mountTimeRef.current

      // 在开发环境记录组件生命周期
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} 生命周期: ${lifetime.toFixed(2)}ms, 渲染次数: ${renderCountRef.current}`)
      }
    }
  }, [componentName, enabled])

  // 每次渲染时记录
  if (enabled) {
    renderCountRef.current++
    const renderStartTime = performance.now()

    useEffect(() => {
      const renderTime = performance.now() - renderStartTime

      // 超过阈值标记为慢渲染
      if (renderTime > slowComponentThreshold) {
        console.warn(`[Performance] ${componentName} 慢渲染: ${renderTime.toFixed(2)}ms`)
      }
    })
  }
}

/**
 * 监控核心 Web 指标
 */
export function useWebVitals(config?: PerformanceConfig) {
  const { enabled = true, onReport } = config || {}

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const metrics: WebVitalsMetrics = {}

    // 监听 LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry
      metrics.lcp = lastEntry.startTime

      // LCP 评分
      if (metrics.lcp > 2500) {
        console.warn(`[Web Vitals] LCP 过慢: ${metrics.lcp.toFixed(0)}ms (建议 < 2.5s)`)
      }
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // 浏览器不支持
    }

    // 监听 CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      metrics.cls = clsValue

      // CLS 评分
      if (clsValue > 0.1) {
        console.warn(`[Web Vitals] CLS 过高: ${clsValue.toFixed(3)} (建议 < 0.1)`)
      }
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      // 浏览器不支持
    }

    // 监听 FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = (entry as any).processingStart - entry.startTime
        metrics.fid = fid

        // FID 评分
        if (fid > 100) {
          console.warn(`[Web Vitals] FID 过高: ${fid.toFixed(0)}ms (建议 < 100ms)`)
        }
      }
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      // 浏览器不支持
    }

    // 上报性能数据
    const reportMetrics = () => {
      if (onReport) {
        onReport({ webVitals: metrics })
      }
    }

    // 页面卸载前上报
    window.addEventListener('beforeunload', reportMetrics)

    return () => {
      lcpObserver.disconnect()
      clsObserver.disconnect()
      fidObserver.disconnect()
      window.removeEventListener('beforeunload', reportMetrics)
    }
  }, [enabled, onReport])
}

/**
 * 监控内存使用情况
 */
export function useMemoryMonitor(config?: PerformanceConfig) {
  const { enabled = true } = config || {}

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const memory = (performance as any).memory
    if (!memory) return

    const checkMemory = () => {
      const usedHeap = memory.usedJSHeapSize / 1048576 // MB
      const heapLimit = memory.jsHeapSizeLimit / 1048576 // MB

      // 内存使用超过 80% 警告
      if (usedHeap / heapLimit > 0.8) {
        console.warn(
          `[Memory] 内存使用率高: ${usedHeap.toFixed(1)}MB / ${heapLimit.toFixed(1)}MB (${(
            (usedHeap / heapLimit) *
            100
          ).toFixed(1)}%)`
        )
      }
    }

    // 每 30 秒检查一次
    const interval = setInterval(checkMemory, 30000)

    return () => clearInterval(interval)
  }, [enabled])
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  fnName: string
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    const start = performance.now()
    const result = fn(...args)
    const duration = performance.now() - start

    if (duration > 16) {
      // 超过一帧时间
      console.warn(`[Performance] ${fnName} 执行耗时: ${duration.toFixed(2)}ms`)
    }

    return result
  }) as T
}
