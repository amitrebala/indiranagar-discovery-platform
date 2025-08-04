import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_DOMAINS = [
  'images.unsplash.com',
  'images.pexels.com',
  'cdn.pixabay.com',
  'lh3.googleusercontent.com',
  'lh5.googleusercontent.com',
]

const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const DEFAULT_QUALITY = 85
const MIN_QUALITY = 60
const MAX_QUALITY = 95

function isAllowedDomain(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return ALLOWED_DOMAINS.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    )
  } catch {
    return false
  }
}

function getContentType(format: string): string {
  const formats: Record<string, string> = {
    'webp': 'image/webp',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png',
    'avif': 'image/avif',
  }
  return formats[format.toLowerCase()] || 'image/jpeg'
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    const width = searchParams.get('w')
    const height = searchParams.get('h')
    const quality = searchParams.get('q')
    const format = searchParams.get('f') || 'webp'

    if (!imageUrl) {
      return NextResponse.json({ error: 'Missing image URL' }, { status: 400 })
    }

    if (!isAllowedDomain(imageUrl)) {
      return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 })
    }

    const parsedWidth = width ? Math.min(parseInt(width), MAX_WIDTH) : undefined
    const parsedHeight = height ? Math.min(parseInt(height), MAX_HEIGHT) : undefined
    const parsedQuality = quality 
      ? Math.max(MIN_QUALITY, Math.min(parseInt(quality), MAX_QUALITY))
      : DEFAULT_QUALITY

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Indiranagar-Discovery-Platform/1.0',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${response.statusText}` },
        { status: response.status }
      )
    }

    const contentType = response.headers.get('content-type')
    if (!contentType?.startsWith('image/')) {
      return NextResponse.json(
        { error: 'URL does not point to an image' },
        { status: 400 }
      )
    }

    const imageBuffer = await response.arrayBuffer()

    const headers = new Headers({
      'Content-Type': getContentType(format),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'max-age=31536000',
      'Vary': 'Accept',
      'X-Content-Type-Options': 'nosniff',
      'X-Image-Source': new URL(imageUrl).hostname,
    })

    if (parsedWidth) {
      headers.set('X-Image-Width', parsedWidth.toString())
    }
    if (parsedHeight) {
      headers.set('X-Image-Height', parsedHeight.toString())
    }
    headers.set('X-Image-Quality', parsedQuality.toString())

    return new NextResponse(imageBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to process image request' },
      { status: 500 }
    )
  }
}

export const runtime = 'edge'