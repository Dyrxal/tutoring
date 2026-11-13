# Launch Health Maintenance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verify the released site and prepare contained fixes for observed HTTP sign-in delivery and dependency security findings.

**Architecture:** Preserve the released app and production data. Add a host-scoped HTTPS redirect through Vinext middleware, and update vulnerable dependency versions without changing learning or authentication behavior. Keep maintenance on a separate review branch; no direct main push or database change.

**Tech Stack:** TypeScript, React, Vinext/Cloudflare Workers, pnpm, Node tests, Chromium/Playwright.

**Spec:** Owner's 13 November request to run checks and do required maintenance autonomously in one task; observed public HTTP200 sign-in over plain HTTP and production dependency audit with 23 advisories including three critical Next.js advisories.

## Global Constraints

- Preserve production lmuwsjjrqmmmtmxjvqln and preview lcddnpafrkbwsrhqexqe isolation.
- No SQL/data changes, real-account password reset, test email, private file download, backup restart, or direct main push.
- Preserve existing URL Configuration, SMTP, tutor-managed enrolment, UI and learning behavior.
- Keep package minimum-release-age and build-script policy; report any exact security exception before weakening policy.
- Owner has requested uninterrupted execution; implement and verify reviewable local changes without intermediate preference questions.

## Review Focus

- Official host HTTP callbacks retain their path/query while upgrading to HTTPS.
- Local development and unrelated/preview hosts keep current behavior.
- Hostname lookalikes cannot control redirect destinations.
- Middleware is present in the compiled Cloudflare application, not merely a tested unused helper.
- Frozen install, production/preview target isolation and runtime behavior remain valid after dependency updates.

### Task 1: HTTPS redirect

**Files:** Create `lib/https-redirect.ts`, `middleware.ts`, `scripts/test-https-redirect.mjs`.

**Interfaces:** `httpsRedirectUrl(raw: string): string | null`; middleware consumes Request URL and returns a 308 redirect only for HTTP official hosts.

- [x] Write literal input/output regression cases for apex/www, callback query, HTTPS, local and lookalike hosts; observe missing behavior fail.
- [x] Implement the smallest pure redirect decision and middleware wiring.
- [x] Run focused tests and full suite; expect zero failures. Commit the tested behavior.

### Task 2: Dependency maintenance

**Files:** Modify `package.json`, `pnpm-lock.yaml` and only necessary exact dependency overrides in `pnpm-workspace.yaml`.

**Interfaces:** Existing install/build scripts and frontend module imports remain unchanged.

- [ ] Preserve initial audit output as the failing security baseline.
- [ ] Update Next.js to a patched published release >=16.4.1 and align eslint-config-next. Resolve remaining production advisories using supported updates; preserve release-age/build policy.
- [ ] Run frozen install, production audit, full tests and TypeScript. Expect no critical/high production advisories and no new behavior/type failures; record any unresolved constraints exactly.
- [ ] Commit only reviewed dependency changes.

### Task 3: Build/runtime verification and handoff

**Files:** Add bounded health evidence in `docs/mm-acceptance/`; update the single `docs/mm-launch-readiness.md` checklist.

**Interfaces:** Reuse existing preflight build/asset scanners and browser recovery scenarios.

- [ ] Build and scan production and preview separately with explicit correct public settings; archive production artifact and restore preview.
- [ ] Run local built Worker; exercise HTTP official hosts, local HTTP, and authentication callbacks. Run existing 17 mocked-backend browser cases against the candidate, plus desktop/mobile checks.
- [ ] Obtain one independent whole-change review, address material findings with regression tests, and retain all evidence without declaring authenticated production flows tested.
- [ ] Prepare a review branch/compare link and exact release handoff; leave current production deployment unchanged pending normal review/merge.
