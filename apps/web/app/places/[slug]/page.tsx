import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AmitPlaceDetail from '@/components/places/AmitPlaceDetail'
import type { Place } from '@/lib/supabase/types'

interface PlacePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate place slug from name (same logic as in PlaceCard)
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const supabase = await createClient()
  
  // Get all places and find the one that matches the slug
  const { data: places, error } = await supabase
    .from('places')
    .select('*')
    .eq('has_amit_visited', true)
  
  if (error) {
    console.error('Error fetching places:', error)
    return null
  }

  // Find place by matching generated slug
  const place = places?.find(p => nameToSlug(p.name) === slug)
  return place || null
}

async function getPlaceImages(placeId: string) {
  const supabase = await createClient()
  
  const { data: images, error } = await supabase
    .from('place_images')
    .select('*')
    .eq('place_id', placeId)
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching place images:', error)
    return []
  }
  
  return images || []
}

async function getCompanionActivities(placeId: string) {
  const supabase = await createClient()
  
  const { data: activities, error } = await supabase
    .from('companion_activities')
    .select('*')
    .eq('place_id', placeId)
    .order('activity_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching companion activities:', error)
    return []
  }
  
  return activities || []
}

export async function generateMetadata({ params }: PlacePageProps) {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)
  
  if (!place) {
    return {
      title: 'Place Not Found - Indiranagar Discovery',
      description: 'The requested place could not be found.'
    }
  }
  
  return {
    title: `${place.name} - Indiranagar Discovery`,
    description: place.description,
    openGraph: {
      title: `${place.name} - Indiranagar Discovery`,
      description: place.description,
      type: 'article',
    },
  }
}

function PlaceDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded w-64"></div>
          </div>
          <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function PlacePage({ params }: PlacePageProps) {
  const { slug } = await params
  const place = await getPlaceBySlug(slug)
  
  if (!place) {
    notFound()
  }
  
  // Fetch related data in parallel
  const [images, activities] = await Promise.all([
    getPlaceImages(place.id),
    getCompanionActivities(place.id)
  ])
  
  return (
    <Suspense fallback={<PlaceDetailSkeleton />}>
      <AmitPlaceDetail 
        place={place}
        images={images}
        activities={activities}
      />
    </Suspense>
  )
}

// Generate static params for static generation (optional)
// Disabled to avoid build-time context issues - pages will be generated on-demand
// export async function generateStaticParams() {
//   return []
// }