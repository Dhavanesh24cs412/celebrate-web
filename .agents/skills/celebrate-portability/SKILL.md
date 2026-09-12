---
name: celebrate-portability
description: Keeps Celebrate portable across Supabase projects and future infrastructure migrations by enforcing migration-based schema management, configuration isolation, storage abstractions, and source-controlled backend logic.
---

# Celebrate Portability

Celebrate currently uses Supabase.

Do not create unnecessary coupling to a single Supabase project.

## Configuration

Supabase configuration must be loaded from environment-specific configuration.

Application code must not contain scattered hard-coded project URLs or keys.

## Database

All schema changes must exist as migrations.

Version control must contain:

- tables
- constraints
- indexes
- functions
- triggers
- RLS policies

## Storage

Do not hard-code storage URLs throughout UI components.

Use a storage service abstraction.

## Backend

Edge Functions and backend logic must be stored in source control.

Do not leave important business logic only in a dashboard editor.

## Domain Independence

Business logic should operate conceptually on domain services such as:

eventService
proposalService
matchingService
paymentService
plannerService

rather than coupling the entire application to raw Supabase calls.

## Migration Readiness

A future infrastructure migration should primarily require:

- new environment configuration
- database restoration
- deployment of backend functions
- storage migration
- authentication configuration
- infrastructure-specific verification

Avoid architectural decisions that require rewriting the entire application.

## Important

Do not over-engineer portability.

The goal is:

"easy enough to migrate later"

not:

"abstract every database operation behind an enterprise framework."

Prefer simple, understandable abstractions.