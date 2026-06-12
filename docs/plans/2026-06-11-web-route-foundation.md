# Web Route Foundation Implementation Plan

> For future Codex work: read related plans in `docs/plans/` before implementation. This plan captures the first route-based web application slice.

**Goal:** Replace the single client-only demo screen with real Next.js routes for login, onboarding, Knowledge Base, and Generate CV.

**Architecture:** The App Router owns route boundaries. Auth and onboarding are represented as deterministic route flows for now. The post-login app shell lives under `/app`, with route-based navigation and focused page components for each product area.

**Tech stack:** Next.js App Router, React Server Components, small client components for interactive session selection, Playwright E2E.

**Reference docs:**
- Prior plan: `docs/plans/2026-06-11-app-foundation-v1.md`
- DB plan: `docs/plans/2026-06-11-db-schema-foundation.md`
- E2E skill: `.agents/skills/e2e-testing/SKILL.md`

---

## Motivation

The first UI pass proved the core flow in one client component, but future auth, onboarding persistence, app navigation, and server data loading need stable route boundaries.

---

## Scope

This slice includes route files, a reusable app shell, route-based navigation, and E2E coverage for first-login navigation.

It intentionally keeps real Google OAuth and database-backed session persistence for the next slices.

---

## File Structure

### New files

| Path | Responsibility |
|---|---|
| `apps/web/app/login/page.tsx` | Login entry with Google provider placeholder |
| `apps/web/app/onboarding/page.tsx` | Schema-driven first-login survey |
| `apps/web/app/app/layout.tsx` | Post-login app shell layout |
| `apps/web/app/app/product-shell.tsx` | Route-aware navigation shell |
| `apps/web/app/app/knowledge-base/page.tsx` | Knowledge Base route |
| `apps/web/app/app/knowledge-base/knowledge-base-client.tsx` | Interactive session list and KB selection |
| `apps/web/app/app/generate-cv/page.tsx` | Generate CV route |

### Modified files

| Path | Change |
|---|---|
| `apps/web/app/page.tsx` | Redirects root to `/login` |
| `apps/web/app/styles.css` | Supports route links in the shell |
| `tests/e2e/tests/smoke.spec.ts` | Covers route transitions |

---

## Tasks

- [x] Redirect `/` to `/login`.
- [x] Add first-login survey route.
- [x] Add post-login `/app` shell.
- [x] Add Knowledge Base and Generate CV routes.
- [x] Keep KB session creation and KB selection interactive.
- [x] Update E2E to verify URL transitions.

---

## Risks

- Login is still a deterministic placeholder and must be replaced with real Google auth.
- Onboarding uses a server action redirect but does not yet persist answers.
- Session state is still in-memory client state until repository-backed routes are added.

---

## Verification

- `pnpm --filter @stories/web typecheck`
- `pnpm --filter @stories/e2e test`
- `pnpm typecheck`
- `pnpm test`

---

## Follow-ups

- Add Auth.js/Google OAuth and authenticated route guards.
- Persist onboarding responses through `packages/db`.
- Load and mutate Knowledge Base sessions through server actions or route handlers.
