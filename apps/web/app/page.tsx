import { HeroSection } from '@/components/homepage/HeroSection'
import { FeaturedPlaces } from '@/components/homepage/FeaturedPlaces'
import { testNumber, brokenFunction } from './test-bmad-error'

export default function Home() {
  // Test BMAD auto-fix
  console.log('Test value:', testNumber)
  console.log('Test function:', brokenFunction())
  
  return (
    <>
      <HeroSection />
      <FeaturedPlaces />
    </>
  )
}
