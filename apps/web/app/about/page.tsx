import { Metadata } from 'next'
import { AboutContent } from '@/components/about/AboutContent'

export const metadata: Metadata = {
  title: 'About Amit | Indiranagar with Amit',
  description: 'Learn about the curator behind Indiranagar with Amit and why I created this personal guide to Bangalore\'s most vibrant neighborhood.'
}

export default function AboutPage() {
  return <AboutContent />
}