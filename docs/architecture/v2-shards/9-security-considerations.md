# 9. SECURITY CONSIDERATIONS

## 9.1 Security Measures
```typescript
// lib/security/index.ts
export class Security {
  // Rate limiting for comments/ratings
  static async checkRateLimit(ip: string, action: string): Promise<boolean> {
    const key = `ratelimit:${action}:${ip}`;
    const count = await CacheManager.get(key) || 0;
    
    if (count >= 10) { // 10 actions per hour
      return false;
    }
    
    await CacheManager.set(key, count + 1, 3600);
    return true;
  }
  
  // Input sanitization
  static sanitizeInput(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
      ALLOWED_ATTR: ['href']
    });
  }
  
  // IP anonymization for GDPR
  static anonymizeIP(ip: string): string {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0'; // Zero out last octet
    }
    return parts.join('.');
  }
}
```

## 9.2 Admin Security
- Password hashed with bcrypt (min 12 rounds)
- JWT tokens with 24-hour expiry
- HTTPS-only cookies for token storage
- CSRF protection on all admin routes
- Audit logging for all admin actions

---
