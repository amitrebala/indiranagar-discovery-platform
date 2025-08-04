import { ImageSourceManager } from '../lib/services/image-sources'

async function testImageDiscovery() {
  console.log('Testing Image Discovery System...\n')

  // Check if Unsplash key is configured
  const unsplashKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  if (!unsplashKey) {
    console.error('❌ NEXT_PUBLIC_UNSPLASH_ACCESS_KEY is not set in environment variables')
    console.log('Please add it to your .env.local file')
    return
  }

  console.log('✅ Unsplash API key found\n')

  // Initialize the image source manager
  const manager = new ImageSourceManager()
  const availableSources = manager.getAvailableSources()
  
  console.log(`Available image sources: ${availableSources.join(', ')}\n`)

  // Test searches
  const testQueries = [
    'Corner House Ice Cream Bangalore',
    'Indiranagar Metro Station',
    'Church Street Social',
  ]

  for (const query of testQueries) {
    console.log(`\nSearching for: "${query}"`)
    console.log('-'.repeat(50))
    
    try {
      const results = await manager.findImages(query, { limit: 3 })
      
      if (results.length === 0) {
        console.log('No images found')
      } else {
        results.forEach((image, index) => {
          console.log(`\nResult ${index + 1}:`)
          console.log(`  URL: ${image.url}`)
          console.log(`  Size: ${image.width}x${image.height}`)
          console.log(`  Attribution: ${image.attribution.author} via ${image.attribution.source}`)
          console.log(`  Relevance Score: ${(image.relevanceScore || 0).toFixed(2)}`)
          if (image.tags && image.tags.length > 0) {
            console.log(`  Tags: ${image.tags.slice(0, 5).join(', ')}`)
          }
        })
      }
    } catch (error) {
      console.error(`Error searching for "${query}":`, error)
    }
  }

  console.log('\n\nImage discovery test completed!')
}

// Run the test
testImageDiscovery().catch(console.error)