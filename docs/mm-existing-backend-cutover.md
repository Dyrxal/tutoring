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

Proposed inspection is restricted to existing project `lmuwsjjrqmmmtmxjvqln`. No credential connection creation, sends, writes or deployment. Require owner approval before starting.

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
