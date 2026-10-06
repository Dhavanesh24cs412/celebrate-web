# Contributing to Celebrate

---

## Project Overview

This is a React-based application with a collaborative workflow. The repository uses **Supabase CLI**, **Docker**, **Git**, **GitHub** and **Pull Requests** to manage contributions efficiently.

### Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4
- **Backend/Auth/DB:** Supabase
- **AI Services:** Python, PyTorch, FastAPI

---

## Table of Contents

- [Getting Started](#getting-started)
- [For Contributors (Fork & PR)](#for-contributors-fork--pr)
- [For Admins (Review & Merge)](#for-admins-review--merge)
- [Pull Request Template](#pull-request-template)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Troubleshooting](#troubleshooting)

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- Git configured
- Python 3.10+ (for AI services)

### Local Database Setup (Required)

To protect production data and ensure a stable testing environment, **contributors must never connect directly to the production database**. Instead, Celebrate uses Supabase's local development workflow powered by Docker. This spins up an isolated, full-stack replica of the database on your local machine.

1. **Install Prerequisites**: Ensure you have [Docker Desktop](https://docs.docker.com/get-docker/) installed and running, along with the [Supabase CLI](https://supabase.com/docs/guides/cli).
2. **Initialize Local Database**:
   Open your standard terminal (e.g., VS Code Terminal, PowerShell, or Command Prompt) and ensure you are in the root directory of the cloned project (`cd celebrate-web`). With Docker running, start your isolated environment:
   ```bash
   npx supabase start
   ```
   *(This downloads Supabase Docker images and starts an isolated local Postgres database, Auth, and Storage server.)*
3. **Apply Database Migrations (Schema Only)**:
   ```bash
   npx supabase migration up
   ```
   ***How this works (Security Note):** This command does **NOT** connect to the production database and does **NOT** download live user data. It reads the `.sql` migration files stored inside the `supabase/migrations/` folder in this repository and executes them to recreate the empty tables, relationships, and policies locally.*
4. **Environment Variables**:
   Create a `.env.local` file in the root directory and copy the local `API URL` and `anon key` provided by the CLI output:
   ```env
   # Use the local Supabase credentials (DO NOT use production keys)
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c... (copy your specific key from CLI output)
   ```
5. **Install Dependencies & Run**:
   ```bash
   npm install
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173/`.
6. **Syncing Future Database Changes**:
   When you pull new code from the repository, you may receive new database migration files. To sync your local database:
   - **Standard Update**: Run `npx supabase migration up` to apply only the newly downloaded migrations.
   - **Clean Slate Reset (Recommended)**: Run `npx supabase db reset` to completely wipe and rebuild your local database from scratch, ensuring a perfectly clean environment.

---

## For Contributors (Fork & PR)

### Step 1: Fork the Repository

1. Visit the main repository  
   👉 [Celebrate Web Repository](https://github.com/Dhavanesh24cs412/celebrate-web)
2. Click **Fork** (top-right corner)
3. Your fork will be created at:  
   ```
   https://github.com/your-username/celebrate-web.git
   ```

---

### Step 2: Clone Your Fork Locally

```bash
git clone https://github.com/your-username/celebrate-web.git
cd celebrate-web
```

---

### Step 3: Add Upstream Remote (Main Repository)

```bash
git remote add upstream https://github.com/Dhavanesh24cs412/celebrate-web.git
git fetch upstream
```

Verify remotes:

```bash
git remote -v
```

---

### Step 4: Create a Feature Branch

> **Never work directly on `main`**

```bash
git checkout main
git pull upstream main
git checkout -b your-name-branch
```

**Branch Naming Conventions:**

- `feature/` – new features
- `fix/` – bug fixes
- `docs/` – documentation
- `chore/` – maintenance tasks

> **Tip:** Use your name as part of the branch name to avoid branch clutter. Example: `feature/yourname-branch`

---

### Step 5: Make Your Changes

Make your changes, then stage and commit:

```bash
git add .
git commit -m "feat: add brief description"
```

---

### Step 6: Push Changes and Create a Pull Request

```bash
git push origin your-name-branch
```

Then open a **Pull Request** on GitHub with a clear description of your changes.

---

## For Admins (Review & Merge)

### Reviewing Pull Requests

1. Check out the PR branch:

```bash
git checkout main
git pull origin main
```
2. Admin Testing Workflow

```bash
# Get the latest data from the repository
git fetch origin
```
3. Check out the contributor's branch:

```bash
# Switch to their branch
gh pr checkout <PR-number>

# Merge the changes and delete the branch
gh pr merge --merge --delete-branch
```
4. Clean Install & Run:

```bash
# Install any new packages they might have added
npm install

# Run the development server
npm run dev
```
5. Verification Checklist:
   
   - [ ] Does the app start without console errors?
   - [ ] Does the specific feature/fix work as described in the PR?
   - [ ] Does it work on different screen sizes (Responsive Check)?
   - [ ] Did it break any existing features?

6. Merge via GitHub (Recommended):

   Once testing passes, return to the GitHub PR web interface and select "Squash and merge" to keep the main history clean.
   
7. Cleanup your local environment:

```bash
# Switch back to main
git checkout main

# Update your local main with the new merge
git pull origin main

# Delete the local copy of their feature branch
git branch -d <branch-name>
```

---

## Pull Request Template

When creating a PR, include the following information in `.github/pull_request_template.md` (or directly in the PR description):

```markdown
## Changes
- Brief description of changes

## Why
- Reason for changes

## Testing
- How to test the changes

## Screenshots
- Attach relevant screenshots if applicable
```

---

## Commit Message Guidelines

Follow the conventional commits format:

```text
feat: add login validation
fix: mobile navbar overlap
docs: update README
chore: update dependencies
```

**Format:** `<type>: <description>`

---

## Troubleshooting

| Issue | Solution |
|------|----------|
| `npm install` fails | `rm -rf node_modules package-lock.json && npm install` |
| Merge conflict | `git pull upstream main` and resolve conflicts manually |
| Branch is behind main | `git pull upstream main` to sync with latest changes |
| Accidentally committed to main | Create a new branch and cherry-pick commits |

---

## Need Help?

If you encounter any issues, please:
1. Check the **Troubleshooting** section above
2. Review existing issues on GitHub
3. Create a new issue with a clear description

---
