---
name: celebrate-architecture
description: Defines the engineering architecture for Celebrate and guides feature implementation, service boundaries, folder structure, state management, and separation of UI from business logic. Use when creating features, refactoring architecture, or deciding where code belongs.
---

# Celebrate Architecture

## Core Stack

Use:

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions
- Vercel

Do not introduce a different framework unless explicitly requested.

## Architectural Principle

Separate:

1. Presentation
2. Application logic
3. Domain logic
4. Infrastructure/data access

Do not place business-critical logic directly inside React components.

## Preferred Structure

Use a structure similar to:

src/
  components/
  pages/
  layouts/
  hooks/
  services/
  domain/
  lib/
  types/
  utils/

supabase/
  migrations/
  functions/

tests/

## React Components

Components should primarily handle:

- presentation
- user interaction
- local UI state
- calling application services/hooks

Components should not contain complex transaction logic.

Avoid:

component
→ directly updates five unrelated database tables
→ performs authorization
→ calculates business rules
→ sends notifications

Instead use:

component
→ service/application function
→ validated server-side operation
→ database

## Service Layer

Prefer:

eventService
plannerService
proposalService
matchingService
notificationService
paymentService

over scattering Supabase queries throughout the component tree.

## Query Layer

Use a predictable query/data-access strategy.

Do not make every component independently invent its own data-fetching behavior.

Prefer reusable hooks such as:

useEvent()
useEvents()
usePlanner()
usePlannerAvailability()
useProposals()
useMatchingResults()
useNotifications()

## Type Safety

Use TypeScript strongly.

Important business objects should have explicit types.

Examples:

Event
Planner
Proposal
Match
Availability
Payment
Review
Notification

Status values should use explicit unions/enums rather than arbitrary strings.

## API / Server Boundary

Anything involving:

- authorization-sensitive operations
- multi-table updates
- business-critical transitions
- quotas
- payments
- matching
- identity revelation
- reputation calculations

must be validated server-side.

## Change Discipline

Before implementing a large feature:

1. inspect current architecture
2. identify relevant existing services/components
3. propose the smallest compatible change
4. implement
5. run tests
6. verify the browser
7. report changes

Do not rewrite unrelated parts of the application.

## Dependency Discipline

Do not add a package simply because it makes one task slightly easier.

Before adding a dependency:

1. check whether existing dependencies already solve the problem
2. check bundle/runtime implications
3. check maintenance quality
4. verify it is actually necessary

Keep the stack intentionally small.