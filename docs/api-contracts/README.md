# API Contracts Registry

This directory contains API contract definitions for terminal coordination.

## Contract Structure

Each terminal maintains contracts for:
- **Request/Response schemas**
- **Endpoint specifications** 
- **Data models**
- **Integration points**

## Contract Files

### Terminal 1: Content & Social
- `content-api.yml` - Rich place content APIs
- `social-sharing-api.yml` - Social sharing endpoints

### Terminal 2: Map & Mobile
- `map-api.yml` - Enhanced map services
- `mobile-api.yml` - Mobile-specific endpoints

### Terminal 3: Community Engagement
- `community-api.yml` - Social suggestions and recognition APIs
- `user-management-api.yml` - Community user management

### Terminal 4: Search & Intelligence
- `search-api.yml` - Enhanced search endpoints
- `recommendations-api.yml` - Weather-aware recommendations

### Terminal 5: Backend Services
- `analytics-api.yml` - Analytics and reporting APIs
- `business-api.yml` - Business relationship management

### Terminal 6: Community Content
- `cms-api.yml` - Content management system APIs
- `events-api.yml` - Notice board and events

## Contract Validation

Contracts are validated automatically in CI/CD:
- **Schema validation** against OpenAPI 3.0
- **Breaking change detection** 
- **Cross-terminal compatibility** checks
- **Mock server generation** for testing

## Update Protocol

1. **Before API changes**: Update contract specification
2. **Create PR** with `[API-CHANGE]` prefix
3. **Notify affected terminals** via contract change notification
4. **Validate integration** tests pass with new contract
5. **Merge after approval** from affected terminal leads