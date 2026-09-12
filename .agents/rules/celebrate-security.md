---
trigger: always_on
---

# Celebrate Security Rules

Security-sensitive behavior must never rely solely on frontend checks.

Always verify:

- ownership
- authentication
- authorization
- RLS
- server-side validation
- lifecycle state

Never trust:

- hidden UI fields
- disabled buttons
- client-side role checks
- client-side proposal counts
- client-side payment success flags
- client-provided ownership identifiers

Never expose privileged Supabase credentials.

Never allow the browser to directly perform privileged multi-table business operations when they require server-side authorization or transactionality.

For sensitive data:

- expose the minimum required fields
- enforce access at the backend/database level
- consider IDOR attacks
- consider concurrent requests
- consider stale client state

For any new sensitive feature, explicitly evaluate:

1. authentication
2. authorization
3. ownership
4. data leakage
5. race conditions
6. auditability