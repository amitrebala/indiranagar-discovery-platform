# Story: Admin Authentication System
**Story ID:** V2-P1-001  
**Priority:** P0 - CRITICAL (Must be done first)  
**Estimated Hours:** 4-6 hours  
**Dependencies:** None (This is the first story)

---

## 📋 Context Documents

Load these specific shards for implementation:
- **PRD:** `/docs/prd/v2-shards/1-comprehensive-admin-dashboard-new-priority.md` (Section 1.1 only)
- **UX:** `/docs/ux/v2-shards/2-admin-dashboard-interface.md` (Section 2.1 only)
- **Architecture:** `/docs/architecture/v2-shards/3-admin-dashboard-architecture.md` (Sections 3.1-3.2)
- **Database:** `/docs/architecture/v2-shards/4-database-schema-extensions.md` (admin_settings table only)

---

## 🎯 Acceptance Criteria

- [ ] Password-based authentication for `/admin/*` routes
- [ ] Session persists for 24 hours using JWT tokens
- [ ] Environment variable for admin password hash
- [ ] Middleware blocks unauthorized access to all `/admin` routes
- [ ] Login page with simple password field
- [ ] Logout functionality clears session
- [ ] Secure cookie storage for JWT token
- [ ] Redirect to login when session expires

---

## 💻 Implementation Instructions

### Step 1: Install Dependencies
```bash
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### Step 2: Create Environment Variables
Add to `.env.local`:
```env
ADMIN_PASSWORD_HASH=$2a$12$YourHashHere
JWT_SECRET=your-random-32-character-string-here
```

Generate password hash:
```bash
# Run in Node.js console or create a script
const bcrypt = require('bcryptjs');
const password = 'your-admin-password';
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
```

### Step 3: Create Admin Auth Library
Create `/lib/admin/auth.ts`:
```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AdminAuth {
  private static readonly ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH!;
  private static readonly JWT_SECRET = process.env.JWT_SECRET!;
  
  static async verifyPassword(password: string): Promise<boolean> {
    if (!this.ADMIN_PASSWORD_HASH) {
      console.error('ADMIN_PASSWORD_HASH not set');
      return false;
    }
    return await bcrypt.compare(password, this.ADMIN_PASSWORD_HASH);
  }
  
  static generateToken(): string {
    return jwt.sign(
      { 
        role: 'admin', 
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
      },
      this.JWT_SECRET
    );
  }
  
  static verifyToken(token: string): boolean {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return decoded.role === 'admin';
    } catch (error) {
      return false;
    }
  }
}
```

### Step 4: Create Middleware
Update or create `/middleware.ts`:
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function middleware(request: NextRequest) {
  // Only check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Check for auth token
    const token = request.cookies.get('admin-token');
    
    if (!token || !AdminAuth.verifyToken(token.value)) {
      // Redirect to login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
};
```

### Step 5: Create Login API Route
Create `/app/api/admin/auth/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { AdminAuth } from '@/lib/admin/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      );
    }
    
    const isValid = await AdminAuth.verifyPassword(password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }
    
    const token = AdminAuth.generateToken();
    
    // Create response with cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Logout endpoint
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin-token');
  return response;
}
```

### Step 6: Create Login Page
Create `/app/admin/login/page.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to intended page
      router.push(from);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Admin Access</h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter password to access admin dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Enter admin password"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Step 7: Create Admin Layout
Create `/app/admin/layout.tsx`:
```typescript
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AdminAuth } from '@/lib/admin/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a secondary check, middleware should handle most cases
  const cookieStore = cookies();
  const token = cookieStore.get('admin-token');
  
  // The middleware should handle this, but double-check
  if (!token || !AdminAuth.verifyToken(token.value)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

// Client component for logout
function LogoutButton() {
  'use client';
  
  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };
  
  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-gray-900"
    >
      Logout
    </button>
  );
}
```

### Step 8: Create Placeholder Dashboard
Create `/app/admin/dashboard/page.tsx`:
```typescript
export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <p className="text-gray-600">
              Authentication system successfully implemented.
              Dashboard features will be added in the next story.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Testing Instructions

### Manual Testing Steps:
1. **Test Unauthorized Access:**
   ```bash
   # Try to access admin without login
   curl http://localhost:3000/admin/dashboard
   # Should redirect to /admin/login
   ```

2. **Test Login Flow:**
   - Navigate to `/admin/login`
   - Enter incorrect password → Should show error
   - Enter correct password → Should redirect to dashboard

3. **Test Session Persistence:**
   - Login successfully
   - Close browser tab
   - Reopen `/admin/dashboard` → Should still be logged in

4. **Test Logout:**
   - Click logout button
   - Try to access `/admin/dashboard` → Should redirect to login

### Automated Test:
Create `__tests__/admin/auth.test.ts`:
```typescript
import { AdminAuth } from '@/lib/admin/auth';

describe('Admin Authentication', () => {
  test('verifies correct password', async () => {
    // Test with known hash
    process.env.ADMIN_PASSWORD_HASH = '$2a$12$KIXxPfPB.P1ZnYLz9yYgZu.J6KfLr.4Qr/TgLhGxqXB3oj3kYhyDq';
    const result = await AdminAuth.verifyPassword('testpassword');
    expect(result).toBe(true);
  });
  
  test('rejects incorrect password', async () => {
    const result = await AdminAuth.verifyPassword('wrongpassword');
    expect(result).toBe(false);
  });
  
  test('generates and verifies JWT token', () => {
    process.env.JWT_SECRET = 'test-secret-key';
    const token = AdminAuth.generateToken();
    expect(AdminAuth.verifyToken(token)).toBe(true);
  });
});
```

---

## ✅ Definition of Done

- [ ] Code implemented and committed
- [ ] Environment variables set
- [ ] Manual testing completed
- [ ] Automated tests passing
- [ ] No TypeScript errors
- [ ] Middleware protecting all `/admin` routes
- [ ] Login/logout flow working
- [ ] Session persists for 24 hours

---

## 🚀 Next Story

Once this story is complete, proceed to:
- **Story V2-P1-002:** Dashboard Home Page

---

## 💡 Dev Notes

- Keep the auth simple - no need for complex user management
- Use httpOnly cookies for security
- The middleware runs on every request, keep it lightweight
- Password hash is generated once and stored in env
- JWT secret should be at least 32 characters

---

## 🤖 Auto-Implementation Prompt

```
I need to implement the Admin Authentication System for the Indiranagar Discovery Platform.

Context files to load:
- /docs/prd/v2-shards/1-comprehensive-admin-dashboard-new-priority.md (Section 1.1)
- /docs/ux/v2-shards/2-admin-dashboard-interface.md (Section 2.1)
- /docs/architecture/v2-shards/3-admin-dashboard-architecture.md (Sections 3.1-3.2)

Please implement the complete authentication system following the implementation instructions above.
Create all files listed and ensure the middleware protects /admin routes with JWT-based authentication.
```

---

*Story Version: 1.0*
*Last Updated: Current Date*
*Author: Scrum Master Agent*