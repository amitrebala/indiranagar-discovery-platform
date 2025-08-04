import fs from 'fs'
import path from 'path'

// Files to fix
const filesToFix = [
  '../data/amit-real-visited-places.ts',
  '../scripts/seed-amit-places.ts',
  '../scripts/seed-database.ts'
]

filesToFix.forEach(relativePath => {
  const filePath = path.join(__dirname, relativePath)
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }
  
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false
  
  // Add has_amit_visited: true after best_time_to_visit if it doesn't exist
  // Match pattern: best_time_to_visit: "....." followed by } (end of object)
  content = content.replace(
    /best_time_to_visit: "([^"]+)"\s*\n\s*\}/g,
    (match, timeValue) => {
      // Check if has_amit_visited already exists in this object
      if (!match.includes('has_amit_visited')) {
        modified = true
        return `best_time_to_visit: "${timeValue}",\n    has_amit_visited: true\n  }`
      }
      return match
    }
  )
  
  if (modified) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Fixed ${relativePath}`)
  } else {
    console.log(`ℹ️  No changes needed for ${relativePath}`)
  }
})

console.log('\n✅ All seed files fixed!')