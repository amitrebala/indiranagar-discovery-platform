import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Rate limiting storage (in production, use Redis)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

const suggestionSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters').max(1000, 'Question too long'),
  location: z.string().max(200).optional(),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(20).optional(),
})

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimit.get(ip)
  
  if (!limit || now > limit.resetTime) {
    // Reset limit every hour
    rateLimit.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 })
    return true
  }
  
  if (limit.count >= 5) { // Max 5 submissions per hour
    return false
  }
  
  limit.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validatedData = suggestionSchema.parse(body)

    // Create Supabase client
    const supabase = await createClient()

    // Insert suggestion into database
    const { data, error } = await supabase
      .from('suggestions')
      .insert({
        question: validatedData.question,
        location: validatedData.location || null,
        contact_name: validatedData.name,
        contact_email: validatedData.email,
        contact_phone: validatedData.phone || null,
        status: 'new',
        submitted_at: new Date().toISOString(),
        ip_address: ip
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save question' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to Amit
    // This would integrate with SendGrid or similar service

    return NextResponse.json({
      success: true,
      message: 'Question submitted successfully',
      id: data.id
    })

  } catch (error) {
    console.error('Suggestion submission error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Suggestions API endpoint',
    methods: ['POST']
  })
}