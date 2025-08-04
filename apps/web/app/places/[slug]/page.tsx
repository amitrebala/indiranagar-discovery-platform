import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import AmitPlaceDetail from '@/components/places/AmitPlaceDetail'
import { createClient } from '@/lib/supabase/server'
import { Place } from '@/lib/validations'

// Generate slug from place name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Get place data by slug
async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const supabase = await createClient()
  
  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    
  if (error || !places) {
    console.error('Error fetching places:', error)
    return null
  }

  // Find place by matching slug
  const place = places.find(p => generateSlug(p.name) === slug)
  return place || null
}

// Get place images
async function getPlaceImages(placeId: string) {
  const supabase = await createClient()
  
  const { data: images, error } = await supabase
    .from('place_images')
    .select('*')
    .eq('place_id', placeId)
    .order('sort_order', { ascending: true })
    
  if (error) {
    console.error('Error fetching place images:', error)
    return []
  }
  
  return images || []
}

// Get companion activities
async function getCompanionActivities(placeId: string) {
  const supabase = await createClient()
  
  const { data: activities, error } = await supabase
    .from('companion_activities')
    .select('*')
    .eq('place_id', placeId)
    .order('activity_type', { ascending: true })
    
  if (error) {
    console.error('Error fetching companion activities:', error)
    return []
  }
  
  return activities || []
}

// Generate metadata for each place
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)
  
  if (!place) {
    return {
      title: 'Place Not Found - Indiranagar Discovery',
      description: 'The place you\'re looking for could not be found.',
    }
  }

  const title = `${place.name} - Indiranagar Discovery`
  const description = place.description.length > 160 
    ? place.description.substring(0, 157) + '...'
    : place.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: place.primary_image ? [
        {
          url: place.primary_image,
          width: 1200,
          height: 630,
          alt: place.name,
        }
      ] : [],
      type: 'website',
      locale: 'en_US',
      siteName: 'Indiranagar Discovery',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: place.primary_image ? [place.primary_image] : [],
    },
  }
}

// Generate static params for known places (optional optimization)
export async function generateStaticParams() {
  // Skip static generation for dynamic routes in development
  // This will be generated at request time instead
  return []
}

export default async function PlacePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)
  
  if (!place) {
    notFound()
  }

  // Fetch additional data in parallel
  const [images, activities] = await Promise.all([
    getPlaceImages(place.id),
    getCompanionActivities(place.id)
  ])

  return (
    <AmitPlaceDetail 
      place={place}
      images={images}
      activities={activities}
    />
  )
}