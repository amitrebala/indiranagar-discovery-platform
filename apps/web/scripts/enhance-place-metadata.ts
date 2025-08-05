import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Place enhancement data
const placeEnhancements = [
  {
    namePattern: '%Corner House%',
    updates: {
      brand_name: 'Corner House',
      establishment_type: 'ice-cream-parlor',
      search_keywords: ['corner house', 'ice cream parlor', 'death by chocolate', 'sundae', 'hot chocolate fudge'],
      metadata: {
        businessInfo: { isChain: true, parentBrand: 'Corner House' },
        searchHints: {
          mustIncludeTerms: ['Corner House'],
          avoidTerms: ['corner', 'house', 'home'],
          locationQualifiers: ['Indiranagar', 'Bangalore']
        }
      }
    }
  },
  {
    namePattern: '%Metro Station%',
    updates: {
      establishment_type: 'metro-station',
      search_keywords: ['namma metro', 'purple line', 'metro station', 'indiranagar metro', 'bangalore metro'],
      metadata: {
        searchHints: {
          mustIncludeTerms: ['Indiranagar Metro', 'Namma Metro'],
          locationQualifiers: ['Bangalore', 'Purple Line'],
          avoidTerms: ['delhi metro', 'mumbai metro', 'chennai metro']
        }
      }
    }
  },
  {
    namePattern: '%Church Street Social%',
    updates: {
      brand_name: 'Social',
      establishment_type: 'gastropub',
      search_keywords: ['social', 'gastropub', 'church street social', 'bar', 'restaurant', 'nightlife'],
      metadata: {
        businessInfo: { isChain: true, parentBrand: 'Social' },
        searchHints: {
          mustIncludeTerms: ['Church Street Social', 'Social gastropub'],
          locationQualifiers: ['Bangalore', 'Church Street'],
          avoidTerms: ['church', 'street', 'religious']
        }
      }
    }
  },
  {
    namePattern: '%Toit%',
    updates: {
      brand_name: 'Toit',
      establishment_type: 'brewpub',
      search_keywords: ['toit', 'brewery', 'brewpub', 'craft beer', 'restaurant'],
      metadata: {
        businessInfo: { isChain: false, parentBrand: 'Toit' },
        searchHints: {
          mustIncludeTerms: ['Toit brewpub'],
          locationQualifiers: ['Indiranagar', 'Bangalore'],
          avoidTerms: ['toy', 'detroit']
        }
      }
    }
  },
  {
    namePattern: '%Glen%',
    updates: {
      brand_name: 'Glen\'s Bakehouse',
      establishment_type: 'bakery',
      search_keywords: ['glens bakehouse', 'bakery', 'cafe', 'coffee', 'pastries'],
      metadata: {
        businessInfo: { isChain: true, parentBrand: 'Glen\'s Bakehouse' },
        searchHints: {
          mustIncludeTerms: ['Glen\'s Bakehouse'],
          locationQualifiers: ['Indiranagar', 'Bangalore'],
          avoidTerms: ['glen', 'valley']
        }
      }
    }
  },
  {
    namePattern: '%Starbucks%',
    updates: {
      brand_name: 'Starbucks',
      establishment_type: 'coffee-shop',
      search_keywords: ['starbucks', 'coffee', 'cafe', 'coffee shop'],
      metadata: {
        businessInfo: { isChain: true, parentBrand: 'Starbucks' },
        searchHints: {
          mustIncludeTerms: ['Starbucks'],
          locationQualifiers: ['Indiranagar', 'Bangalore'],
          avoidTerms: ['star', 'bucks']
        }
      }
    }
  }
]

async function enhancePlaceMetadata() {
  console.log('Enhancing place metadata...')

  for (const enhancement of placeEnhancements) {
    try {
      // Find places matching the pattern
      const { data: places, error: fetchError } = await supabase
        .from('places')
        .select('id, name')
        .ilike('name', enhancement.namePattern)

      if (fetchError) {
        console.error(`Error fetching places for pattern ${enhancement.namePattern}:`, fetchError)
        continue
      }

      if (!places || places.length === 0) {
        console.log(`No places found matching pattern: ${enhancement.namePattern}`)
        continue
      }

      console.log(`Found ${places.length} places matching ${enhancement.namePattern}`)

      // Update each place
      for (const place of places) {
        const { error: updateError } = await supabase
          .from('places')
          .update(enhancement.updates)
          .eq('id', place.id)

        if (updateError) {
          console.error(`Error updating place ${place.name}:`, updateError)
        } else {
          console.log(`✓ Updated: ${place.name}`)
        }
      }
    } catch (error) {
      console.error(`Error processing enhancement for ${enhancement.namePattern}:`, error)
    }
  }

  console.log('\\nMetadata enhancement complete!')
}

// Run the enhancement
enhancePlaceMetadata()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })