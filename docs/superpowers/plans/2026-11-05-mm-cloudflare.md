# MM Cloudflare Migration Implementation Plan

> For agentic workers: implement inline using superpowers:executing-plans; user requested continued execution of the already agreed MM approach. The plan records those decisions, not a new approval gate.

**Goal:** A reviewable migration branch and isolated Cloudflare preview preserving the live application's functionality.
**Architecture:** Import verified Sites source, replace build coupling, require explicit backend selection, and use a separate Free Supabase project for previews.
**Tech Stack:** Existing React/Vinext/Vite, Wrangler, Supabase; no framework upgrade.
**Spec:** ../specs/2026-11-05-mm-cloudflare-design.md

## Global constraints
Preserve functionality/content; design work deferred; production backend lmuwsjjrqmmmtmxjvqln untouched. Preview backend lcddnpafrkbwsrhqexqe. No production deployment/merge/DNS changes. No backups, passwords, secret keys or private records in GitHub. Tests use synthetic data.

## Review focus
- Missing preview config cannot fall back to production.
- Existing DESIGN_PREVIEW flag cannot select production.
- Secret/service-role keys must never enter client bundles.
- Baseline graph/short-answer/template code must survive source import.
- Feature-branch deployment must stay a Worker preview.

## Tasks
- [x] Import verified baseline tree in isolated GitHub feature worktree; keep source provenance.
- [x] Add lib/backend-config.ts with resolveBackendConfig(env), returning target/url/publicKey; tests in scripts/test-backend-config.mjs cover missing/invalid/mixed configuration and secret keys. Run red then green.
- [x] Adapt vite.config.ts, package scripts, wrangler.jsonc and app/page.tsx backend bootstrap; remove unused generated archive/cache tracking, keep application code otherwise baseline-equivalent. Add .env.example without credentials.
- [x] Verify current baseline failures separately, then typecheck and preview/production builds with explicit config. Check built preview client selects only test backend.
- [ ] Generate preview-only bootstrap from captured actual schema, guarded against nonempty application schema; apply only to the verified new project. Seed synthetic accounts/content through verified supported paths. Test schema/roles/read/write/isolation.
- [ ] Commit/push feature branch, create draft PR, verify Cloudflare preview build/URL. Configure only preview settings when necessary; never merge or deploy production.
- [ ] Review whole diff, record checks/limits, give user preview link and remaining decisions.
