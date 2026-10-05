# Celebrate: AI-Powered Event Operating System

Celebrate is an **AI-powered Operating System for the Event Industry** designed to unify **Clients** and **Event Management Teams (Planners)** within a single, intelligent ecosystem. 

By digitizing the highly fragmented event lifecycle—from intelligent client acquisition and AI-assisted proposal generation to business operations—Celebrate provides a highly sophisticated, transparent, and visually rich platform to orchestrate celebrations of all scales.

---

## Tech Stack & Architecture

Celebrate is built with a modern, decoupled architecture designed for high performance, strict security, and seamless AI integration.

### **Frontend App**
- **Framework:** React 18 powered by Vite.
- **Language:** TypeScript for strict end-to-end type safety.
- **Styling:** Tailwind CSS with custom design tokens for a premium, Pinterest-like aesthetic.
- **Components & Animation:** Lucide React (iconography) and native CSS/Tailwind transitions.
- **Architecture:** Domain-driven design isolating `client`, `planner`, and `core` logic to enforce clear service boundaries.

### **Backend & Infrastructure**
- **BaaS Platform:** Supabase.
- **Database:** PostgreSQL with strict relational modeling.
- **Security:** Extensive Row Level Security (RLS) policies ensuring strict data isolation between planner portfolios and client requirements.
- **Storage:** Supabase Storage buckets configured for high-res portfolio assets, event styles (.webp), and client reference imagery.
- **State & Realtime:** Supabase client bindings for real-time reactivity and state synchronization.

### **AI & Machine Learning (CLIP & pgvector Integration)**
The platform's intelligent matching is powered by a dedicated Python AI microservice that handles vectorization, integrating seamlessly with Supabase's **pgvector** extension.
- **AI Microservice Stack:** FastAPI (Python), PyTorch, Hugging Face `transformers`, and Pillow.
- **CLIP Model:** `openai/clip-vit-base-patch32` (generating 512-dimensional embeddings).
- **Vector Storage:** The `pgvector` extension is utilized within Supabase PostgreSQL to securely store the 512-dimensional catalog vectors generated from the planners' uploaded portfolio images.
- **Matching Mechanism:** To precisely match clients with the best planners, the system will execute **cosine similarity** searches comparing the client's visual requests (mood boards/style descriptions) against the planners' image vector embeddings.
- **Integration Boundary:** The CLIP model operates strictly behind a backend service boundary. The current database schemas seamlessly ingest human-readable styles and asset links, priming them for vectorization and semantic search without requiring any structural rewrites.

---

## User Roles

The platform serves two primary sides of the event marketplace:

1. **Clients**
   Individuals, families, or corporations planning events (Weddings, Corporate Events, Birthdays, etc.). Clients use a visually immersive, multi-step wizard to define their event parameters, budgets, and visual style preferences, and ultimately compare and accept proposals from matched planners.

2. **Event Management Teams (Planners)**
   Professional planners and event management businesses. Planners use the platform to receive highly qualified leads, submit customized AI-assisted proposals (via an Event Design Canvas), and manage their day-to-day business operations through a centralized dashboard.

---

## Workflow

Celebrate streamlines the entire lifecycle from discovery to execution. 

> **Architecture Flow Diagram**  
> [![Celebrate Architecture](https://app.eraser.io/workspace/UzGIe11f6za5abDBfnWC)]
> 

1. **Client Request:** Clients navigate a highly visual, guided wizard to input hard requirements (date, budget, guest count) and stylistic preferences (color palettes, overall style imagery).
2. **Smart Matching:** The system evaluates the request and identifies highly capable planners (Detailed in the Matching section below).
3. **Proposal Generation:** Matched planners review the event and draft customized proposals.
4. **Booking & Operations:** The client compares proposals, selects the best fit, and transitions the event to a `booked` status, moving the interaction into the operational phase.

---

## 🧠 Smart Matching Engine (How We Match)

The matching engine is the core intelligence of Celebrate. It does not rely on random discovery; instead, it uses a multi-layered funnel to pair clients with the perfect planner.

### **Phase 1: Hard Eligibility Filtering**
Before any AI processing occurs, the system runs strict relational queries to filter out incompatible planners. 
- **Location:** Does the planner operate in the requested city/area?
- **Event Type:** Does the planner handle this specific category (e.g., Corporate vs. Wedding)?
- **Budget Intersect:** Does the client's budget range intersect with the planner's historical or stated event pricing?

### **Phase 2: Structured Preference Match**
The engine evaluates structured tags such as services required (e.g., Catering, Decor) and scale (e.g., 500+ guests) against the planner's verified capabilities.

### **Phase 3: CLIP-Based Visual & Semantic Similarity**
*(Data Foundation Complete; Inference Engine Pending)*
Once the eligible pool is established, the future CLIP ViT model takes over:
- **Visual Similarity:** It compares the client's uploaded reference images or selected style cards (e.g., "Boho", "Minimalist") against the actual photos in the planner's portfolio.
- **Text/Semantic Similarity:** It evaluates the semantic intent behind the client's textual requirements against the planner's business description and past event execution logs.

### **Phase 4: Final Ranking & Distribution**
The planners are scored based on the combined output of Phase 2 and Phase 3. The highly ranked planners receive the lead and are invited to submit a proposal.

---

## 🔐 Authentication, API, and Database

- **Authentication:** Powered entirely by Supabase Auth, supporting secure Email/Password logins. The session state is strictly managed and tied to the `users` table.
- **Row Level Security (RLS):** Security is enforced at the database level. Clients can only see their own events and received proposals. Planners can only see events they are matched with, their own portfolios, and their own submitted proposals. Service-role credentials are strictly kept out of the frontend.
- **Migrations:** Database schema updates, enumerations (like event status lifecycles from `open` to `booked`), and configurations are maintained using Supabase migrations, ensuring portability across environments.

---

## 🛠️ Local Development Setup

To get Celebrate running on your local machine:

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local database testing)

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/your-username/celebrate.git
cd celebrate
npm install
```

### 3. Environment Variables
Create a `.env` or `.env.local` file in the root directory and add your Supabase project keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Running the Development Server
Boot up the Vite dev server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/`.
