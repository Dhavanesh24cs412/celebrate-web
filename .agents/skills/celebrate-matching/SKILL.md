---
name: celebrate-matching
description: Designs and implements Celebrate's planner matching, eligibility, ranking, semantic requirement matching, capacity checks, availability checks, and proposal generation. Use when working on matching or recommendation logic.
---

# Celebrate Matching Engine

The matching engine is not a chatbot.

It is a business-critical ranking system.

## Pipeline

Use this conceptual sequence:

Event Requirements
→ Hard Eligibility
→ Semantic Matching
→ Availability Check
→ Capacity Check
→ Score Calculation
→ Quality / Quota Rules
→ Ranked Matches
→ Proposal Generation

## Hard Eligibility

Use deterministic rules for hard constraints.

Examples may include:

- required service category
- event location compatibility
- planner active status
- availability
- capacity
- required capabilities

A planner who fails a hard requirement should not be recommended merely because an AI model thinks they are a good fit.

## Semantic Matching

AI or embeddings may be used to interpret:

- natural-language requirements
- service descriptions
- planner capabilities
- event preferences

Semantic matching should contribute to ranking, not silently override hard constraints.

## Ranking

Use an explicit scoring model.

Conceptually:

match score =
requirement fit
+ location fit
+ availability fit
+ capacity fit
+ quality
+ budget fit
+ reliability

Exact weights are product decisions.

Do not silently invent or alter weights.

Represent weights as configurable constants or configuration data where practical.

## Explainability

The system should be capable of explaining why a planner was matched.

Examples:

- service requirement matched
- location compatible
- available on required date
- capacity sufficient
- quality threshold met

Avoid opaque "AI selected this planner" behavior.

## Proposal Quota

If a proposal quota exists, quota enforcement must happen server-side.

Never rely only on a client-side count.

Concurrent requests must not be able to exceed the quota.

## Availability

Availability must be checked using authoritative planner data.

Cached UI availability is not sufficient for final acceptance decisions.

## Matching Runs

Prefer representing a matching operation as a distinct conceptual operation/run when the product requires reproducibility, debugging, or auditing.

Store sufficient information to understand why a match was produced.

## AI Safety

LLMs must not independently:

- authorize a planner
- expose private data
- override security rules
- accept proposals
- approve payments
- modify user ownership
- bypass hard eligibility constraints

AI can assist interpretation and ranking, but deterministic application logic remains authoritative.