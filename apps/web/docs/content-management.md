# Content Management Workflow

This document outlines the manual content entry and management process for the discovery platform.

## Overview

The content management system allows for adding, updating, and managing places data with the following components:
- Places with detailed information and metadata
- Companion activities (before/after recommendations)
- Image galleries with captions
- Content validation and quality checks

## Content Entry Process

### 1. Place Creation

**API Endpoint**: `POST /api/places`

**Required Fields**:
- `name`: Place name (1-255 characters)
- `description`: Detailed description (minimum 10 characters)
- `latitude`: Coordinate within Indiranagar bounds (12.95-13.00)
- `longitude`: Coordinate within Indiranagar bounds (77.58-77.65)
- `rating`: Rating from 1.0-5.0 (increments of 0.1)

**Optional Fields**:
- `category`: Place category (max 100 characters)
- `weather_suitability`: Array of weather conditions
- `accessibility_info`: Accessibility information
- `best_time_to_visit`: Recommended visit timing

**Example Request**:
```json
{
  "name": "Toit Brewpub",
  "description": "Popular craft brewery and restaurant known for its microbrews and wood-fired pizzas. Great atmosphere with indoor and outdoor seating.",
  "latitude": 12.9716,
  "longitude": 77.6412,
  "rating": 4.3,
  "category": "Restaurant & Bar",
  "weather_suitability": ["sunny", "cloudy", "cool"],
  "accessibility_info": "Ground floor accessible, limited parking",
  "best_time_to_visit": "Evening 6-10 PM"
}
```

### 2. Image Upload

**API Endpoint**: `POST /api/places/{place_id}/images`

**Process**:
1. Prepare image file (JPEG, PNG, or WebP, max 50MB)
2. Use multipart form data with fields:
   - `file`: Image file
   - `caption`: Optional description
   - `is_primary`: Boolean for primary image

**Example curl**:
```bash
curl -X POST /api/places/{place_id}/images \
  -F "file=@image.jpg" \
  -F "caption=Beautiful evening view" \
  -F "is_primary=true"
```

### 3. Companion Activities

Activities are managed through the places API during creation/update.
- `before`: Activities recommended before visiting the place
- `after`: Activities recommended after visiting the place

## Content Validation Rules

### Coordinate Validation
- Must fall within Indiranagar boundaries
- Latitude: 12.95 to 13.00
- Longitude: 77.58 to 77.65

### Rating Validation
- Scale: 1.0 to 5.0
- Precision: 0.1 increments only
- Example: 4.3 ✓, 4.35 ✗

### Image Validation
- Formats: JPEG, PNG, WebP
- Size limit: 50MB per file
- Automatic optimization and CDN delivery

### Content Quality Checks
- Name: Required, 1-255 characters
- Description: Minimum 10 characters for quality
- Weather suitability: Must use predefined conditions
- Activity timing: Positive minutes only

## Content Update Workflow

### 1. Content Review
- Regular review of place information accuracy
- Image quality and relevance checking
- Rating adjustments based on recent feedback

### 2. Batch Operations
- Use seeding script for bulk operations
- Database backup before major updates
- Validation reports for data quality

### 3. Version Control
- All updates tracked with timestamps
- Change history available in database
- Rollback capabilities through backups

## Database Seeding

### Running the Seed Script
```bash
cd apps/web
npm run seed:database
# or directly: tsx scripts/seed-database.ts
```

### Validation Check
```bash
npm run validate:data
```

## Content Backup Strategy

### Automated Backups
- Supabase provides automatic backups
- Point-in-time recovery available
- Regular backup verification

### Manual Backup Process
1. Export places data via API
2. Download images from storage
3. Store backups with date stamps
4. Test restore procedures quarterly

## Troubleshooting

### Common Issues

**Coordinate Validation Errors**:
- Verify coordinates are within Indiranagar bounds
- Use Google Maps to confirm accurate coordinates
- Check decimal precision (8 digits for latitude, 11 for longitude)

**Image Upload Failures**:
- Verify file size under 50MB
- Check file format (JPEG, PNG, WebP only)
- Ensure storage bucket permissions are correct

**Rating Validation**:
- Use only 0.1 increments (1.0, 1.1, 1.2, etc.)
- Range must be between 1.0 and 5.0
- Convert percentages: 86% = 4.3 rating

**API Connection Issues**:
- Verify Supabase environment variables
- Check database connection status
- Review API route implementations

### Data Quality Reports

Run validation to identify issues:
- Places outside coordinate boundaries
- Missing required fields
- Invalid rating values
- Broken image links

### Recovery Procedures

**Data Corruption**:
1. Stop content operations
2. Restore from latest backup
3. Validate restored data
4. Resume operations with checks

**Storage Issues**:
1. Verify storage bucket access
2. Check file permissions
3. Re-upload missing images
4. Update broken image references

## Content Standards

### Naming Conventions
- Use proper case for place names
- Include descriptive suffixes (e.g., "Restaurant", "Park")
- Avoid special characters in names

### Description Guidelines
- Minimum 10 characters, aim for 50-200 words
- Include key features and atmosphere
- Mention accessibility and parking
- Note best visit times

### Image Standards
- High quality, well-lit photos
- Show place character and atmosphere
- Include both interior and exterior views
- Maintain consistent style across places

### Category Consistency
- Use standardized categories
- Common categories: Restaurant & Bar, Shopping Mall, Park & Recreation, Historical Landmark
- Maintain category list for consistency