# Celebrate — Client Requirements + Planner Portfolio + CLIP Matching Foundation

## 0. Purpose

This document is the canonical implementation reference for the current Celebrate phase.

The goal of this phase is **not** to build the complete planner marketplace or the final AI matching engine. The goal is to establish the correct product foundation:

1. Build the **Client Event Requirement Form**.
2. Build the **Planner Profile + Event Portfolio Form**.
3. Create the required **Supabase schema, storage structure, RLS, and routes**.
4. Structure the data so that a future CLIP ViT matching engine can consume it without redesigning the client/planner domain.
5. Keep the CLIP integration behind a clear service boundary. The current frontend/database implementation must remain usable even though the repo does not yet contain the CLIP model.

This document intentionally separates:

- product/UI collection of data,
- relational eligibility filtering,
- future CLIP visual/text similarity,
- final ranking,
- future lead distribution.

Do not collapse all of these into one component or one database table.

---

# 1. Current Product Direction

Celebrate is an event-planning marketplace where a client describes what they are planning and what kind of experience/design they want. Planners maintain event-specific capabilities and portfolio proof. Celebrate later uses structured filters plus multimodal similarity to rank planners.

The matching philosophy is:

**Hard eligibility first → structured preference match → visual similarity → experience/text similarity → final ranking → lead distribution.**

The current implementation phase stops before actual CLIP inference.

---

# 2. Important Current-Repo Constraint

The current repository **does not know anything about CLIP yet**.

Therefore:

- Do not pretend CLIP already exists in the repo.
- Do not import a CLIP package into the frontend just to make the architecture look complete.
- Do not download a model as part of the current client form implementation.
- Do not expose embeddings, model weights, model credentials, or vector-search internals to the browser.
- Do not create fake similarity scores in production UI.
- Do not make the client form depend on a running AI service.

Instead, prepare a clean contract for a future AI service.

The current phase must work completely without CLIP.

---

# 3. Canonical Event Types

The product currently supports these event types:

1. Wedding
2. Reception
3. Engagement
4. Corporate Event
5. Haldi
6. Mehendi
7. Sangeet
8. Birthday
9. Private Party

Use stable machine-readable slugs:

```text
wedding
reception
engagement
corporate
haldi
mehendi
sangeet
birthday
private_party
```

Display labels are separate from slugs.

Do not use display strings as database identifiers.

---

# 4. Client Requirement Form

## 4.1 Product principle

The client form should feel like a guided planning experience, not a large enterprise questionnaire.

Use a progressive multi-step wizard.

The exact UI can evolve, but the information architecture must remain data-driven.

The form should collect only information that is useful for:

- planner eligibility,
- event fit,
- service fit,
- budget fit,
- design/style matching,
- future CLIP retrieval.

Avoid repetitive questions.

---

# 5. Client Form — Step Structure

## STEP 1 — WHAT ARE YOU PLANNING?

Purpose: identify the event.

Fields:

- Event Type — required
- Event Name — required

Examples of event names:

- Ananya & Arjun Wedding
- Dad’s 60th Birthday
- Annual Dealer Meet

The event type determines the event-specific options shown later.

---

## STEP 2 — WHEN IS YOUR EVENT?

Fields:

- Event Date — required
- Start Time — optional/required according to product decision
- End Time — optional

Store the event date using a proper date type.

Do not store date as formatted display text.

---

## STEP 3 — WHERE IS YOUR EVENT?

Fields:

- City — required
- Area / locality — optional
- Venue — optional
- Venue status — optional: `selected`, `shortlisting`, `not_selected`

The matching engine later uses operating area as a hard eligibility condition.

Do not attempt geographic AI matching in this phase.

---

## STEP 4 — HOW BIG IS YOUR EVENT?

Fields:

- Expected Guest Count — required
- Scale — derived or selected

Suggested scale buckets:

```text
small
medium
large
```

Prefer deriving scale from guest count in application logic rather than asking both questions manually, unless the UX proves useful.

Do not duplicate the same fact in multiple fields.

---

## STEP 5 — WHAT IS YOUR BUDGET?

Fields:

- Budget Min — optional
- Budget Max — required
- Budget flexibility — optional: `fixed`, `slightly_flexible`, `flexible`

The planner side stores an event-specific budget range.

Future compatibility rule:

```text
client budget range intersects planner event budget range
```

The exact scoring logic must not be hardcoded into the UI.

Store numeric values, not strings such as `₹5–10 Lakhs`.

---

## SERVICES — WHAT DO YOU NEED?

This is a structured multi-select service requirement step.

Use service groups rather than one giant flat list.

### Food & Beverages

Use the corrected concept:

- Buffet
- Bartending
- Interactive Food Stalls

Do **not** label this category as merely “Chaat” as the primary product concept. Specific interactive food experiences can be represented under `Interactive Food Stalls`.

### Entertainment

Keep these as separate services:

- DJ
- Dance Floor
- Music
- Event Host
- Fun Games

Other service groups can be added through a data-driven catalog, for example:

- Decor & Design
- Photography
- Videography
- Lighting
- Venue Support
- Makeup / Styling
- Transportation
- Other event-specific services

Important: the service catalog must be data-driven so the platform can evolve without rewriting the entire form.

---

## STEP 6 — HOW SHOULD YOUR EVENT LOOK?

**Important product decision:** remove the **Guest Experience** section from this step.

Do not recreate it under another label.

This step is specifically about **visual/design preference**.

The information collected here should support both:

1. structured style filtering/scoring,
2. future CLIP text embedding.

The exact visible options should be event-specific.

### Common visual preference dimensions

Use only the dimensions that make sense for that event.

Possible dimensions:

- Color Theme
- Overall Style
- Decor Feel / Mood
- Stage Style
- Lighting Style
- Floral Preference
- Seating / Setup Style
- Theme
- Branding Style for corporate events

Do not show every dimension for every event.

---

# 6. Event-Specific Client Visual Options

These are the initial canonical option categories. They are intentionally editable data, not permanent UI constants.

## Wedding

Visual preference categories:

- Color Theme
- Overall Style
- Decor Feel
- Stage Style

Examples:

Overall Style:

- Traditional
- Contemporary
- Minimal
- Royal
- Floral
- Luxury
- Rustic

Decor Feel:

- Elegant
- Grand
- Warm
- Soft
- Vibrant

Stage Style:

- Floral
- Classic
- Modern
- Palace / Royal
- Minimal
- Statement Stage

---

## Reception

Visual preference categories:

- Color Theme
- Overall Style
- Decor Feel
- Stage Style
- Lighting Style

Examples:

Overall Style:

- Elegant
- Modern
- Luxury
- Minimal
- Glamorous

Stage Style:

- Floral
- Contemporary
- LED / Modern
- Classic
- Statement

---

## Engagement

Visual preference categories:

- Color Theme
- Overall Style
- Decor Feel
- Stage Style
- Floral Preference

Examples:

- Romantic
- Pastel
- Floral
- Minimal
- Contemporary
- Traditional

---

## Corporate Event

Visual preference categories:

- Branding Style
- Color Theme
- Overall Style
- Decor Feel
- Stage Style
- Lighting / Production Style

Examples:

Overall Style:

- Professional
- Premium
- Minimal
- Modern
- Bold

Stage Style:

- Presentation Stage
- LED Stage
- Minimal Corporate
- Product Launch
- Conference Style

---

## Haldi

Visual preference categories:

- Color Theme
- Overall Style
- Decor Feel
- Floral Preference
- Seating / Setup Style

Examples:

- Yellow / Marigold
- Vibrant
- Floral
- Rustic
- Traditional
- Boho

---

## Mehendi

Visual preference categories:

- Color Theme
- Overall Style
- Decor Feel
- Floral Preference
- Seating / Setup Style

Examples:

- Boho
- Floral
- Traditional
- Colorful
- Pastel
- Rustic

---

## Sangeet

Visual preference categories:

- Color Theme
- Overall Style
- Decor Feel
- Stage Style
- Lighting Style

Examples:

- Glamorous
- Luxury
- Modern
- Vibrant
- Contemporary
- Traditional

Stage examples:

- LED
- Performance Stage
- Grand Floral
- Modern Geometric
- Concert Style

---

## Birthday

Visual preference categories:

- Theme
- Color Theme
- Overall Style
- Decor Feel

Examples should adapt to age/party context.

Possible themes:

- Cartoon
- Jungle
- Princess
- Cars
- Sports
- Minimal
- Luxury
- Custom Theme

Do not force child-oriented themes for adult birthdays.

---

## Private Party

Visual preference categories:

- Party Type
- Color Theme
- Overall Style
- Decor Feel
- Lighting Style

Examples:

- House Party
- Cocktail-style
- Lounge
- Birthday Party
- Anniversary
- Celebration

---

# 7. NEXT STEP — SPECIAL REQUIREMENTS

This is the important **experience / uniqueness** requirement step.

This information is different from Step 6.

Step 6 answers:

> “What should it look like?”

Step 8 answers:

> “What special things do you want included?”

The client should be able to select special requirements from structured interactive options and also add a custom description.

Examples of special requirements:

- Mascot Dance
- Event Host
- Fun Games
- Live Performance
- Live Music
- Photo Booth
- Interactive Activities
- Couple Entry
- Kids Activities
- LED / Stage Presentation
- Product Display
- Interactive Food Experience

Not every event should show every option.

Options should be event-aware.

There must also be:

- `custom_requirements` — optional free text

The custom text should be preserved exactly as user-entered text.

---

# 8. NEXT STEP — REFERENCE IMAGES

This is the client's visual reference collection step.

The two core reference categories are:

### `venue_decorated`

- Required
- Exactly at least 1 image
- Represents the desired/known decorated venue or stage/decor environment
- This is the primary visual reference for future CLIP matching

### `entrance`

- Optional
- One or multiple images allowed according to UI limit
- Represents the desired entrance decoration style

Do not rename `venue_decorated` to something generic such as `reference_image` in the database.

The semantic category matters to the future visual matching system.

The client can continue from the reference-media step only when a `venue_decorated` reference is present.

---

# 9. Client Form Data Model

The form should not store everything inside one giant JSON blob.

Use relational tables for stable/high-value entities and a controlled JSON field only where event-specific answer flexibility is genuinely useful.

Recommended structure:

```text
profiles
  └── client_profiles
        └── events
              ├── event_requirements
              ├── client_event_services
              ├── client_event_style_preferences
              └── client_event_reference_media
```

An event belongs to exactly one client profile.

---

# 10. Planner Profile + Portfolio Form

The planner profile is event-specific.

A planner may support several event types, but capabilities must be captured separately for each event type.

Example:

```text
Planner A
  Wedding
    Budget: 5L–12L
    Services: Decor, DJ, Lighting
    Styles: Luxury, Floral, Contemporary
    Venue Decor Portfolio: 8 images
    Entrance Portfolio: 3 images
    Experience Portfolio: Mascot, Host, Games

  Birthday
    Budget: 1L–4L
    Services: Decor, DJ, Games
    Styles: Themed, Vibrant
    Venue Decor Portfolio: 5 images
```

Do not have one universal planner style field such as `planner_style = luxury`.

The style is event-specific.

---

# 11. Planner Form — Sections

## SECTION A — BUSINESS PROFILE

Fields:

- Business Name — required
- Logo — optional/required according to existing onboarding decision
- Phone Number — required
- Instagram — optional
- Website — optional
- Short Bio — required

The profile information is shared across event types.

---

## SECTION B — OPERATING AREA

Fields:

- Primary City — required
- Operating Cities / Areas — multiple

This is used later as a hard eligibility filter.

Do not encode multiple cities in a comma-separated text field.

Use a child table.

---

# 12. SECTION C — EVENT CAPABILITIES

The planner selects one or more supported event types.

For every selected event type, create an event-specific planner profile.

Each event-specific profile contains:

- event type
- budget minimum
- budget maximum
- supported styles
- services offered
- decor portfolio
- unique experience portfolio

The form can be progressive:

1. Select supported event types.
2. Configure each event type one by one.

This avoids making a single giant form.

---

# 13. Planner Event Profile — Budget

For each supported event type:

- Budget Min
- Budget Max

Store numeric values only.

Example:

```text
budget_min = 500000
budget_max = 1200000
currency = INR
```

Use a currency code field if the database architecture supports multi-country expansion, but default the UI to INR.

---

# 14. Planner Event Profile — Styles

The planner selects the styles they can actually execute for that event type.

Use the same normalized event-specific style taxonomy used by the client side.

This is important.

Do not create unrelated client and planner style vocabularies where the same concept is represented by different values.

Example:

Client:

```text
Overall Style = Luxury
Stage Style = Floral
Color Theme = Pastel
```

Planner:

```text
Overall Style = Luxury
Stage Style = Floral
Color Theme capabilities = Pastel
```

The exact storage structure can distinguish categories from selected values, but the controlled vocabulary must be consistent.

---

# 15. Planner Event Profile — Services

For every event-specific profile, the planner selects the services they provide.

Use the same service catalog as the client requirements form wherever the service means the same thing.

This makes later hard-filter matching possible:

```text
required service exists in planner services
```

Do not store services as comma-separated strings.

---

# 16. Planner Decor Portfolio

This is critical for future CLIP visual matching.

For every supported event type, the planner uploads multiple decor/design images.

### Required category

`venue_decorated`

The planner **must upload at least one** venue/stage/decorated setup image for each event-specific profile.

This is mandatory because client visual matching depends on it.

### Optional category

`entrance`

Planner entrance decor proof is optional.

### Multiple images

The planner should be able to upload multiple designs.

Recommended product-level range:

```text
Minimum: 1 venue_decorated image
Recommended: 3–10 venue_decorated images
Optional: multiple entrance images
```

Do not hard-limit the database to exactly one image.

The UI may enforce a practical upload maximum for usability, but this must be easy to change.

---

# 17. Planner Unique Experience Portfolio

This is separate from venue/decor visuals.

The planner should be able to prove special experiences or capabilities they offer.

Examples:

- Mascot Dance
- Event Host
- Fun Games
- Live Performance
- Live Music
- Photo Booth
- Interactive Activities
- Couple Entry
- Kids Activities
- Interactive Food Experience

Each experience entry should have:

- experience type
- short title
- description
- event type association
- proof media

Optional future fields:

- price range
- duration
- notes
- availability
- team size

Do not overbuild these optional fields now unless the current product requires them.

---

# 18. Why Experience Portfolio Is Separate From Decor Portfolio

There are two different matching problems.

### Visual design matching

Client:

```text
venue_decorated image
```

Planner:

```text
venue_decorated portfolio images
```

Future similarity provider:

```text
image → image similarity
```

### Experience matching

Client:

```text
structured special requirements + custom text
```

Planner:

```text
experience title + description + tags + proof
```

Future similarity provider:

```text
text → text similarity
```

The data should preserve this distinction.

---


# Matching Architecture — High Level

Future matching pipeline:

```text
CLIENT EVENT
    │
    ├── Operating Area ───────────────┐
    ├── Date ─────────────────────────┤
    ├── Budget ───────────────────────┤
    ├── Required Services ────────────┤
    ├── Event Type ───────────────────┤
    ├── Structured Style Preferences ─┤
    ├── Decor Reference Image ────────┤
    └── Special Requirements ─────────┘
                                      │
                                      ▼
                             ELIGIBILITY FILTER
                                      │
                                      ▼
                            QUALIFIED PLANNER SET
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
                STRUCTURED MATCH             CLIP MATCHING
                                                │
                                    ┌───────────┴───────────┐
                                    ▼                       ▼
                              IMAGE ↔ IMAGE             TEXT ↔ TEXT
                                    │                       │
                        Client venue reference     Client special requirements
                        ↕                         ↕
                        Planner venue/decor       Planner experience portfolio
                        portfolio images          descriptions/tags
                                    │                       │
                                    └───────────┬───────────┘
                                                ▼
                                         FINAL SCORING
                                                │
                                                ▼
                                         RANKED PLANNERS
                                                │
                                                ▼
                                         LEAD DISTRIBUTION
```

---

# Hard Filters

These should run before expensive semantic/vector matching.

### 1. Operating area

Planner must serve the client's location according to the configured area rules.

### 2. Date availability

Planner must be available for the requested date.

The actual planner availability schema may be added in this phase or a subsequent phase, but the matching interface must expect it.

### 3. Event-specific budget compatibility

Client event budget must be compatible with planner budget for the same event type.

### 4. Required services

Planner must provide the client-required services for that event type.

### 5. Event type capability

Planner must have an active event-specific profile for that event type.

These filters significantly reduce the candidate set before CLIP.

---

# Structured Soft Matching

After hard eligibility:

Compare:

- color theme compatibility,
- overall style compatibility,
- decor feel,
- stage style,
- lighting style,
- event-specific visual preferences.

The exact score should be configurable.

Do not write constants into random React components.

Store matching weights in a dedicated service/config layer.

---

# CLIP Reference for Antigravity

CLIP stands for **Contrastive Language–Image Pre-training**.

Conceptually, CLIP learns a shared representation space for images and text.

An image can be converted into an embedding vector.

A text description can also be converted into an embedding vector.

Semantically related image/text concepts tend to be closer in that learned representation space.

The important capability for Celebrate is not image classification. It is **semantic similarity/retrieval**.

For this project, CLIP can later support two primary retrieval paths:

### Visual retrieval

```text
Client decorated venue reference image
                 ↓
            CLIP image encoder
                 ↓
          normalized embedding
                 ↓
       vector similarity search
                 ↓
Planner venue/stage/decor portfolio images
```

### Text retrieval

```text
Client special requirements
                 ↓
      structured text composition
                 ↓
             CLIP text encoder
                 ↓
          normalized embedding
                 ↓
       vector similarity search
                 ↓
Planner experience descriptions/tags
```

This means the product can compare meaning rather than exact keywords.

Example:

Client text:

```text
"I want a fun interactive atmosphere with a host and games for the guests."
```

Planner experience data:

```text
Title: Interactive Wedding Games
Description: Hosted guest participation games with an event MC.
```

A future CLIP text embedding pipeline can evaluate semantic closeness even though the wording is different.

---

# 39. CLIP Is Not a Complete Matching System

Do not tell the implementation team that “CLIP will decide the best planner.”

CLIP only provides similarity signals.

Business constraints still require relational filtering.

The overall matcher should remain:

```text
Hard Eligibility
      ↓
Structured Compatibility
      ↓
CLIP Similarity Signals
      ↓
Weighted Final Score
      ↓
Ranking
```

---

# 40. Model-Agnostic CLIP Integration Contract

The current repo should define an interface, not a model dependency.

Example:

```ts
export interface VisualSimilarityProvider {
  embedImage(input: {
    imageUrl: string;
    mediaId: string;
  }): Promise<EmbeddingResult>;

  embedText(input: {
    text: string;
    sourceId: string;
  }): Promise<EmbeddingResult>;

  similarity(a: number[], b: number[]): number;
}
```

And:

```ts
export interface EmbeddingResult {
  provider: string;
  model: string;
  modelVersion?: string;
  modality: 'image' | 'text';
  vectorId?: string;
  dimensions?: number;
}
```

The actual inference implementation can later be:

```text
CLIP ViT family
```

or another compatible multimodal embedding provider.

Do not hardcode a specific CLIP checkpoint until the AI implementation phase explicitly selects it.

---

# 41. Why Model Versioning Matters

Embeddings produced by one model/checkpoint should not silently be mixed with embeddings produced by another model.

Store metadata such as:

```text
provider = clip
model = <exact checkpoint name>
model_version = <version/checkpoint revision>
modality = image/text
```

When the model changes, embeddings should be re-generated or versioned rather than mixed.

This prevents invisible ranking drift.

---

# 42. Text Construction for CLIP

Do not send only one selected label at a time.

Construct a meaningful composite query from structured answers.

Example client text representation:

```text
Event: Wedding.
Visual style: Luxury, floral, contemporary.
Color theme: Pastel pink and ivory.
Decor feel: Elegant and soft.
Stage style: Grand floral stage.
Special requirements: Couple entry, event host, fun games.
Custom requirements: Warm candle-like lighting and a premium intimate feel.
```

For planner experience matching, construct comparable semantic text:

```text
Event: Wedding.
Experience: Event Host.
Capability: Professional MC for guest engagement and event flow.
Tags: wedding, host, audience interaction, games.
```

Do not make the text artificially long. Include high-value semantic information only.

---

# 43. Image Matching Scope

For the first visual matcher, prioritize:

```text
client_event_reference_media.media_type = venue_decorated
```

against:

```text
planner_portfolio_media.media_type = venue_decorated
```

for the same event type.

Optional entrance matching can be added as another signal:

```text
client entrance ↔ planner entrance
```

Do not merge entrance images and venue-decorated images into one undifferentiated visual pool.

Their semantics are different.

---

# 44. Experience Matching Scope

The experience matcher should use:

```text
client structured special requirement labels
+ client custom requirement text
```

against:

```text
planner_experience_entries.title
planner_experience_entries.description
planner_experience_entries.experience_type
```

The proof images can be embedded as an additional future signal, but they are not a substitute for structured experience metadata.

---

# 45. Candidate Search Order

Future implementation should follow this order:

```text
1. Event type
2. Operating area
3. Date availability
4. Budget compatibility
5. Required services
6. Event-specific planner profile is active
7. Structured style compatibility
8. Venue-decorated image similarity
9. Special-requirement / experience text similarity
10. Final weighted score
11. Rank
12. Lead distribution
```

This prevents expensive semantic search from running over every planner in the system.

---

# 46. Matching Service Boundaries

The future implementation should be separated into services/functions similar to:

```text
EligibilityFilter
StyleMatcher
VisualSimilarityProvider
TextSimilarityProvider
MatchScorer
PlannerRanker
LeadDistributor
```

Suggested orchestration:

```ts
const eligible = await eligibilityFilter.findCandidates(eventId);

const structuredScores = await styleMatcher.score(event, eligible);

const visualScores = await visualSimilarityProvider.matchVenueDecor(event, eligible);

const experienceScores = await textSimilarityProvider.matchExperiences(event, eligible);

const ranked = matchScorer.rank({
  eligible,
  structuredScores,
  visualScores,
  experienceScores,
});

return leadDistributor.prepare(ranked);
```

The actual implementation technology is intentionally deferred.

---

# 47. Do Not Implement the Final AI Engine Yet

For this phase, build only the **interfaces and data foundations** needed by the AI engine.

It is acceptable to include:

```text
src/services/matching/types.ts
src/services/matching/eligibility.ts
src/services/matching/scoring.ts
src/services/embeddings/types.ts
src/services/embeddings/provider.ts
```

But these should not pretend to perform actual CLIP inference.

Use explicit placeholders such as:

```ts
export class NotImplementedEmbeddingProvider {
  async embedImage(): Promise<never> {
    throw new Error('Embedding provider not configured yet');
  }
}
```

or keep the interface declaration only.

Do not produce random vectors.

Do not return hardcoded similarity scores.

---

# 48. Data Relationships

The intended relationship graph is:

```text
profiles
│
├── client_profiles
│      │
│      └── events
│            ├── event_requirements
│            ├── client_event_services ─── services
│            ├── client_event_style_preferences
│            │            └── event_type_style_options
│            └── client_event_reference_media
│
└── planner_profiles
       │
       └── planner_operating_areas
       │
       └── planner_event_profiles ─── event_types
              ├── planner_event_services ─── services
              ├── planner_event_styles
              │       └── event_type_style_options
              ├── planner_portfolio_media
              └── planner_experience_entries
                      └── planner_experience_media
```

---

# 49. Database Integrity Requirements

Add appropriate:

- foreign keys,
- unique constraints,
- check constraints where practical,
- timestamps,
- indexes on lookup columns,
- indexes on foreign keys,
- indexes for matching filters.

Useful indexing concepts include:

```text
events(client_id)
events(event_type_id)
events(city)
events(event_date)
planner_event_profiles(planner_id, event_type_id)
planner_operating_areas(planner_id, city)
planner_event_services(planner_event_profile_id, service_id)
planner_event_styles(planner_event_profile_id, style_option_id)
planner_portfolio_media(planner_event_profile_id, media_type)
client_event_reference_media(event_id, media_type)
```

The exact indexes should follow actual query patterns.

---

# 50. Submission / Draft Model

The wizard should support draft saving.

Recommended lifecycle:

```text
draft
   ↓
ready
   ↓
matching_pending
   ↓
matched
```

However, only introduce statuses that the current feature actually uses.

Do not build the entire proposal/booking workflow in this phase.

A client should be able to leave the wizard and return later without losing completed inputs.

---

# 51. Media Upload Workflow

Recommended client flow:

```text
Select local image
      ↓
Validate type/size
      ↓
Show local preview
      ↓
Upload to Supabase Storage
      ↓
Insert media metadata row
      ↓
Keep media row linked to event
```

Planner flow:

```text
Select event type
      ↓
Create/update planner event profile
      ↓
Upload venue-decorated images
      ↓
Upload entrance images (optional)
      ↓
Create experience entries
      ↓
Upload experience proof
      ↓
Validate portfolio completeness
      ↓
Mark event profile active/matchable
```

Uploads should be resilient and should not leave orphaned database rows where reasonably avoidable.

---

# 52. UX Requirement for Portfolio Uploads

The planner UI must make the mandatory visual proof unmistakable.

Use labels such as:

```text
Venue / Stage Designs *

Upload at least one decorated venue or stage setup.
This is required for your event profile to be discoverable.
```

For optional entrance media:

```text
Entrance Designs

Optional — add examples of entrance decoration you provide.
```

For experiences:

```text
Special Experiences

Show what makes your service different.
Add proof for things like hosts, games, mascot dance, live performances, or photo booths.
```

Do not imply that AI is already analyzing the images.

---

# 53. UX Requirement for Client Reference Images

The client UI should explain the value without exposing implementation jargon.

Good product copy:

```text
Show us the look you love

Upload a decorated venue or stage reference. We’ll use it to understand the visual direction you have in mind.
```

Do not write “Upload your CLIP embedding reference.”

CLIP is an implementation detail.

---

# 54. Design-System Requirements

All new screens must follow the existing Celebrate visual system.

Canonical palette:

```text
Deep Navy       #0A2947
Warm Cream      #F3E4C9
Muted Sage-Grey #D3D4C0
Terracotta Brown#8B5E3C
```

Typography:

```text
Display: DM Serif Display
UI/body: Inter
```

Visual direction:

- premium,
- warm,
- refined,
- editorial,
- calm,
- minimal.

Avoid:

- generic SaaS dashboard styling,
- excessive gradients,
- neon colors,
- glassmorphism,
- overly rounded cards,
- excessive animation.

Use the existing UI kit and established components where available.

Do not silently redesign the landing page.

---

# 55. Accessibility

All form controls should have:

- visible labels,
- keyboard accessibility,
- appropriate focus states,
- useful error messages,
- disabled/loading states,
- accessible image upload controls,
- alt text or decorative treatment for previews where applicable.

Do not rely solely on color to communicate selection or validation.

---

# 56. Security Requirements

Never place:

- Supabase service-role key,
- private storage credentials,
- model API keys,
- vector DB credentials

in browser-visible code.

The browser may use the public Supabase client key according to the project's current architecture and must be protected by RLS.

AI inference should be server-side/backend-side when introduced.

Private media should be accessed using authorized paths/signed URLs.

---

# 57. Portability Requirements

The implementation must remain portable.

Avoid:

- hardcoded Supabase project URLs outside central config,
- database logic scattered through UI components,
- vendor-specific AI logic inside React components,
- permanent dependency on one vector database,
- hardcoded event option arrays duplicated across multiple components.

Prefer:

```text
Supabase config → central config
Database schema → migrations
Event taxonomies → database/config
Matching → service interfaces
AI model → provider adapter
Vector store → provider adapter
```

---

# 58. Suggested Source Structure

Adapt to the repository's existing structure instead of forcing an unrelated architecture.

Possible structure:

```text
src/
  config.js
  lib/
    supabase.ts

  features/
    client-events/
      components/
        EventWizard.tsx
        steps/
          EventBasicsStep.tsx
          EventScheduleStep.tsx
          EventLocationStep.tsx
          EventScaleStep.tsx
          EventBudgetStep.tsx
          EventServicesStep.tsx
          EventStyleStep.tsx
          EventSpecialRequirementsStep.tsx
          EventReferenceMediaStep.tsx
      services/
        eventService.ts
      types.ts

    planner-profile/
      components/
        PlannerProfilePage.tsx
        PlannerEventProfileEditor.tsx
        sections/
          BusinessProfileSection.tsx
          OperatingAreaSection.tsx
          SupportedEventsSection.tsx
          EventBudgetSection.tsx
          EventStyleCapabilitiesSection.tsx
          EventServicesSection.tsx
          DecorPortfolioSection.tsx
          ExperiencePortfolioSection.tsx
      services/
        plannerProfileService.ts
      types.ts

    matching/
      types.ts
      eligibility.ts
      scoring.ts

    embeddings/
      types.ts
      provider.ts
      notConfiguredProvider.ts

  routes/
    ...

supabase/
  migrations/
    ...
```

Do not move large parts of the existing project solely to conform to this example.

---

# 59. Migration Strategy

Before changing the database:

1. Inspect existing migrations.
2. Inspect current tables.
3. Inspect existing RLS.
4. Inspect existing storage buckets/policies.
5. Reuse tables that already represent the same concept.
6. Only add new migrations for missing concepts.
7. Never silently delete existing unrelated data.

The current phase must be compatible with the explicit project history that older client-side proposal/booking work may have been reset.

Do not resurrect deprecated proposal, booking, messaging, or notification tables unless they actually exist and are required by the current codebase.

---

# 60. Seed Data

Seed the nine event types.

Seed the event-specific style categories/options.

Seed the service catalog.

Seed event-specific service availability if that table is used.

Seed special-requirement catalogs if implemented as data.

Seed data should be deterministic and idempotent.

Use stable slugs.

Example:

```sql
insert into event_types (slug, name, sort_order)
values
  ('wedding', 'Wedding', 1),
  ('reception', 'Reception', 2),
  ('engagement', 'Engagement', 3),
  ('corporate', 'Corporate Event', 4),
  ('haldi', 'Haldi', 5),
  ('mehendi', 'Mehendi', 6),
  ('sangeet', 'Sangeet', 7),
  ('birthday', 'Birthday', 8),
  ('private_party', 'Private Party', 9)
on conflict (slug) do nothing;
```

Do the same for all configurable option sets.

---

# 61. Planner Matchability Definition

A planner event profile should be considered `matchable` only when minimum information exists.

Conceptually:

```text
active profile
+ valid budget range
+ at least one service
+ configured event style capability
+ at least one venue_decorated image
= matchable event capability
```

Do not make the entire planner account invisible because one event profile is incomplete.

A planner may be matchable for Wedding and incomplete for Birthday.

---

# 62. Client Event Match Readiness

A client event is ready for future matching when:

```text
valid event basics
+ valid date/location
+ valid budget
+ event-specific requirements
+ required styles
+ required services
+ at least one venue_decorated reference image
= match-ready event
```

The exact status implementation can be introduced later, but the validation boundary should already be explicit.

---

# 63. What the AI Layer Will Eventually Receive

The future matching service should be able to request a normalized event representation such as:

```ts
interface MatchableClientEvent {
  eventId: string;
  eventType: string;
  city: string;
  date: string;
  guestCount: number;
  budget: {
    min?: number;
    max: number;
  };
  requiredServiceIds: string[];
  stylePreferences: Array<{
    category: string;
    option: string;
  }>;
  specialRequirements: string[];
  customRequirements?: string;
  referenceMedia: Array<{
    id: string;
    mediaType: 'venue_decorated' | 'entrance';
    storagePath: string;
  }>;
}
```

And a planner representation:

```ts
interface MatchablePlannerEventProfile {
  plannerId: string;
  plannerEventProfileId: string;
  eventType: string;
  operatingAreas: Array<{
    city: string;
    area?: string;
  }>;
  budget: {
    min: number;
    max: number;
  };
  serviceIds: string[];
  styleCapabilities: Array<{
    category: string;
    option: string;
  }>;
  portfolioMedia: Array<{
    id: string;
    mediaType: 'venue_decorated' | 'entrance';
    storagePath: string;
  }>;
  experiences: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
  }>;
}
```

This contract keeps the AI layer independent of the React form.

---

# 64. Example Future Scoring Model

Do not treat these values as final production weights.

A future scorer could conceptually calculate:

```text
Final Score =
    structured_style_score
  + decor_visual_score
  + experience_text_score
  + optional_entrance_visual_score
```

Hard filters are not simply “low score.”

An ineligible planner should normally be removed before scoring.

Scoring weights must be configurable/versioned.

For example, a future version might choose something like:

```text
Style compatibility      20%
Venue visual similarity  45%
Experience similarity    25%
Entrance similarity      10%
```

These numbers are examples only.

Do not encode them as final business truth.

---

# 65. Lead Distribution Is Separate

The highest score does not automatically mean “send only to this planner.”

Ranking answers:

> Which eligible planners are the best fit?

Lead distribution answers:

> Which qualified planners should receive this lead, in what order, and under what rules?

Keep these concepts separate.

Future distribution may use:

- top-N release,
- score threshold,
- staged release,
- planner response window,
- fairness/business rules.

Do not build those policies into the client form.

---

# 66. Testing Requirements

The implementation should include tests for the key domain rules.

At minimum:

### Client

- event-type configuration loads correctly,
- Step 6 does not contain Guest Experience,
- event-specific style categories change with event type,
- `venue_decorated` media is required for final submission,
- entrance media remains optional,
- service selections persist,
- style selections persist.

### Planner

- each selected event type creates/updates one event profile,
- planner event budget validates correctly,
- planner services persist correctly,
- planner styles persist correctly,
- at least one `venue_decorated` portfolio image is required for matchability,
- multiple portfolio images can coexist,
- experience entries and proof media persist correctly.

### Security

- client cannot read another client's event data,
- planner cannot modify another planner's event profile,
- storage access follows ownership rules.

### Matching boundary

- a matchable event representation can be constructed without CLIP,
- a matchable planner representation can be constructed without CLIP,
- the embedding provider interface exists but is not falsely operational.

---

# 67. Antigravity Implementation Order

Use this exact order unless the existing repo requires a safe adjustment.

## Phase A — Inspect

- inspect current repo tree,
- inspect package.json,
- inspect routes,
- inspect existing auth/profile code,
- inspect Supabase client/config,
- inspect current migrations,
- inspect current tables/RLS/storage,
- inspect existing UI components/design system,
- inspect whether old client tables are actually present.

Do not change code during inspection.

## Phase B — Data Foundation

- create/update event configuration tables,
- create/update service catalog,
- create/update client event requirement tables,
- create/update planner event-profile tables,
- create/update portfolio/experience tables,
- add indexes/constraints,
- add RLS,
- add storage policies,
- add seed data.

## Phase C — Client Form

- implement one data-driven event wizard,
- implement all required steps,
- remove Guest Experience from Step 7,
- implement Step 8 Special Requirements separately,
- implement Step 9 Reference Media,
- enforce venue-decorated reference requirement,
- connect form to Supabase.

## Phase D — Planner Form

- implement planner profile page,
- implement operating areas,
- implement supported event types,
- implement event-specific budget/services/styles,
- implement venue-decorated portfolio upload,
- implement entrance portfolio upload,
- implement experience portfolio entries + proof.

## Phase E — AI Boundary

- add typed matching contracts,
- add embedding provider interface,
- document CLIP architecture,
- do not implement inference yet.

## Phase F — Verification

- run build,
- run typecheck,
- run tests,
- verify Supabase migrations,
- verify RLS,
- verify uploads,
- verify all routes,
- verify no landing-page regressions.

---

# 68. Explicit Non-Goals for This Phase

Do NOT implement:

- actual CLIP model download/inference,
- vector database integration unless already required by existing infrastructure,
- automatic planner ranking UI,
- proposal marketplace,
- planner lead inbox,
- messaging,
- payment flow,
- booking flow,
- notification system,
- AI design canvas,
- automatic image tagging using AI.

The purpose of this phase is to make the data collection and architecture ready.

---

# 69. Important Anti-Patterns to Avoid

### Anti-pattern 1
Nine separate React forms for nine events.

Use one configurable form.

### Anti-pattern 2
One giant `event_preferences` JSON object containing every concept.

Normalize high-value relations.

### Anti-pattern 3
Planner services stored as comma-separated text.

Use relational rows.

### Anti-pattern 4
One generic `planner_portfolio_images` table with no semantic media type.

Keep `venue_decorated` and `entrance` distinct.

### Anti-pattern 5
Treating all planner images as equivalent.

They represent different semantic categories.

### Anti-pattern 6
Using CLIP in the browser.

Use a secure backend/AI service later.

### Anti-pattern 7
Pretending a placeholder similarity score is AI.

Do not do this.

### Anti-pattern 8
Hardcoding final matching weights in UI.

Keep matching policy in a dedicated service/config layer.

### Anti-pattern 9
Public-read policies for all user media during development.

Protect data from the start.

### Anti-pattern 10
Rebuilding or changing the approved landing page while adding the new feature.

Do not touch unrelated surfaces.

---

# 70. Definition of Done

This phase is complete when:

1. A client can select any of the nine event types.
2. The same event wizard adapts Step 7 to the selected event type.
3. Step 7 contains visual preference categories only and **does not contain Guest Experience**.
4. Step 8 separately captures special requirements.
5. The client can upload a required `venue_decorated` reference and optional `entrance` references.
6. Client data persists in normalized Supabase structures.
7. A planner can configure multiple supported event types.
8. Each planner event type has its own budget, services, and style capabilities.
9. Each planner event profile can hold multiple decor portfolio images.
10. Each planner event profile requires at least one `venue_decorated` portfolio image for matchability.
11. Planners can add experience entries and proof media.
12. RLS prevents cross-user modification/access.
13. Routes exist for client event creation/editing and planner profile/event portfolio management.
14. The codebase contains a clear, documented CLIP/matching architecture without falsely claiming CLIP is integrated.
15. The future AI layer can consume normalized client/planner data without rewriting the forms or database model.
16. Existing Celebrate design language and unrelated pages remain intact.

---

# 71. Final Architecture Summary

The core idea is:

```text
                CELEBRATE
                    │
          ┌─────────┴─────────┐
          │                   │
       CLIENT              PLANNER
          │                   │
     Event Form          Profile Form
          │                   │
   Structured Data       Event Profiles
          │                   │
   ┌──────┼───────┐     ┌─────┼─────────────┐
   │      │       │     │     │             │
Services Styles  Media Budget Services    Portfolio
   │      │       │     │     │             │
   │      │       │     │     │       ┌─────┴─────┐
   │      │       │     │     │       │           │
   │      │       │     │     │    Decor      Experiences
   │      │       │     │     │       │           │
   └──────┴───────┴─────┴─────┴───────┼───────────┘
                                      │
                            FUTURE MATCHING LAYER
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
        Hard Filters            Structured Match          CLIP Layer
             │                        │                        │
       Area / Date /            Styles / Services      Image ↔ Image
       Budget / Service                                  Text ↔ Text
             │                        │                        │
             └────────────────────────┼────────────────────────┘
                                      │
                              FINAL RANKING
                                      │
                              LEAD DISTRIBUTION
```

The current engineering target is everything **above** the final matching/AI execution boundary.

The future CLIP layer should plug into this architecture rather than dictate the architecture.

---

# 72. Instruction to Antigravity

Treat this document as the current product/engineering reference.

Before writing code, compare it with the actual repository and current Supabase state.

Where the document says “recommended”, preserve the concept but adapt names to existing conventions.

Where the document says “required”, treat it as a product constraint.

Do not resurrect removed features simply because older code or old memories may suggest them.

The most important current correction is:

> **STEP 6 — “HOW SHOULD YOUR EVENT LOOK?” must NOT contain Guest Experience.**

Special requirements belong in the separate following step.

The current phase builds the forms, Supabase data model, routes, RLS/storage foundation, and CLIP-ready interfaces. Actual CLIP model inference is a later phase.
