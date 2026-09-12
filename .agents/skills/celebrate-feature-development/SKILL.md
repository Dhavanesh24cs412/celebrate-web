---
name: celebrate-feature-development
description: Executes a complete Celebrate feature-development workflow from inspection and planning through implementation, testing, browser verification, and final reporting. Use when building or modifying a significant Celebrate feature.
---

# Celebrate Feature Development Protocol

Never immediately start coding a significant feature.

## Phase 1 — Understand

Inspect:

- relevant source files
- relevant services
- relevant database tables
- relevant migrations
- relevant domain states
- relevant UI components
- relevant Celebrate documentation

Determine what already exists.

## Phase 2 — Plan

Before modifying code, determine:

- user-facing behavior
- data changes
- backend changes
- security implications
- lifecycle implications
- responsive behavior
- testing requirements

For significant work, provide a concise implementation plan before execution.

## Phase 3 — Implement

Implement the smallest complete solution.

Reuse existing infrastructure.

Do not rewrite unrelated systems.

Do not duplicate existing abstractions.

## Phase 4 — Validate

Run:

- TypeScript checks
- lint
- unit tests
- relevant integration tests
- production build

When UI changes are involved, verify using the browser.

## Phase 5 — Adversarial Check

Consider:

- unauthorized access
- invalid state transitions
- duplicate submission
- concurrent requests
- stale data
- empty data
- failed network request
- mobile layout failure

## Phase 6 — Review

Inspect the final diff.

Remove:

- dead code
- debugging statements
- unnecessary dependencies
- accidental unrelated changes

## Phase 7 — Report

Report:

1. what changed
2. files changed
3. database changes
4. tests executed
5. test results
6. known limitations
7. anything requiring human decision

Never claim a feature is verified if it was not actually tested.