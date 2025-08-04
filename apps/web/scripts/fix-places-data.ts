import fs from 'fs'
import path from 'path'

// Read the file
const filePath = path.join(__dirname, '../data/amit-places-complete.ts')
let content = fs.readFileSync(filePath, 'utf-8')

// Add has_amit_visited: true to each place object
// Match pattern: best_time_to_visit: "....."
// Replace with: best_time_to_visit: ".....",\n    has_amit_visited: true
content = content.replace(
  /best_time_to_visit: "([^"]+)"/g,
  'best_time_to_visit: "$1",\n    has_amit_visited: true'
)

// Write back the file
fs.writeFileSync(filePath, content)

console.log('✅ Added has_amit_visited: true to all places')