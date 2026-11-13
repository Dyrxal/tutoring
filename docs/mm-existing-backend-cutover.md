# MM existing-backend cutover plan

Decision confirmed by owner, 7 November 2026: retain established Supabase project `lmuwsjjrqmmmtmxjvqln`; keep `lcddnpafrkbwsrhqexqe` isolated for preview. Preserve saved content, student identities/progress and Storage paths. No source-bank import, synthetic seed, chapter expansion or database replacement is part of the hosting cutover.

## Current authorization

Review-branch work and preview acceptance are authorized. Read-only production inspection is now explicitly authorized. Production writes, merge, production deployment and DNS changes remain prohibited until separately approved. This document does not execute or authorize them.

## Gate 1 — application readiness

- Require passing source tests, TypeScript and preview build at the release candidate commit.
- Existing evidence covers representative editing/saving, private uploads/PDFs, permissions, review retries/account switching and email recovery. Fresh confirmation automatic login/reload now passes. Tests do not prove compatibility with current production state.
- Remaining preview limitations: full hosted appearance/section coverage, physical Safari/iOS, time-based token expiry/overnight review date boundaries, full Site URL fallback, loading-state/auto-enrolment expectations and security findings. Classify each as blocker or explicitly accepted limitation before launch; no silent deferral.
- Keep preview builds on preview backend. Never point this branch preview at production to check it.

## Gate 2 — separately approved read-only production compatibility inspection

Inspection is restricted to existing project `lmuwsjjrqmmmtmxjvqln`. The owner has already authorized read-only metadata/aggregate inspection; do not request that permission again. No credential connection creation, sends, writes or deployment. This permission does not cover private records/file contents or sensitive backup exports.

Inspect only the following, returning summaries rather than student/account records:

1. Schema metadata: required tables/columns, foreign keys, RLS policies, function signatures/definitions/privileges, relevant triggers and applied migration versions. Repository SQL is not evidence of what is installed.
2. Auth configuration: Site URL/redirect allowlist, confirmation policy, configured email provider/sender and rate-limit settings. Never return SMTP secrets or API key values. Existing project-scoped tools do not expose all these settings; use owner-provided dashboard values if necessary, without broad OAuth.
3. Content preservation: aggregate counts and stable-ID/content digests for courses/modules/lessons/questions; relationships, lesson_flow, ordering and resource references. No raw student answers or user email list. No seed/import/upsert. A baseline and post-cutover comparison should exclude legitimate student-progress changes.
4. Storage configuration: private bucket names, policy metadata, aggregate object counts and referenced-path existence. Do not download private learning files without the later specifically scoped acceptance authorization. Database and Storage recovery coverage must be established separately.
5. Backup capability: available restore options, last successful verified backup, Storage coverage and permissions needed to restore. Do not assume the plan includes PITR or downloadable backups.

Prepare a field-by-field compatibility report. Stop if the schema differs unexpectedly; no automatic application of all repository migrations. Propose exact fixes and test them against preview first.

## Gate 3 — resolve backend differences with separate write approval

Known candidate: `supabase/migrations/20261106074516_mm_review_conflicts.sql` updates two review functions and changes expected stale conflicts from retryable 40001 to PT409. Applied in preview only. Compare current production definitions before proposing it there; retain original definitions/privileges for rollback. Client supports legacy conflicts, but without the backend change stale operations may still incur retries/timeouts.

Do not run `schema.sql`, `seed.sql`, `preview/bootstrap.sql`, `preview/seed-synthetic.sql` or question imports against production. Do not add auto-enrolment triggers merely because source setup SQL contains them. Confirm intended current enrolment behavior.

## Gate 4 — concrete launch package and approval

Resolve and present before requesting deployment permission:

- Exact release commit and current deployed version for rollback; actual Cloudflare build/deploy integration (the repository currently has no .github/workflows directory).
- Final public domain, existing host, DNS records and their owner. No DNS change may be necessary if an established Cloudflare route already exists; inspect only with authorization before claiming this.
- Production build variables: explicit NEXT_PUBLIC_LMS_TARGET=production, existing-project URL and publishable/anon key. Remove/disable NEXT_PUBLIC_DESIGN_PREVIEW=true for that build. Never bundle secret/service-role keys. Vite merges environment variables over preview defaults; inspect the final generated asset target without printing keys.
- Preserve preview configuration in its own build context; environment changes must not make subsequent branch previews target live data.
- Production Auth callback root and /?auth=recovery on the official origin; retain existing legitimate callback addresses during transition if needed, using an exact reviewed list. Do not allow wildcard branch hosts into production by default. Existing email templates must honor requested destinations.
- Production email readiness: default preview SMTP limits already caused a block. Production sender is unknown. Define any provider/domain work as a separate approved action, not assumed setup.
- Verified backup/recovery plan and source/content baseline. If backend changes are needed, sequence them for compatibility with both old/new clients.
- Owner-approved test accounts and smoke-test writes; never reset a real student's password or edit a real lesson for testing.
- Access/retirement plan for old hosting URLs, support contact, monitoring and stop/rollback criteria.

Owner reviews the preview and remaining limitations, then explicitly approves the exact merge/deployment/database/Auth/DNS actions required. Approval of retaining the backend alone is not approval for those operations.

## Gate 5 — approved launch and validation

Execute only the approved package. Use approved test accounts for sign-in, enrolment visibility, representative chapter/resource access, an isolated saved answer and tutor edit, email callbacks and reload. Compare content baseline/digests and object references. Confirm student/tutor permissions without probing unrelated users' records. Record expected new test writes separately.

Monitor request/auth errors and saving. If deployment fails, restore the previous website version first where compatible. Do not restore an earlier database over new student work merely to undo frontend code. Any database rollback/restore requires its own approved, impact-assessed steps.

## Current next gate

Read-only comparison has progressed; use [the current checklist](mm-launch-readiness.md) for exact results and remaining Auth/backup/Cloudflare configuration blockers. Do not request the already granted read-only permission again. Final production-change approval comes after those prerequisites are resolved.

## Tested release and rollback sequence

Executable candidate: **`f21dabf2e021a0dcef439bc1329bb51ebc043081`**. [Generated report](mm-acceptance/release-preflight.json) records 126 passing, zero failing, 9 blocked and 4 unverified checks. [Verification evidence](mm-acceptance/independent-verification.json) identifies actual builds and read-only observations. Later documentation-only commits do not change this tested input set. Any application/tool/contract change requires a new committed candidate and matching checks. Follow [preflight-tools.md](mm-launch/preflight-tools.md) for exact arguments, input formats and exit codes.

1. Before requesting launch approval, resolve `docs/mm-launch/gates.json` with actual evidence. Complete an authorized database backup, separate Storage-byte protection and isolated restore rehearsal using [manual-backup-plan.md](mm-launch/manual-backup-plan.md). Nothing in this tooling task performs or verifies a backup. Obtain the full frontend rollback identifier; `3862f733` is only the observed prefix. Confirm production Auth/templates/rate limits, sender, Cloudflare build/install settings, approved smoke accounts/writes and unresolved acceptance items.
2. From a clean committed candidate, run `pnpm test`, `pnpm exec tsc --noEmit --incremental false`, and `pnpm --silent preflight build --target preview --out /workspace/work/mm-preflight/preview-assets.json`. Retain preview isolation. A production build-only rehearsal requires explicit retained-project public settings and `NEXT_PUBLIC_DESIGN_PREVIEW=false`; run `pnpm --silent preflight build --target production --out /workspace/work/mm-preflight/production-assets.json`. Archive to a **new empty directory**, rescan that copy and restore a preview build. Never deploy the preview artifact to production.
3. Generate identity-bound read-only metadata and baseline SQL using `pnpm --silent preflight sql --kind metadata --project-ref lmuwsjjrqmmmtmxjvqln` and the same command with `--kind baseline`. Execute only through the matching existing project connection/SQL editor, preserve snapshots outside Git and normalize with `preflight snapshot`. Capture baseline immediately before the approved operation; concurrent legitimate edits require exact reviewed aggregate approvals, never overwriting/importing content.
4. Run `pnpm --silent preflight metadata --actual /workspace/work/mm-preflight/production-metadata.json --phase before --out /workspace/work/mm-preflight/metadata-result.json` and `pnpm --silent preflight review --actual /workspace/work/mm-preflight/production-metadata.json --direction forward --out /workspace/work/mm-preflight/review-result.json`. Unexpected definitions/owners/grants or changed SQL SHA pins abort. The current old review functions match the exact prepared forward preconditions; they have **not** been changed in production.
5. Present the concrete release package and request approval for its exact production actions only after the independent prerequisites are satisfied. Apply only the separately approved [forward SQL](mm-launch/review-conflicts.forward.sql), never bootstrap/seeds/imports. Use the existing approved Cloudflare integration and retained official domain; this preparation introduces no DNS change. The before/forward preparation report intentionally remains blocked until installed-state verification is possible.
6. After an approved backend change, recapture metadata and run `preflight metadata --phase after` and `preflight review --direction rollback` with that fresh snapshot and explicit output paths. This verifies the installed definitions and that [rollback SQL](mm-launch/review-conflicts.rollback.sql) still matches them; it does not execute rollback. Recapture baseline after the approved operation and run `pnpm --silent preflight baseline --before /workspace/work/mm-preflight/before.json --after /workspace/work/mm-preflight/after.json --out /workspace/work/mm-preflight/baseline-result.json`. Record only exact approved content/test-fixture changes. Complete approved live smoke checks separately; builds/metadata cannot prove deployed browser behavior.
7. Generate one report with the four actual result files, gates and full candidate SHA using the runbook's `preflight report` command. Exit 0 requires all supplied checks and manual gates passing; exit 1 means failure/invalid evidence; exit 2 means blocked/unverified. Never mask a failing gate. Keep the full report outside browser assets and retain a concise dated copy as evidence.

On failure, stop the approved rollout and prefer restoring the retained frontend version where compatible; capture current errors and aggregates first. Do not restore an older database over new student work. If the two-function rollback is separately approved, first recapture metadata and require `preflight review --direction rollback` to pass against current definitions; then execute only the guarded rollback SQL. Recapture metadata and verify the original state with `metadata --phase before` plus `review --direction forward`, and compare fresh content/resource baselines. Any guard drift, failed backup, missing settings or unexplained aggregate change blocks progress; no automatic repinning or broad migration execution.

Independent synthetic recovery and permission rehearsal now has [37 passing checks](mm-acceptance/local-database-rehearsal.json), a [repeatable local command](mm-launch/local-database-rehearsal.md), [managed-schema recovery inventory](mm-launch/managed-recovery-inventory.json), and [bounded security findings/actions](mm-launch/security-review.md). These strengthen preparation; real database/Storage backup, managed restore, production configuration and final approval gates remain blocked/unverified.
