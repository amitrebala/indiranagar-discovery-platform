import { createClient } from '../lib/supabase/client'
import { writeFileSync } from 'fs'
import { join } from 'path'

interface BackupResult {
  success: boolean
  timestamp: string
  counts: {
    places: number
    activities: number
    images: number
  }
  filename?: string
  error?: string
}

export async function backupContent(): Promise<BackupResult> {
  const supabase = createClient()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  
  try {
    console.log('🗄️ Starting content backup...')
    
    // Fetch all places with related data
    const { data: places, error: placesError } = await supabase
      .from('places')
      .select(`
        *,
        companion_activities (*),
        place_images (*)
      `)
      .order('created_at')
    
    if (placesError) {
      throw new Error(`Failed to fetch places: ${placesError.message}`)
    }
    
    // Count totals
    const counts = {
      places: places?.length || 0,
      activities: places?.reduce((sum, place) => sum + (place.companion_activities?.length || 0), 0) || 0,
      images: places?.reduce((sum, place) => sum + (place.place_images?.length || 0), 0) || 0
    }
    
    // Create backup object
    const backup = {
      metadata: {
        timestamp,
        version: '1.0',
        source: 'content-backup-script',
        counts
      },
      places: places || []
    }
    
    // Write to file
    const filename = `backup-${timestamp}.json`
    const filepath = join(process.cwd(), 'backups', filename)
    
    // Ensure backups directory exists
    try {
      writeFileSync(filepath, JSON.stringify(backup, null, 2))
    } catch (writeError) {
      // Try creating backups directory
      const { mkdirSync } = require('fs')
      mkdirSync(join(process.cwd(), 'backups'), { recursive: true })
      writeFileSync(filepath, JSON.stringify(backup, null, 2))
    }
    
    console.log(`✅ Backup completed successfully`)
    console.log(`📁 File: ${filename}`)
    console.log(`📊 Content: ${counts.places} places, ${counts.activities} activities, ${counts.images} images`)
    
    return {
      success: true,
      timestamp,
      counts,
      filename
    }
    
  } catch (error) {
    console.error('❌ Backup failed:', error)
    return {
      success: false,
      timestamp,
      counts: { places: 0, activities: 0, images: 0 },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export async function restoreContent(filename: string): Promise<BackupResult> {
  const supabase = createClient()
  const timestamp = new Date().toISOString()
  
  try {
    console.log(`🔄 Starting content restore from ${filename}...`)
    
    // Read backup file
    const { readFileSync } = require('fs')
    const filepath = join(process.cwd(), 'backups', filename)
    const backupData = JSON.parse(readFileSync(filepath, 'utf8'))
    
    if (!backupData.places || !Array.isArray(backupData.places)) {
      throw new Error('Invalid backup file format')
    }
    
    console.log('🧹 Clearing existing content...')
    
    // Clear existing data
    await supabase.from('companion_activities').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('place_images').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('places').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    let totalActivities = 0
    let totalImages = 0
    
    console.log('📥 Restoring places...')
    
    // Restore each place with its related data
    for (const placeData of backupData.places) {
      const { companion_activities, place_images, ...place } = placeData
      
      // Insert place
      const { data: insertedPlace, error: placeError } = await supabase
        .from('places')
        .insert([place])
        .select()
        .single()
      
      if (placeError) {
        console.warn(`⚠️ Failed to restore place ${place.name}: ${placeError.message}`)
        continue
      }
      
      // Insert companion activities
      if (companion_activities && companion_activities.length > 0) {
        const activities = companion_activities.map((activity: any) => ({
          ...activity,
          place_id: insertedPlace.id
        }))
        
        const { error: activitiesError } = await supabase
          .from('companion_activities')
          .insert(activities)
        
        if (!activitiesError) {
          totalActivities += activities.length
        }
      }
      
      // Insert place images
      if (place_images && place_images.length > 0) {
        const images = place_images.map((image: any) => ({
          ...image,
          place_id: insertedPlace.id
        }))
        
        const { error: imagesError } = await supabase
          .from('place_images')
          .insert(images)
        
        if (!imagesError) {
          totalImages += images.length
        }
      }
    }
    
    const counts = {
      places: backupData.places.length,
      activities: totalActivities,
      images: totalImages
    }
    
    console.log('✅ Restore completed successfully')
    console.log(`📊 Restored: ${counts.places} places, ${counts.activities} activities, ${counts.images} images`)
    
    return {
      success: true,
      timestamp,
      counts
    }
    
  } catch (error) {
    console.error('❌ Restore failed:', error)
    return {
      success: false,
      timestamp,
      counts: { places: 0, activities: 0, images: 0 },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Content versioning functions
export async function createContentVersion(description: string) {
  const backup = await backupContent()
  
  if (backup.success) {
    console.log(`📋 Content version created: ${backup.filename}`)
    console.log(`📝 Description: ${description}`)
    
    // Could store version metadata in database here
    return {
      version: backup.timestamp,
      filename: backup.filename,
      description,
      counts: backup.counts
    }
  }
  
  throw new Error('Failed to create content version')
}

// Run backup if called directly
if (require.main === module) {
  const description = process.argv[2] || 'Manual backup'
  
  if (process.argv.includes('--restore')) {
    const filename = process.argv[3]
    if (!filename) {
      console.error('❌ Please provide backup filename to restore')
      process.exit(1)
    }
    restoreContent(filename).then(result => {
      process.exit(result.success ? 0 : 1)
    })
  } else {
    backupContent().then(result => {
      process.exit(result.success ? 0 : 1)
    })
  }
}