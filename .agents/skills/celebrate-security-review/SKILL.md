---
name: celebrate-security-review
description: Performs adversarial security reviews of Celebrate's frontend, Supabase policies, APIs, database functions, authorization, identity visibility, and business-rule enforcement. Use before merging major features or when investigating suspicious behavior.
---

# Celebrate Security Review

Assume the user is not trusted merely because they are authenticated.

The goal is to find ways a malicious client could bypass business rules.

## Review Areas

Inspect:

- authentication
- authorization
- RLS
- server functions
- database functions
- storage policies
- Edge Functions
- API inputs
- client-side trust assumptions
- ID-based access control
- state transitions

## IDOR Checks

Attempt to determine whether changing:

eventId
plannerId
proposalId
reviewId
file path

could expose or modify another user's data.

## Identity Leakage

Check whether sensitive planner or client information can be obtained:

- through hidden frontend fields
- through API responses
- through browser network requests
- through Supabase queries
- through storage URLs
- through cached data

## Business Logic Bypass

Try to:

- exceed proposal limits
- accept multiple proposals
- accept another user's proposal
- activate unpaid events
- create duplicate reviews
- modify completed events
- bypass availability
- bypass planner capacity

## Credential Security

Verify that:

- service role keys are server-side only
- secrets are not committed
- client bundles contain no privileged credentials
- logs do not expose secrets

## Output

Provide:

1. vulnerability
2. impact
3. reproduction path
4. affected files/tables/functions
5. recommended fix
6. whether tests should be added

Do not modify production logic during review unless explicitly instructed.