---
name: celebrate-design-system
description: Implements and reviews the Celebrate visual language using the canonical UI kit, colors, typography, spacing, hierarchy, and component styling. Use for UI implementation, redesign, styling, responsive layouts, and visual consistency work.
---

# Celebrate Design System

The canonical visual reference is:

`docs/Celebrate-UI-Kit.png`

The UI kit is the source of truth.

Do not invent a new visual identity.

## Brand Colors

Primary:
#0A2947
Deep Navy

Background:
#F3E4C9
Warm Cream

Secondary:
#D3D4C0
Muted Sage-Grey

Accent:
#8B5E3C
Terracotta Brown

Use these colors intentionally.

Do not casually replace them with:

- purple
- blue gradients
- pink wedding themes
- green startup palettes
- generic Tailwind colors

When a shade is required, derive a controlled tint/shade from the existing brand color rather than introducing a new unrelated hue.

## Typography

Display font:

DM Serif Display

Use primarily for:

- brand-facing headings
- hero headings
- major section titles
- high-emphasis editorial text

UI/body font:

Inter

Use for:

- navigation
- forms
- labels
- buttons
- body copy
- tables
- metadata
- dashboards
- utility text

Do not substitute fonts without explicit instruction.

## Hierarchy

Preserve the hierarchy shown in the UI kit:

- H1 / Display
- H2 / Section Title
- H3 / Heading
- Body / Paragraph
- Caption
- Overline / Label

Typography must communicate hierarchy before decorative styling is introduced.

## Visual Direction

Celebrate should feel:

- premium
- editorial
- confident
- refined
- warm
- trustworthy

Avoid:

- excessive rounded cards
- excessive glassmorphism
- excessive shadows
- excessive gradients
- generic SaaS blue
- decorative animations with no purpose
- excessive icons
- visual clutter

## Component Rule

Create reusable UI primitives before duplicating patterns.

Examples:

- Button
- Input
- Select
- Dialog
- Card
- Badge
- Tabs
- EmptyState
- SectionHeader
- StatusIndicator

Do not create slightly different versions of the same component in multiple pages.

## Responsive Rule

Every UI feature must be designed for:

- desktop
- tablet
- mobile

Do not treat mobile as an afterthought.

Responsive behavior must preserve usability and hierarchy.

## Accessibility

All interactive components must:

- have visible focus states
- have usable keyboard interactions
- have meaningful labels
- maintain sufficient contrast
- avoid relying only on color to communicate state

## Final Rule

The UI kit is more authoritative than an AI-generated aesthetic preference.

When visual implementation differs from the UI kit, preserve the UI kit unless the user explicitly changes the design system.