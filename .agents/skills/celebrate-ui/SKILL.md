---
name: celebrate-ui
description: Builds Celebrate frontend pages and components with responsive layouts, accessible interactions, realistic states, and adherence to the canonical design system. Use when implementing screens, dashboards, forms, navigation, cards, modals, or responsive UI.
---

# Celebrate UI Engineering

## Before Coding

For any screen:

1. inspect existing components
2. inspect the design system
3. identify the relevant workflow state
4. identify loading/error/empty/success states
5. identify mobile behavior

Do not create a screen in isolation.

## Component Reuse

Search the existing component library before creating a new component.

Reuse existing:

- buttons
- inputs
- cards
- dialogs
- typography
- status indicators
- layout primitives

Only introduce a new primitive when there is a real reusable need.

## State Coverage

Every data-driven screen should consider:

- loading
- empty
- success
- validation error
- server error
- permission denied
- expired/invalid state

Do not implement only the ideal populated state.

## Forms

Forms must include:

- validation
- clear labels
- useful error messages
- disabled/loading submission states
- duplicate-submission prevention
- success feedback

Do not rely solely on browser validation when server validation is necessary.

## Responsive Design

Every screen must work on:

- mobile
- tablet
- desktop

Do not simply shrink desktop components.

Re-evaluate:

- navigation
- cards
- forms
- tables
- proposal comparisons
- calendars
- dialogs

for mobile.

## Accessibility

Use semantic HTML.

Interactive elements must be keyboard accessible.

Do not create clickable divs when a button or link is appropriate.

Forms must associate labels with inputs.

Dialogs must manage focus correctly.

## Animation

Animations should:

- be subtle
- communicate state
- support hierarchy
- avoid slowing down important actions

Do not add animation merely because an AI-generated design looks more impressive with it.

## Data Integrity

UI state is not authoritative business state.

The interface must reflect server-confirmed state.

Avoid optimistic UI for critical state transitions unless rollback behavior is correctly implemented.

## Visual Quality

The final implementation should look intentionally designed rather than AI-generated.

Avoid repetitive cards, excessive rounded containers, unnecessary gradients, and excessive decorative elements.