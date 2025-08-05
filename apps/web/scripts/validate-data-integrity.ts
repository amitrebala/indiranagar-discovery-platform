#!/usr/bin/env tsx
/**
 * Data Integrity Validation Script
 * 
 * Ensures database only contains Amit's real visited places
 * and provides ongoing validation capabilities.
 */

import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { createClient } from '../lib/supabase/client'
import { amitRealVisitedPlaces } from '../data/amit-real-visited-places'

interface ValidationReport {
  totalPlaces: number
  validPlaces: string[]
  invalidPlaces: string[]
  missingPlaces: string[]
  duplicatePlaces: string[]
  suspiciousPatterns: string[]
}

async function validateDataIntegrity(): Promise<ValidationReport> {
  const supabase = createClient()
  
  console.log('🔍 Running Data Integrity Validation...\n')
  
  // Get all places from database
  const { data: dbPlaces, error } = await supabase
    .from('places')
    .select('id, name, category, rating')
    .order('name')
  
  if (error) {
    throw new Error(`Failed to fetch places: ${error.message}`)
  }
  
  const report: ValidationReport = {
    totalPlaces: dbPlaces?.length || 0,
    validPlaces: [],
    invalidPlaces: [],
    missingPlaces: [],
    duplicatePlaces: [],
    suspiciousPatterns: []
  }
  
  // Create normalized maps for comparison
  const realPlacesMap = new Map(
    amitRealVisitedPlaces.map(p => [
      p.name.toLowerCase().trim(),
      p
    ])
  )
  
  const dbPlacesMap = new Map<string, typeof dbPlaces[0][]>()
  
  // Check each database place
  for (const place of dbPlaces || []) {
    const normalizedName = place.name.toLowerCase().trim()
    
    // Check for duplicates
    if (dbPlacesMap.has(normalizedName)) {
      report.duplicatePlaces.push(place.name)
      dbPlacesMap.get(normalizedName)!.push(place)
    } else {
      dbPlacesMap.set(normalizedName, [place])
    }
    
    // Check if place exists in real data
    if (realPlacesMap.has(normalizedName)) {
      report.validPlaces.push(place.name)
    } else {
      report.invalidPlaces.push(place.name)
    }
    
    // Check for suspicious patterns
    const suspiciousKeywords = [
      'test', 'demo', 'sample', 'example', 'dummy',
      'placeholder', 'lorem', 'ipsum', 'foo', 'bar'
    ]
    
    if (suspiciousKeywords.some(keyword => 
      normalizedName.includes(keyword)
    )) {
      report.suspiciousPatterns.push(place.name)
    }
  }
  
  // Find missing places
  for (const [name, realPlace] of realPlacesMap) {
    if (!dbPlacesMap.has(name)) {
      report.missingPlaces.push(realPlace.name)
    }
  }
  
  // Print report
  console.log('📊 Validation Report:')
  console.log(`   Total places in database: ${report.totalPlaces}`)
  console.log(`   Valid places: ${report.validPlaces.length}`)
  console.log(`   Invalid places: ${report.invalidPlaces.length}`)
  console.log(`   Missing places: ${report.missingPlaces.length}`)
  console.log(`   Duplicate entries: ${report.duplicatePlaces.length}`)
  console.log(`   Suspicious patterns: ${report.suspiciousPatterns.length}`)
  
  if (report.invalidPlaces.length > 0) {
    console.log('\n❌ Invalid places found:')
    report.invalidPlaces.forEach(name => console.log(`   - ${name}`))
  }
  
  if (report.missingPlaces.length > 0) {
    console.log('\n⚠️  Missing places:')
    report.missingPlaces.slice(0, 10).forEach(name => console.log(`   - ${name}`))
    if (report.missingPlaces.length > 10) {
      console.log(`   ... and ${report.missingPlaces.length - 10} more`)
    }
  }
  
  if (report.duplicatePlaces.length > 0) {
    console.log('\n🔄 Duplicate entries:')
    report.duplicatePlaces.forEach(name => console.log(`   - ${name}`))
  }
  
  if (report.suspiciousPatterns.length > 0) {
    console.log('\n🚨 Suspicious patterns detected:')
    report.suspiciousPatterns.forEach(name => console.log(`   - ${name}`))
  }
  
  const isValid = report.invalidPlaces.length === 0 && 
                  report.duplicatePlaces.length === 0 &&
                  report.suspiciousPatterns.length === 0
  
  console.log(isValid ? '\n✅ Data integrity check PASSED!' : '\n❌ Data integrity check FAILED!')
  
  return report
}

// Export for use in other scripts
export { validateDataIntegrity }

// Run if called directly
if (require.main === module) {
  validateDataIntegrity()
    .then(report => {
      process.exit(report.invalidPlaces.length === 0 ? 0 : 1)
    })
    .catch(err => {
      console.error('❌ Validation failed:', err)
      process.exit(1)
    })
}