---
name: celebrate-context
description: Provides the canonical product context for the Celebrate event-management marketplace, including its roles, product goals, workflow, UI references, and non-negotiable product principles. Use when starting work on any Celebrate feature where product context is needed.
---

# Celebrate Product Context

You are working on **Celebrate**, an event-management marketplace and event execution platform.

Celebrate connects:

- Clients who want to organize events
- Event planners who provide planning and execution services

The product is not merely an event-booking website.

It is a marketplace + intelligent matching system + event lifecycle platform.

## Canonical Product References

Before making major product or architectural decisions, inspect:

- `docs/Celebrate-UI-Kit.png`
- `docs/Celebrate-Workflow.svg`

These files are the visual source of truth for:

1. Brand styling
2. Typography
3. Color system
4. Major application flow
5. Role-based user journeys
6. Product lifecycle

Do not replace the workflow with a newly invented flow unless the user explicitly requests a product change.

## Primary Roles

### Client

Clients:

- authenticate
- create and manage events
- provide event requirements
- submit event requirements
- receive planner proposals
- compare proposals
- accept a proposal
- complete required payment
- access the active event workspace
- participate in event execution
- complete the event
- provide ratings and reviews

### Planner

Planners:

- authenticate
- complete their planner profile
- define services
- define capabilities
- provide availability
- provide capacity information
- receive eligible event opportunities
- submit proposals
- participate in accepted events
- execute event-related work
- receive reputation through completed events

## Core Product Lifecycle

The core conceptual lifecycle is:

DRAFT
→ SUBMITTED
→ MATCHING
→ PROPOSALS_AVAILABLE
→ PROPOSAL_ACCEPTED
→ PAYMENT_PENDING
→ ACTIVE
→ COMPLETED

Do not introduce alternate status names casually.

Every state transition must be intentional and validated.

## Marketplace Principle

Celebrate must protect both sides of the marketplace.

Client information, planner information, proposal data, event information, and identity-sensitive information must only be exposed according to the defined product rules.

In particular:

Planner identity-sensitive information must not be exposed prematurely before the appropriate proposal acceptance stage.

## Product Philosophy

Celebrate should feel:

- premium
- trustworthy
- sophisticated
- calm
- modern
- human
- practical

It must not feel:

- like a generic SaaS dashboard
- like an AI demo
- like a wedding invitation
- overly feminine
- visually noisy
- template-generated

## Important Development Principle

The workflow and UI kit describe the intended product experience.

Engineering implementation must preserve the product intent while making the system secure, testable, maintainable, and scalable.

Do not invent product behavior when the source material does not define it.

When requirements are ambiguous:

1. inspect existing implementation
2. inspect product references
3. identify the ambiguity
4. ask for clarification when the ambiguity affects business behavior or data integrity

Do not silently invent business rules.