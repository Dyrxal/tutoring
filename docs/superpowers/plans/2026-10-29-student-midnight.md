# Student Midnight implementation plan

**Goal:** Implement the approved Courses, Progress and Account compositions for student Midnight Study; retain Light/tutor/course/lesson behavior and all learning data.
**Spec:** `docs/superpowers/specs/student-midnight-brief.md`; approved visual references in `/workspace/generated_images`.
**Base:** Fresh clone of public Dyrxal/tutoring main at 97ab688. Existing `/workspace/tutoring` dirty work is untouched. Production revision is unverified; release is blocked until reconciled. This is a newly recreated theme, not recovered historic source.

## Tasks
- [x] Record fresh baseline and production/source/auth/branch-build access facts.
- [x] Student preference API/hook and narrow idempotent migration. Profile RPC authenticates self/student; no column privilege broadening. Preserve recognized per-user `notation-theme:<id>` browser values when profile is uninitialized; no persistence claims until RPC success. Handle races, sign-out, invalid/missing schema, offline and preview.
- [x] Create clean generated textbook imagery; asset provenance and optimize to WebP.
- [x] Implement scoped student Midnight shell and Courses/Progress/Account presentation. Shared activity builder, profile editor/actions and course navigation. Dashboard gets scoped compatible palette only; its existing structure remains. Keep existing Account activity section to preserve information.
- [x] Run baseline-aware Node tests, chapter3, TypeScript, lint, build, local SQL/policy checks and local Workers desktop/mobile synthetic browser/screenshot checks. Record pre-existing failures; do not weaken rules or unrelated assertions.
- [x] Independent code/visual review, material corrections and local implementation commit `f78b7f677f2c5afc552b27de0a9d1eec5b90787d` complete; documentation records results.
- [ ] Push/open PR only after verifying branch-build safety and auth. Prepare release/rollback instructions; no production deploy, merge or live migration.

## Decisions / ledger
- Use isolated clean clone rather than copying unrelated uncommitted reliability fixes into feature.
- Preserve actual activity computation's four-week summary semantics, label period truthfully; chart remains eight weeks. Do not reinterpret existing counts to imitate mock data.
- Existing remote base has known reliability failures. Baseline failures are evidence, not authorization to silently fold unrelated fixes into this PR.
- Build/preview tooling may need temporary supported runtime overrides for local verification; disclose them and do not label that a normal clean production-build pass.
- Source-preference facts: cached prior live bundle used localStorage `notation-theme:<user-id>` and light/midnight/light-version choices. Current live requests blocked; source provenance remains release-blocking.

## Final local validation

- Focused 32/32; full 100 tests, 96 pass / 4 unchanged baseline failures; chapter3 210 valid; local PGlite checks pass.
- TypeScript and lint retain the recorded baseline failures. Production build passes; normal preview requires the disclosed newer local runtime override.
- Final synthetic browser 40/40 plus delayed-profile 2/2; 8 Midnight axe states clean. Dashboard palette RED→GREEN and independent visual recheck complete.
- Staging/live Supabase, production-source mapping, Cloudflare branch settings and authenticated GitHub remain blocked; no production/repository mutation performed remotely.
