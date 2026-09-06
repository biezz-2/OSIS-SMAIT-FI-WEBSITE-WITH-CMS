# MUBES Dual-Layer Security & Data Flow Codemap
# Target: Devin AI Assistant

## 1. Sequence & Security Verification Flow

```
[ Operator / Evaluator ]         [ Next.js Client ]          [ Next.js BFF (/api/mubes) ]         [ Clerk Auth ]         [ Strapi CMS + PostgreSQL ]
           │                              │                                │                           │                         │
           │── 1. Ctrl+Shift+M ──────────>│                                │                           │                         │
           │   (or Secret Footer Click)   │── 2. Open Clerk SignIn Modal ─>│                           │                         │
           │                              │                                │                           │                         │
           │── 3. Submit Credentials ─────────────────────────────────────────────────────────────────>│                         │
           │                              │                                │                           │── 4. Verify & Return ──>│
           │                              │<── 5. Session Token (JWT) ─────────────────────────────────│      JWT Token          │
           │                              │                                │                                                     │
           │                              │── 6. Request Protected LPJ ───>│                                                     │
           │                              │      (Bearer Client Token)     │── 7. Validate Clerk Session                          │
           │                              │                                │── 8. Check Whitelist in Strapi (api::akses-user) ──>│
           │                              │                                │<── 9. Role Confirmed (Operator/Evaluator) ──────────│
           │                              │                                │                                                     │
           │                              │                                │── 10. Fetch LPJ via Internal Elevated Token ───────>│
           │                              │                                │<── 11. Return Financial & Audit Data ───────────────│
           │                              │                                │                                                     │
           │                              │<── 12. In-Place JSON Response ─│                                                     │
           │                              │    (No Layout Shift / 200 OK)  │                                                     │
           │<── 13. DOM Injected ─────────│                                │                                                     │
           │    (LPJ Accordion rendered)  │                                │                                                     │
```

---

## 2. Protected Data Assets & Endpoints

### A. Next.js BFF Route: `src/app/api/mubes/lpj/[slug]/route.ts`
- **Method**: `GET`
- **Authentication**: Requires valid Clerk session header.
- **Authorization**: Validates against `api::akses-user` (whitelist by email).
- **Backend Relay**: Contacts `http://127.0.0.1:1337/api/mubes-lpjs` using Strapi `STRAPI_API_TOKEN_MUBES`.
- **Response**: Sanitized LPJ payload (budget realization, obstacles, recommendations, financial receipts).

### B. Clerk Webhook Handler: `src/app/api/webhooks/clerk/route.ts`
- **Security**: Verifies `svix-id`, `svix-timestamp`, `svix-signature`.
- **Logic**: Extracts email and user profile, performs fuzzy-matching against `api::anggota-osis`, and provisions or links the corresponding `api::akses-user` entry.

### C. Audit Logging: `src/api/audit-log`
- All accesses to `/api/mubes/lpj/[slug]` are asynchronously recorded in `api::audit-log` with timestamp, user ID, target proker, and access status.
