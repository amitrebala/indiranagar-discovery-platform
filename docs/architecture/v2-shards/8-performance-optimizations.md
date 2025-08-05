# 8. PERFORMANCE OPTIMIZATIONS

## 8.1 Database Optimizations
```sql
-- Materialized View for Analytics
CREATE MATERIALIZED VIEW place_analytics AS
SELECT 
  p.id,
  p.name,
  COUNT(DISTINCT pv.visitor_id) as unique_views,
  AVG(r.rating) as avg_rating,
  COUNT(r.id) as rating_count,
  COUNT(c.id) as comment_count
FROM places p
LEFT JOIN page_views pv ON pv.entity_id = p.id
LEFT JOIN ratings r ON r.entity_id = p.id
LEFT JOIN comments c ON c.entity_id = p.id
GROUP BY p.id, p.name;

-- Refresh every hour
CREATE OR REPLACE FUNCTION refresh_place_analytics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY place_analytics;
END;
$$ LANGUAGE plpgsql;
```

## 8.2 API Response Optimization
```typescript
// lib/api/optimization.ts
export class APIOptimizer {
  // Pagination helper
  static paginate(query: any, page: number = 1, limit: number = 20) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    return query.range(start, end);
  }
  
  // Field selection
  static selectFields(query: any, fields: string[]) {
    return query.select(fields.join(','));
  }
  
  // Response compression
  static compress(data: any): any {
    // Remove null fields
    // Flatten nested objects where possible
    // Minimize payload size
    return JSON.parse(JSON.stringify(data, (k, v) => v ?? undefined));
  }
}
```

---
