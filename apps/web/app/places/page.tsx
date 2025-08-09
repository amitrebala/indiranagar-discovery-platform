import { Metadata } from 'next'
import PlacesPageClient from './PlacesPageClient'

export const metadata: Metadata = {
  title: 'Places in Indiranagar | Amit\'s Recommendations & More',
  description: 'Explore 186 personally visited places by Amit plus discover all top-rated restaurants, cafes, and attractions in Indiranagar, Bangalore. Real-time ratings from Google.'
}

export default function PlacesPage() {
  return <PlacesPageClient />
}