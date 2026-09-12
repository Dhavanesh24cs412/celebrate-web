---
name: celebrate-testing
description: Tests Celebrate features at unit, integration, database, security, and browser levels. Use after implementing significant features, fixing bugs, modifying business logic, or changing database behavior.
---

# Celebrate Testing Protocol

A feature is not complete merely because the code compiles.

## Before Testing

Identify:

- expected behavior
- invalid behavior
- permission rules
- lifecycle states
- concurrency risks
- error states

## Unit Tests

Test pure business logic such as:

- match scoring
- status transition validation
- requirement normalization
- eligibility rules
- formatting and utility logic

## Integration Tests

Test important application operations:

- create event
- submit event
- create proposal
- accept proposal
- reject proposal
- activate event
- complete event
- create review

## Database Tests

Verify:

- foreign keys
- constraints
- RLS
- uniqueness
- ownership
- state consistency
- transaction behavior

## Browser Tests

Use Playwright for critical end-to-end journeys.

At minimum the core client journey should cover:

login
→ onboarding
→ create event
→ submit requirements
→ receive proposals
→ compare
→ accept
→ appropriate identity reveal
→ payment/activation
→ active event
→ completion

The planner journey should cover:

login
→ onboarding
→ profile
→ availability
→ eligibility
→ proposal
→ accepted event
→ event execution

## Security Tests

Attempt unauthorized actions explicitly.

Examples:

- client accessing another client's event
- planner accessing another planner's private data
- client modifying planner data
- planner modifying client-owned event data
- user accessing protected information by changing IDs
- unauthorized proposal acceptance

## Concurrency Tests

Consider concurrent actions when business rules involve:

- proposal limits
- capacity
- availability
- single acceptance
- payment activation
- duplicate submissions

## Definition of Done

Before declaring a feature complete:

1. tests pass
2. build passes
3. critical workflow verified in browser
4. errors handled
5. security considered
6. no unrelated regressions introduced