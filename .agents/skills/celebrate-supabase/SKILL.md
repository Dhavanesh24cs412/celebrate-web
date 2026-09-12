---
name: celebrate-supabase
description: Implements Celebrate database, Supabase Auth, RLS, Storage, Realtime, Edge Functions, migrations, transactions, and data access safely. Use whenever changing database schema, security policies, backend operations, authentication, or Supabase integration.
---

# Celebrate Supabase Engineering

## Core Rule

Supabase is infrastructure, not the business domain.

Application business logic must remain understandable independently of individual database queries.

## Database Migrations

Every schema change must be represented in:

supabase/migrations/

Do not rely on undocumented manual production-dashboard changes.

Migrations must include, where relevant:

- tables
- columns
- indexes
- foreign keys
- constraints
- triggers
- functions
- RLS policies

## Database Design

Prefer normalized relational structures.

Do not create a giant table containing unrelated business concepts.

Important domains include:

- profiles
- client profiles
- planner profiles
- planner services
- planner availability
- events
- event requirements
- matches
- proposals
- payments
- notifications
- reviews
- reputation
- audit records

Actual schema must follow the current product specification.

Do not invent unnecessary entities.

## RLS

Row Level Security is mandatory for user-owned or role-sensitive data.

Never assume frontend checks are sufficient.

Every protected table must answer:

- who can SELECT?
- who can INSERT?
- who can UPDATE?
- who can DELETE?

Security must be enforced at the database/server boundary.

## Service Role

Never expose the Supabase service-role key to the browser.

Never put privileged credentials in client-side code.

## Transactions

Any operation involving multiple dependent database changes must be considered for transactional execution.

Examples:

- accepting a proposal
- activating an event
- processing critical payment state
- enforcing quotas
- updating dependent reputation records

Never implement a critical multi-step business operation as unrelated browser requests merely for convenience.

## Concurrency

Consider race conditions whenever a rule depends on:

- count
- availability
- capacity
- uniqueness
- one-active-selection
- limited quota

Examples:

A naive client-side:

if proposalCount < 15

is not authoritative.

The server/database must enforce the real rule.

## Authentication

Authentication identity must be connected cleanly to application profiles.

Preferred conceptual relationship:

auth user
→ profile
→ client profile / planner profile

Do not duplicate authentication state unnecessarily.

## Storage

Storage paths must be predictable.

Do not scatter hard-coded Supabase storage URLs throughout React components.

Centralize storage operations.

## Edge Functions

Use Edge Functions for sensitive server-side workflows where appropriate.

Examples:

- proposal acceptance
- matching execution
- payment webhooks
- notifications
- privileged operations

Functions must be stored in source control under:

supabase/functions/

## Realtime

Use Realtime only where live updates provide genuine product value.

Do not create unnecessary subscriptions on every component.

Subscriptions must be cleaned up correctly.

## Error Handling

Never silently swallow Supabase errors.

Surface useful application-level errors without exposing sensitive implementation details.

## Database Portability

Keep schema, migrations, SQL functions, policies, and backend logic version-controlled so the application can be migrated later.

The application should not depend on undocumented manual state inside a Supabase dashboard.