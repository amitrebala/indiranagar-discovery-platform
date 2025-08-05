# 7. ENHANCED WEATHER FEATURES

## 7.1 Best Time Calculator
```typescript
const calculateBestTime = (place: Place) => {
  const scores = [];
  
  for (let hour = 6; hour <= 22; hour++) {
    let score = 0;
    
    // Weather score (from existing weather data)
    const weather = getHourlyWeather(hour);
    if (place.is_outdoor) {
      if (weather.temp >= 20 && weather.temp <= 28) score += 30;
      if (weather.rain_chance < 20) score += 20;
    }
    
    // Crowd score (new data point)
    const crowdLevel = estimateCrowd(place, hour);
    score += (1 - crowdLevel) * 30;
    
    // Special times
    if (hour === 7) score += 10; // Early bird bonus
    if (hour === 17) score += 15; // Golden hour
    
    scores.push({ hour, score });
  }
  
  return scores.sort((a, b) => b.score - a.score)[0];
};
```

---
