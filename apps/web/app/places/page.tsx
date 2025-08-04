import { Metadata } from 'next'
import PlacesPageClient from './PlacesPageClient'

export const metadata: Metadata = {
  title: 'All Places | Indiranagar with Amit',
  description: 'Browse all 186 places Amit has personally visited and verified in Indiranagar, Bangalore.'
}

export default function PlacesPage() {
  return <PlacesPageClient />
}