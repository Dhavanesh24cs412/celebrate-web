---
trigger: always_on
---

# Celebrate Core Engineering Rules

This workspace contains the Celebrate application.

Always:

1. Preserve the existing Celebrate architecture unless a change is explicitly requested.
2. Use React + Vite + TypeScript.
3. Use Supabase for backend infrastructure.
4. Use the canonical Celebrate UI kit:
   `docs/Celebrate-UI-Kit.png`
5. Use the canonical product workflow:
   `docs/Celebrate-Workflow.svg`
6. Never invent major business behavior silently.
7. Never put business-critical authorization logic only in React.
8. Never expose Supabase service-role credentials to the client.
9. Never bypass RLS.
10. Database schema changes must use migrations.
11. Avoid unnecessary dependencies.
12. Reuse existing components before creating new ones.
13. Maintain responsive behavior.
14. Test meaningful feature changes.
15. Do not rewrite unrelated code.
16. Do not introduce a second visual design language.
17. Use DM Serif Display for display typography and Inter for UI/body typography.
18. Maintain the Celebrate brand color system.
19. Treat lifecycle states as explicit domain rules.
20. Treat server-confirmed state as authoritative.

Before implementing a significant feature:

- inspect the relevant existing code
- inspect the applicable skill
- identify data/security implications
- implement the smallest correct change

After implementing:

- run relevant tests
- run the production build
- inspect the browser behavior
- report failures honestly