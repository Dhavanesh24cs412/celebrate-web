# Celebrate - Master Reference Guide

*Note: This document reflects the actual implemented state of the repository as of October 2026. Do not rely on older, outdated proposal documents for technical truth.*

## 1. Project Overview
Celebrate is a modern, premium event-management marketplace connecting event clients with professional planners. The platform uses a specialized matching engine (CLIP ViT Architecture) to semantically match a client's aesthetic preferences (visual reference media and textual vibe descriptions) to a planner's portfolio.

## 2. Technology Stack
- **Frontend:** React, Vite, TypeScript, TailwindCSS, Lucide React (for iconography).
- **Backend/DB:** Supabase (PostgreSQL, Auth, Storage).
- **Matching Engine (Upcoming):** OpenAI CLIP model (ViT architecture) for semantic visual and text matching.

## 3. Database Architecture (The Source of Truth)
The entire database schema has been consolidated into a single master file: `supabase/migrations/20261006000000_master_schema_consolidation.sql`. 

**Core Tables:**
- `profiles` (Auth-linked. Roles: 'client' or 'planner')
- `client_profiles` & `planner_profiles` (Role-specific data)
- `event_types` (Taxonomy: Wedding, Reception, Corporate, etc.)
- `events` (The core marketplace entity)

**The `events` Table Structure:**
The schema uses a highly extensible hybrid relational + JSONB approach:
- **Relational Data:** `id`, `client_id`, `event_type_id`, `name`, `event_date`, `city`, `venue_status`, `venue_address`, `budget_max`, `guest_count`, `status` ('draft', 'open', 'booked', etc.).
- **JSONB Data:** 
  - `services`: Array of strings (e.g., `["Photography", "Stage Decor"]`).
  - `style_preferences`: JSON object holding vibe descriptions, colors, and theme hex codes.
  - `requirements`: JSON object holding specific custom textual needs.
  - `reference_media`: JSON array of Supabase storage paths used as input for the CLIP model.

## 4. Completed Work: The Client Side
The client-side workflow is fully built, tested, and visually polished:
1. **Authentication & Onboarding:** Secure signup/login routing users to role-specific dashboards with strict RLS enforcement.
2. **Event Wizard (`EventWizard.tsx`):** A robust multi-step form where clients define their event. It handles structured data collection and uploads reference images directly to the Supabase `client-event-media` storage bucket.
3. **Client Dashboard (`ClientEvents.tsx`):** A clean interface listing the client's current open/booked events.
4. **Event Details View (`ClientEventDetails.tsx`):** A premium, responsive UI that displays:
   - Dynamic Lucide icons intelligently mapped to requested services based on text keywords.
   - Clickable, outbound Google Maps links seamlessly extracted from the `venue_address` column.
   - Uncropped, original-aspect-ratio galleries for uploaded reference media.
   - Clean typographical hierarchy mapping event types and styles via `EVENT_WIZARD_CONFIG`.

## 5. Development Procedures & Best Practices
- **UI/UX Priority:** The app strictly follows a premium, modern aesthetic (glassmorphism, subtle drop shadows, smooth hover transitions, curated typography). Basic/generic UI is unacceptable.
- **Database Integrity:** Do not alter the DB manually via the Supabase UI. All schema changes must update the `master_schema_consolidation.sql` file.
- **Security:** Strict adherence to Supabase Row Level Security (RLS) is enforced across all tables and storage buckets.

## 6. The Next Phase: Planner Side & Matching Engine
1. **Build the Planner Interface:** Planners require a dashboard to view matched open events, manage their extensive visual portfolios (essential input for the CLIP model), and submit customized proposals to clients.
2. **Integrate the Matching Engine:** Connect the frontend to the backend logic. This engine will feed the client's `reference_media` and `style_preferences` into the CLIP ViT architecture to generate embeddings and retrieve highly relevant planner portfolios, acting as the intelligent bridge between both parties.
