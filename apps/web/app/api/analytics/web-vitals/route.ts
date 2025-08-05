import { NextRequest, NextResponse } from 'next/server'

interface WebVitalMetric {
  name: string
  value: number
  url: string
  timestamp: number
  id?: string
  rating?: 'good' | 'needs-improvement' | 'poor'
}

interface NetworkCondition {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown'
  downlink: number
  rtt: number
  saveData: boolean
}

interface WebVitalReport extends WebVitalMetric {
  userAgent?: string
  viewport?: {
    width: number
    height: number
  }
  connection?: NetworkCondition
  deviceMemory?: number
  hardwareConcurrency?: number
}

// Core Web Vitals thresholds (in milliseconds, except CLS which is unitless)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift (scaled by 1000 in reports)
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  INP: { good: 200, poor: 500 },   // Interaction to Next Paint
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  // CLS values are sent scaled by 1000
  const actualValue = name === 'CLS' ? value / 1000 : value
  
  if (actualValue <= threshold.good) return 'good'
  if (actualValue <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

function validateMetric(data: unknown): WebVitalMetric | null {
  if (!data || typeof data !== 'object') return null
  
  const { name, value, url, timestamp } = data as Record<string, unknown>
  
  if (
    typeof name !== 'string' ||
    typeof value !== 'number' ||
    typeof url !== 'string' ||
    typeof timestamp !== 'number'
  ) {
    return null
  }

  // Validate metric names
  const validMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP']
  if (!validMetrics.includes(name)) return null

  // Validate value ranges
  if (value < 0 || value > 60000) return null // Max 60 seconds

  // Validate timestamp (should be recent)
  const now = Date.now()
  if (timestamp < now - 3600000 || timestamp > now + 60000) return null // 1 hour ago to 1 minute future

  return { name, value, url, timestamp }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    
    if (!body) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    let data: unknown
    try {
      data = JSON.parse(body)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    const metric = validateMetric(data)
    if (!metric) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // Extract additional context from headers and data
    const userAgent = request.headers.get('user-agent')
    const typedData = data as Record<string, unknown>
    const report: WebVitalReport = {
      ...metric,
      rating: getRating(metric.name, metric.value),
      userAgent: userAgent || undefined,
      viewport: typedData.viewport as { width: number; height: number } | undefined,
      connection: typedData.connection as NetworkCondition | undefined,
      deviceMemory: typedData.deviceMemory as number | undefined,
      hardwareConcurrency: typedData.hardwareConcurrency as number | undefined,
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital Report:', {
        metric: report.name,
        value: report.value,
        rating: report.rating,
        url: report.url,
        connection: report.connection?.effectiveType,
      })
    }

    // In production, you would typically:
    // 1. Store in database
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Alert on poor performance
    
    // Example: Store in database (uncomment and adapt to your setup)
    /*
    try {
      await saveWebVitalToDatabase({
        metric_name: report.name,
        metric_value: report.value,
        metric_rating: report.rating,
        page_url: report.url,
        timestamp: new Date(report.timestamp),
        user_agent: report.userAgent,
        viewport_width: report.viewport?.width,
        viewport_height: report.viewport?.height,
        connection_type: report.connection?.effectiveType,
        connection_downlink: report.connection?.downlink,
        connection_rtt: report.connection?.rtt,
        device_memory: report.deviceMemory,
        hardware_concurrency: report.hardwareConcurrency,
      })
    } catch (dbError) {
      console.error('Failed to save web vital to database:', dbError)
      // Don't fail the request if database save fails
    }
    */

    // Example: Send to external analytics service
    /*
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      try {
        await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        })
      } catch (webhookError) {
        console.error('Failed to send to analytics webhook:', webhookError)
      }
    }
    */

    // Alert on poor performance metrics
    if (report.rating === 'poor') {
      console.warn(`🚨 Poor ${report.name} performance detected:`, {
        value: report.value,
        threshold: THRESHOLDS[report.name as keyof typeof THRESHOLDS]?.poor,
        url: report.url,
        userAgent: report.userAgent,
      })

      // Example: Send alert to monitoring service
      /*
      if (process.env.ALERT_WEBHOOK_URL) {
        try {
          await fetch(process.env.ALERT_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              alert: 'Poor Web Vital Performance',
              metric: report.name,
              value: report.value,
              url: report.url,
              severity: 'warning',
            }),
          })
        } catch (alertError) {
          console.error('Failed to send performance alert:', alertError)
        }
      }
      */
    }

    return NextResponse.json(
      { 
        success: true, 
        metric: report.name,
        rating: report.rating,
        received: true 
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )

  } catch (error) {
    console.error('Web vitals endpoint error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    {
      endpoint: 'Web Vitals Collection',
      methods: ['POST'],
      description: 'Collects Core Web Vitals metrics for performance monitoring',
      supported_metrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP'],
      thresholds: THRESHOLDS,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    }
  )
}

// Handle preflight requests for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  })
}