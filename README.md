# Celebrate: Intelligent Event Planning Marketplace

Celebrate is a modern **event-planning marketplace** built to connect clients with the right event planners based on more than basic filters. It combines structured event requirements, visual references, planner portfolios, and **CLIP-based semantic matching** to understand both what a client wants and what a planner can deliver.

Using **CLIP (Contrastive Language–Image Pre-training)**, Celebrate can connect visual inspiration and textual preferences with relevant planner portfolio content, enabling deeper matching based on event style, aesthetics, services, experiences, and overall vision.

By bringing clients, planners, event requirements, portfolios, proposals, and event workflows into one connected ecosystem, Celebrate transforms fragmented event planning into a more intelligent, transparent, and visually driven experience—from discovering the right planner to turning an idea into a complete celebration.

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
> [![Celebrate Architecture](https://drive.google.com/file/d/1Z97tQORwSt0C7ikZCtl5x4dENeX3jqn2/view)]
> 

1. **Client Request:** Clients navigate a highly visual, guided wizard to input hard requirements (date, budget, guest count) and stylistic preferences (color palettes, overall style imagery).
2. **Smart Matching:** The system evaluates the request and identifies highly capable planners (Detailed in the Matching section below).
3. **Proposal Generation:** Matched planners review the event and draft customized proposals.
4. **Booking & Operations:** The client compares proposals, selects the best fit, and transitions the event to a `booked` status, moving the interaction into the operational phase.

---

## Smart Matching Engine (How We Match)

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

## Authentication, API, and Database

- **Authentication:** Powered entirely by Supabase Auth, supporting secure Email/Password logins. The session state is strictly managed and tied to the `users` table.
- **Row Level Security (RLS):** Security is enforced at the database level. Clients can only see their own events and received proposals. Planners can only see events they are matched with, their own portfolios, and their own submitted proposals. Service-role credentials are strictly kept out of the frontend.
- **Migrations:** Database schema updates, enumerations (like event status lifecycles from `open` to `booked`), and configurations are maintained using Supabase migrations, ensuring portability across environments.

---

## Local Development & Contributor Setup

To protect production data and ensure a stable testing environment, **contributors must never connect directly to the production database**. Instead, Celebrate uses Supabase's local development workflow powered by Docker. This spins up an isolated, full-stack replica of the database on your local machine.

### 1. Prerequisites
- **Git** & **Node.js** (v18 or higher recommended)
- **Docker Desktop**: Must be installed and running ([Download Docker](https://docs.docker.com/get-docker/))
- **Supabase CLI**: Required for local DB management ([Installation Guide](https://supabase.com/docs/guides/cli))

### 2. Fork, Clone & Install
Fork the repository on GitHub, clone it to your local machine, and install dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/celebrate.git
cd celebrate-web
npm install
```

### 3. Initialize the Local Database
Open your standard terminal (e.g., VS Code Terminal, PowerShell, or Command Prompt) and ensure you are in the root directory of the cloned project (`cd celebrate-web`).

With Docker running in the background, use `npx` to run the Supabase CLI and spin up your isolated local environment:
```bash
npx supabase start
```
*Note: This command downloads the Supabase Docker images and starts a local Postgres database, Auth server, and Storage bucket. The initial run may take a few minutes.*

Once the containers are running, the terminal will output your local credentials (including `API URL` and `anon key`).

### 4. Apply Database Migrations (Schema Only)
To ensure your local database structure precisely matches production, apply the repository's migrations:
```bash
npx supabase migration up
```
***How this works (Security Note):** This command does **NOT** connect to the production database and does **NOT** download live user data. It simply reads the `.sql` migration files stored inside the `supabase/migrations/` folder in this Git repository and executes them to recreate the empty tables, relationships, and RLS policies locally.*

### 5. Environment Variables
Create a `.env.local` file in the root directory. Copy the local `API URL` and `anon key` provided by the `supabase start` output:
```env
# Use the local Supabase credentials (DO NOT use production keys)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c... (copy your specific key from CLI output)
```

### 6. Run the Application
Boot up the Vite development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173/`. You can now safely build UI changes, interact with the application, and test database writes securely within your local Docker container! When you're finished, you can stop the local database by running `supabase stop`.

### 7. Syncing Future Database Changes
When you pull new code from GitHub, you might also receive new database migrations (e.g., if a teammate added a new table). To sync your local Docker database with these new changes:
- **Standard Update**: Run `npx supabase migration up`. Supabase will detect the newly pulled `.sql` files and apply only the new changes.
- **Clean Slate Reset (Recommended)**: Run `npx supabase db reset`. This completely wipes your local database and rebuilds it from scratch using all migration files. This is highly recommended when pulling major updates to ensure your local schema is perfectly clean.
