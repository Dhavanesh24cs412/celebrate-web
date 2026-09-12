---
name: celebrate-domain
description: Protects Celebrate's business entities, lifecycle states, state transitions, marketplace rules, and domain invariants. Use when implementing or modifying event, planner, proposal, acceptance, payment, completion, review, or reputation behavior.
---

# Celebrate Domain Rules

The application is state-driven.

Never treat important status fields as arbitrary labels.

## Event Lifecycle

Use the canonical lifecycle unless product requirements explicitly change:

DRAFT
→ SUBMITTED
→ MATCHING
→ PROPOSALS_AVAILABLE
→ PROPOSAL_ACCEPTED
→ PAYMENT_PENDING
→ ACTIVE
→ COMPLETED

Invalid transitions must be rejected.

Examples of invalid transitions:

COMPLETED → DRAFT
COMPLETED → ACTIVE
PAYMENT_PENDING → COMPLETED
DRAFT → COMPLETED

## Proposal Lifecycle

Proposal behavior must be modeled explicitly.

Possible conceptual states include:

OPEN
SUBMITTED
ACCEPTED
REJECTED
EXPIRED

Use only the states supported by the actual database/domain model.

## Acceptance Invariant

Only an authorized client may accept a proposal for their event.

Acceptance must verify:

- proposal exists
- proposal belongs to the event
- event belongs to the current client
- proposal is in an acceptable state
- event is in the correct lifecycle state
- no conflicting proposal has already been accepted

## Single Acceptance

An event must not accidentally have two simultaneously accepted proposals when the product model permits only one.

This must be enforced server-side.

## Identity Reveal

Sensitive planner/client identity information must only become visible when the relevant product condition has been satisfied.

Do not rely only on:

if (accepted)

inside React.

Access must be enforced server-side.

## Payment

Payment completion must be treated as authoritative only when verified through the correct backend/payment mechanism.

Never trust a client-side "payment succeeded" flag.

## Completion

An event can only become COMPLETED when the necessary completion conditions are satisfied.

Do not allow arbitrary client-side status mutation.

## Reviews and Reputation

Reviews and reputation must be linked to completed events and verified participant relationships.

Prevent:

- duplicate reviews
- reviews from unrelated users
- reputation modification without an eligible source event

## Business Invariants

Whenever implementing a new feature, ask:

1. What state is this object in?
2. What state may it move to?
3. Who is allowed to cause the transition?
4. What conditions must be true?
5. What happens if two requests happen at the same time?
6. What data becomes newly visible?
7. What audit/notification effects occur?

Never implement only the happy path.