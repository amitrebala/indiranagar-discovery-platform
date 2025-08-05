# 6. COMPANION ACTIVITIES ENGINE (NEW)

## 6.1 Smart Companion Calculation
```typescript
class CompanionEngine {
  calculateCompanions(currentPlace: Place, context: Context) {
    const companions = [];
    
    // Get nearby places (use existing data)
    const nearby = getNearbyPlaces(currentPlace, 500);
    
    for (const place of nearby) {
      const score = this.scoreCompanion(currentPlace, place, context);
      
      if (score > 0.5) {
        companions.push({
          place,
          score,
          reason: this.getReason(currentPlace, place),
          walkingTime: this.calculateWalkingTime(currentPlace, place),
          perfectTiming: this.getPerfectTiming(currentPlace, place)
        });
      }
    }
    
    return companions.sort((a, b) => b.score - a.score);
  }
  
  private scoreCompanion(from: Place, to: Place, context: Context) {
    let score = 0;
    
    // Distance (closer is better)
    const distance = calculateDistance(from.coordinates, to.coordinates);
    score += (500 - distance) / 500 * 0.3;
    
    // Category compatibility
    const compatibility = {
      'restaurant': { 'dessert': 0.9, 'cafe': 0.8, 'bar': 0.7 },
      'cafe': { 'bakery': 0.9, 'restaurant': 0.7 },
      'bar': { 'restaurant': 0.8, 'cafe': 0.6 }
    };
    
    score += (compatibility[from.category]?.[to.category] || 0.5) * 0.4;
    
    // Time compatibility
    if (this.isOpenAfter(to, from, context.time)) {
      score += 0.3;
    }
    
    return score;
  }
}
```

---
