# Indiranagar Discovery Platform Fullstack Architecture Document

## Table of Contents

- [Indiranagar Discovery Platform Fullstack Architecture Document](#table-of-contents)
  - [Starter Template or Existing Project](./starter-template-or-existing-project.md)
  - [Change Log](./change-log.md)
  - [High Level Architecture](./high-level-architecture.md)
    - [Technical Summary](./high-level-architecture.md#technical-summary)
    - [Platform and Infrastructure Choice](./high-level-architecture.md#platform-and-infrastructure-choice)
    - [Repository Structure](./high-level-architecture.md#repository-structure)
    - [High Level Architecture Diagram](./high-level-architecture.md#high-level-architecture-diagram)
    - [Architectural Patterns](./high-level-architecture.md#architectural-patterns)
  - [Tech Stack](./tech-stack.md)
    - [Technology Stack Table](./tech-stack.md#technology-stack-table)
  - [Unified Project Structure](./unified-project-structure.md)
  - [Frontend Architecture Integration](./frontend-architecture-integration.md)
    - [Component Architecture (from UX Spec)](./frontend-architecture-integration.md#component-architecture-from-ux-spec)
    - [Design System Implementation](./frontend-architecture-integration.md#design-system-implementation)
  - [External APIs & Integration Architecture](./external-apis-integration.md) 🔴 **CRITICAL**
    - [Weather API Integration Strategy](./external-apis-integration.md#weather-api-integration-strategy)
    - [Security & Credential Management](./external-apis-integration.md#security--credential-management)
    - [Fallback Mechanisms](./external-apis-integration.md#fallback-mechanisms)
    - [Redis Caching Implementation](./external-apis-integration.md#redis-caching-implementation)
    - [Environment Setup Guide](./external-apis-integration.md#environment-variable-setup-guide)
  - [Testing Infrastructure Architecture](./testing-infrastructure.md) 🔴 **CRITICAL**
    - [Testing Framework Stack](./testing-infrastructure.md#testing-framework-stack)
    - [Vitest Configuration](./testing-infrastructure.md#vitest-configuration)
    - [Mock Service Worker Setup](./testing-infrastructure.md#mock-service-worker-setup)
    - [Component Testing Examples](./testing-infrastructure.md#component-testing-examples)
    - [API Route Testing](./testing-infrastructure.md#api-route-testing)
    - [Playwright E2E Testing](./testing-infrastructure.md#playwright-e2e-testing)
    - [CI/CD GitHub Actions](./testing-infrastructure.md#cicd-github-actions)
