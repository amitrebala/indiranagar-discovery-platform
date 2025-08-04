# Multi-Terminal Development Collaboration Guide

## Terminal Coordination Structure

This project uses a **3 dev+QA terminal + 1 orchestrator terminal** approach with integrated coordination mechanisms based on Epic 1 completion and deferred items.

### Terminal Assignments

#### Terminal 1: Enhanced Experience & Intelligence 
**Dev Agent + QA Agent Working Together**
- **Epic 1 Deferred**: Weather UI integration, Enhanced testing infrastructure
- **Epic 2+ Stories**: 2.1 (Enhanced Map), 2.4 (Enhanced Search), 4.1 (Weather Recommendations)
- **Team**: Full-stack Developer + QA Specialist + Testing Engineer
- **Focus**: Map enhancements, search intelligence, weather-aware recommendations
- **Dependencies**: Epic 1 weather API (✅ complete), map foundation (✅ complete)
- **Coordination Points**: Map components, Search APIs, Weather integration UI
- **Collaboration**: Updates API contracts, shares map components with other terminals

#### Terminal 2: Community & Social Platform
**Dev Agent + QA Agent Working Together**  
- **Epic 1 Deferred**: Admin interface, email notifications, FAQ system
- **Epic 3+ Stories**: 3.1 (Social Suggestions), 3.2 (Notice Board), 3.3 (Enhanced Community), 3.4 (Social Sharing), 3.5 (Community Recognition)
- **Team**: Backend Developer + Frontend Developer + Community QA Specialist
- **Focus**: Complete community features, social engagement, content management
- **Dependencies**: Epic 1 community question foundation (✅ complete)
- **Coordination Points**: Community APIs, Social sharing endpoints, Admin interfaces
- **Collaboration**: Provides user-generated content APIs, shares community components

#### Terminal 3: Content & Business Intelligence
**Dev Agent + QA Agent Working Together**
- **Epic 2+ Stories**: 2.2 (Rich Place Content), 2.3 (Companion Activities), 2.5 (Mobile Experience), 4.2 (News Commentary), 4.3 (Business Relationships), 4.5 (Analytics)
- **Team**: Content Developer + Business Developer + Analytics QA Specialist  
- **Focus**: Rich content systems, business intelligence, mobile optimization, analytics
- **Dependencies**: Epic 1 place database (✅ complete), content structure (✅ complete)
- **Coordination Points**: Content APIs, Analytics endpoints, Mobile components
- **Collaboration**: Provides content for other terminals, shares mobile optimizations

#### Terminal 4: Orchestrator & Strategic Coordination
**Your Direct Interface**
- **Role**: Project coordination, strategic planning, progress monitoring
- **Capabilities**: Monitor all 3 terminals, provide guidance, make architectural decisions
- **Tools**: Coordination dashboard, workflow management, strategic planning
- **Communication**: Direct interface with you for real-time decision making
- **Responsibilities**: Resolve blockers, coordinate integration, plan ahead

## Coordination Protocols

### Epic 1 Completion Status ✅
- **Foundation Complete**: Next.js, Supabase, place database, basic map, weather API backend
- **Deferred Items**: Weather UI, admin interface, email notifications, E2E testing, CI/CD
- **Integration Points**: Deferred items distributed across appropriate terminals

### Daily Integration Checkpoints
- **Time**: 9:00 AM daily
- **Duration**: 15 minutes  
- **Participants**: 3 terminal dev+QA leads + orchestrator
- **Purpose**: API contract sync, dependency resolution, Epic 1 deferred item completion

### Integration Branch Strategy
```
main
├── develop
    ├── terminal-1-content-social
    ├── terminal-2-map-mobile
    ├── terminal-3-community-engagement
    ├── terminal-4-search-intelligence
    ├── terminal-5-backend-services
    └── terminal-6-community-content
```

### API Contract Registry
- **Location**: `/docs/api-contracts/`
- **Format**: OpenAPI 3.0 specifications
- **Update Protocol**: Any API changes must update contracts before merge
- **Validation**: Automated contract testing in CI/CD

### Testing Coordination
- **Unit Tests**: Each terminal maintains own test suite
- **Integration Tests**: Cross-terminal tests run on integration branch
- **E2E Tests**: Full workflow tests after all terminals integrate

### Performance Coordination
- **Budget**: Shared performance budget tracked in CI
- **Monitoring**: Each terminal contributes to shared performance metrics
- **Baseline**: Established performance baseline for coordination validation

## Commands for Terminal Coordination

### Start Terminal Development
```bash
# Terminal 1: Enhanced Experience & Intelligence
*workflow enhanced-experience-intelligence --phase="development" --epic-1-deferred="weather-ui,testing-infrastructure" --epic-2-plus="2.1,2.4,4.1" --team-composition="fullstack-dev,qa-specialist,testing-engineer" --collaboration-mode="integrated-dev-qa"

# Terminal 2: Community & Social Platform
*workflow community-social-platform --phase="development" --epic-1-deferred="admin-interface,email-notifications,faq-system" --epic-3-plus="3.1,3.2,3.3,3.4,3.5" --team-composition="backend-dev,frontend-dev,community-qa" --collaboration-mode="integrated-dev-qa"

# Terminal 3: Content & Business Intelligence  
*workflow content-business-intelligence --phase="development" --epic-2-plus="2.2,2.3,2.5,4.2,4.3,4.5" --team-composition="content-dev,business-dev,analytics-qa" --collaboration-mode="integrated-dev-qa"

# Terminal 4: Orchestrator & Strategic Coordination
*workflow orchestrator-coordination --role="strategic-coordination" --capabilities="terminal-monitoring,workflow-management,architectural-decisions" --tools="coordination-dashboard,progress-tracking,integration-management"
```

### Coordination Commands
```bash
# Schema synchronization
*workflow schema-sync-broadcast --change-source="terminal-X" --affected-terminals="terminal-Y,terminal-Z"

# Integration checkpoint
*workflow coordination-checkpoint --phase="integration" --participants="all-terminals"

# Final integration
*workflow master-integration-orchestration --coordination-type="progressive"
```

## Communication Channels

### Async Communication
- **API Changes**: GitHub PR with `[API-CHANGE]` prefix
- **Integration Requests**: GitHub issues with `coordination` label
- **Blocker Reports**: Slack #terminal-blockers channel

### Sync Communication  
- **Daily Standups**: 9:00 AM - Integration checkpoint
- **Integration Sessions**: As needed when terminals reach integration readiness
- **Problem Resolution**: Immediate escalation for blocking issues

## Conflict Resolution

### Code Conflicts
1. Check API contract registry for conflicts
2. Terminal lead consultation for resolution approach
3. Integration branch testing before merge to develop

### Timeline Conflicts
1. Identify critical path dependencies
2. Adjust non-critical terminal schedules
3. Parallel development of independent features

### Resource Conflicts
1. Shared resource coordination through daily checkpoints
2. Priority resolution based on Epic priorities
3. Escalation to project lead for resource allocation decisions