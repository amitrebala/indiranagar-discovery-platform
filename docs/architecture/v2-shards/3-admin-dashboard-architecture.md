# 3. ADMIN DASHBOARD ARCHITECTURE

## 3.1 Authentication Strategy
**Approach**: Server-side password verification with JWT session tokens

```typescript
// lib/admin/auth.ts
export class AdminAuth {
  private static readonly ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  private static readonly JWT_SECRET = process.env.JWT_SECRET;
  
  static async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.ADMIN_PASSWORD_HASH);
  }
  
  static generateToken(): string {
    return jwt.sign(
      { role: 'admin', exp: Date.now() + 24 * 60 * 60 * 1000 },
      this.JWT_SECRET
    );
  }
  
  static verifyToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return decoded.role === 'admin' && decoded.exp > Date.now();
    } catch {
      return false;
    }
  }
}
```

## 3.2 Admin Middleware
```typescript
// middleware.ts (addition to existing)
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token');
    
    if (!token || !AdminAuth.verifyToken(token.value)) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
```

## 3.3 Admin API Routes Structure
```
app/api/admin/
├── auth/
│   └── route.ts           # POST: Login endpoint
├── places/
│   ├── route.ts          # GET/POST: List and create
│   └── [id]/
│       └── route.ts      # PUT/DELETE: Update and delete
├── analytics/
│   └── route.ts          # GET: Analytics data
├── settings/
│   └── route.ts          # GET/PUT: Platform settings
└── export/
    └── route.ts          # POST: Export data
```

---
