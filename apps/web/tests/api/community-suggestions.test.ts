import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          gte: vi.fn(() => ({ data: [] }))
        })),
        order: vi.fn(() => ({
          range: vi.fn(() => ({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({ 
            data: { 
              id: 'test-123', 
              place_name: 'Test Place', 
              status: 'submitted' 
            }, 
            error: null 
          }))
        }))
      })),
      upsert: vi.fn(() => ({ data: null, error: null }))
    }))
  }))
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn()
}));

describe('/api/community-suggestions', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase = (require('@supabase/auth-helpers-nextjs').createRouteHandlerClient as any)();
  });

  describe('POST /api/community-suggestions', () => {
    it('should create a new suggestion with valid data', async () => {
      const validSuggestionData = {
        submitter_name: 'John Doe',
        submitter_email: 'john@example.com',
        place_name: 'Amazing Cafe',
        suggested_latitude: 12.97,
        suggested_longitude: 77.59,
        category: 'cafe',
        personal_notes: 'Great coffee and atmosphere'
      };

      const request = new NextRequest('http://localhost:3000/api/community-suggestions', {
        method: 'POST',
        body: JSON.stringify(validSuggestionData)
      });

      // Import the handler dynamically to avoid module loading issues
      const { POST } = await import('@/app/api/community-suggestions/route');
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.success).toBe(true);
      expect(result.suggestion.id).toBe('test-123');
      expect(mockSupabase.from).toHaveBeenCalledWith('community_place_suggestions');
    });

    it('should validate input data', async () => {
      const invalidData = {
        submitter_name: 'J', // Too short
        submitter_email: 'invalid-email',
        place_name: '',
        category: 'invalid-category'
      };

      const request = new NextRequest('http://localhost:3000/api/community-suggestions', {
        method: 'POST',
        body: JSON.stringify(invalidData)
      });

      const { POST } = await import('@/app/api/community-suggestions/route');
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(400);
      expect(result.error).toBe('Invalid input data');
      expect(result.details).toBeDefined();
    });

    it('should enforce rate limiting', async () => {
      // Mock rate limit exceeded
      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            gte: vi.fn(() => ({ 
              data: [{ id: '1' }, { id: '2' }, { id: '3' }] // 3 recent suggestions
            }))
          }))
        }))
      });

      const validData = {
        submitter_name: 'John Doe',
        submitter_email: 'john@example.com',
        place_name: 'Test Place',
        suggested_latitude: 12.97,
        suggested_longitude: 77.59,
        category: 'cafe',
        personal_notes: 'Test description'
      };

      const request = new NextRequest('http://localhost:3000/api/community-suggestions', {
        method: 'POST',
        body: JSON.stringify(validData)
      });

      const { POST } = await import('@/app/api/community-suggestions/route');
      const response = await POST(request);
      const result = await response.json();

      expect(response.status).toBe(429);
      expect(result.error).toBe('Rate limit exceeded. Maximum 3 suggestions per day.');
    });
  });

  describe('GET /api/community-suggestions', () => {
    it('should fetch suggestions with default parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/community-suggestions');

      const { GET } = await import('@/app/api/community-suggestions/route');
      const response = await GET(request);
      const result = await response.json();

      expect(response.status).toBe(200);
      expect(result.suggestions).toBeDefined();
      expect(mockSupabase.from).toHaveBeenCalledWith('community_place_suggestions');
    });

    it('should filter by status when provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/community-suggestions?status=approved');

      const { GET } = await import('@/app/api/community-suggestions/route');
      await GET(request);

      // Verify that eq was called with the status filter
      expect(mockSupabase.from().select().eq).toHaveBeenCalled();
    });

    it('should handle pagination parameters', async () => {
      const request = new NextRequest('http://localhost:3000/api/community-suggestions?limit=10&offset=5');

      const { GET } = await import('@/app/api/community-suggestions/route');
      await GET(request);

      // Verify that range was called with correct parameters
      expect(mockSupabase.from().select().order().range).toHaveBeenCalledWith(5, 14);
    });
  });
});