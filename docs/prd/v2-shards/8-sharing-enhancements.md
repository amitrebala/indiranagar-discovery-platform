# 8. SHARING ENHANCEMENTS

## 8.1 Instagram Story Generator
```typescript
class StoryGenerator {
  async generateStory(place: Place) {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    
    // Background image
    const img = await loadImage(place.image);
    ctx.drawImage(img, 0, 0, 1080, 1920);
    
    // Gradient overlay
    const gradient = ctx.createLinearGradient(0, 1200, 0, 1920);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1920);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Inter';
    ctx.fillText(place.name, 100, 1600);
    
    ctx.font = '48px Inter';
    ctx.fillText(`📍 ${place.area}`, 100, 1700);
    
    // Logo
    ctx.font = '36px Inter';
    ctx.fillText('Indiranagar with Amit', 100, 1850);
    
    return canvas.toDataURL('image/jpeg');
  }
}
```

---
