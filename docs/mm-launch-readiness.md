# MM current completion checklist — 7 November 2026

Authoritative current status; older checkpoints in mm-preview-status.md are historical. Owner scope: retain current content and production Supabase, no new curriculum or redesign. Review baseline `af9dc66`; this package changes documentation/SQL proposals only, not application code. Production read-only inspection authorized; production writes, merge, deployment and DNS await final approval. No new emails sent in this preparation.

| Task | Status | Owner / next action | Owner input needed? |
|---|---|---|---|
| Existing-content inventory | Passing | Assistant: production 2 courses/20 modules/217 lessons/4,138 questions; no import required | No |
| Schema compatibility | Passing for compared metadata | Assistant: all 109 column definitions/defaults, 58 constraints, 34 policies, 3 triggers and table grants match preview exactly | No |
| RPC compatibility | Passing except proposed fix | Assistant: 25 signatures; 23 normalized definitions equal; two differ only at four expected stale error codes | No |
| Function privileges | Passing for app roles; inherited warning | Effective anon/authenticated permissions match. Four production helpers retain PUBLIC EXECUTE absent in preview; no permission widening proposed | Review warning/deferral before launch |
| Content/resource baseline | Passing for structural references | Assistant: aggregate content/path digests captured; zero missing referenced private images/resources; no file decoding/content copying | No |
| Preview runtime evidence | Passing named checks | 105 source tests, types/build; 13 hosted mocked Auth scenarios; 4 real private PDF checks after signin/reload desktop/mobile Chromium. Earlier API/edit/save/permissions evidence retained | No |
| Real preview email | Passing earlier evidence | Confirmation automatic signin/reload and password recovery verified; reused tokens denied. No further send needed | No |
| Production build isolation | Passing build-only | Explicit production target with dummy public key contains production hostname, no preview hostname. Actual deployment environment unverified; preview build restored | No |
| Review timeout production fix | Prepared, not applied | Exact guarded forward/rollback SQL in mm-launch; definitions compared against production; both executed/asserted in a preview transaction and rolled back | Final write approval after prerequisites |
| Production Auth/email/templates | Blocked | Existing tools lack management settings; no broad OAuth. Owner screenshots: localhost Site URL, no redirects, custom SMTP off. Need official-origin plan plus templates/limits | Dashboard values/screenshots, no passwords |
| Database + Storage recovery | Blocked | No backup metadata/restore/download interface available through existing tools. Owner screenshot: Free plan has no project backups. Need verified manual/existing backup and separate Storage recovery, or an explicitly approved alternative | Dashboard backup information and existing backup evidence; no student-data uploads to chat |
| Cloudflare integration | Dashboard verified; configuration change pending approval | Owner screenshots: Dyrxal/tutoring, production main, builds enabled, npm run build, npx wrangler deploy, root /. No production build variables/secrets. Migration defaults to preview: explicit production configuration required before merge | Final configuration approval; current production rollback version still needed |
| Final domain / DNS | Existing custom domain observed | Screenshot lists notationeducation.online as Production custom domain on notation-education-lms. Worker and preview workers.dev URLs enabled. No DNS change proposed; actual TLS/runtime smoke remains pending | Final launch approval, not DNS editing |
| Remaining device/time acceptance | Unverified, proposed deferral | Physical iOS/Safari, actual overnight rollover and time-based link expiry. WebKit launch attempted: executable missing. No device-result claim | Explicit deferral or actual device verification |
| Existing loading/enrolment behavior | Known limitations | No automatic year-enrolment trigger in either schema; keep tutor-managed enrolment. Brief loading-empty state persists | Accept existing behavior or request scoped fix |
| Security findings | Unresolved warning, proposed deferral | SECURITY DEFINER exposure and leaked-password protection warning; same policies/role checks as tested preview. No exploit-free claim or silent revocation | Review/accept limitation or separately approve remediation plan |
| Full-content hosted fidelity | Unverified | Source registries do not write on login; no production question text downloaded. Full live rendering requires approved test-access/smoke scope | Final account/access approval |
| Official launch | Blocked | Resolve hard prerequisites, review exact package and approve actions before launch | One final specific approval |

## Owner dashboard observations — 7 November 2026

Screenshots supplied while following the production-project links show Site URL `http://localhost:3000`, an empty redirect allowlist, custom SMTP disabled, and “Free Plan does not include project backups.” URL/SMTP screenshots are cropped and do not independently display a project ref; these are owner-supplied observations, not a management-API read. Backup screenshot is the Tutoring LMS dashboard sequence. No settings were changed by the assistant.

- Auth remains blocked for official launch: exact official-origin callbacks and suitable email delivery need a concrete approved configuration. Templates/rate-limit values still unknown.
- Scheduled project-backup availability is now known to be absent on the current plan. This does not prove no external/manual backup exists. Database and separate Storage backup/restore readiness remain blocked. Do not upgrade automatically or export private records under the existing metadata-only authorization.
- Next dashboard evidence: Cloudflare production Builds and Domains & Routes. Backup options can then be presented alongside the exact launch requirements, without repeated blanket permission requests.

## Exact Cloudflare configuration proposal — not applied

Owner screenshots confirm existing production custom domain `notationeducation.online`, Worker URL `notation-education-lms.drisyantshrestha.workers.dev`, production branch main with builds enabled, build `npm run build`, deploy `npx wrangler deploy`, root `/`, and no production build variables/secrets. Existing API build-token label is visible; token contents were neither requested nor read.

Before an approved merge, set the following in **Builds → Production → Variables and secrets** (build-time settings, not merely Worker runtime bindings):

| Name | Proposed value |
|---|---|
| NEXT_PUBLIC_LMS_TARGET | production |
| NEXT_PUBLIC_SUPABASE_URL | https://lmuwsjjrqmmmtmxjvqln.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Existing project's publishable/anon key, entered through provider settings; never secret/service-role |
| NEXT_PUBLIC_DESIGN_PREVIEW | false, or absent |

Keep these out of Previews Base. Preview continues using its isolated project and existing command. Cloudflare has a build API token but no backend build variables; merging the migration unchanged would otherwise select preview defaults. Do not merge to test this. Use the configured `npm run build`/`npx wrangler deploy` integration unless a specific command problem is reproduced; verify install uses the committed pnpm lockfile and supported Node/pnpm versions before release. Current screenshot does not establish install command or versions.

With the observed custom domain retained, proposed production Auth values are Site URL `https://notationeducation.online/`, and exact callbacks `https://notationeducation.online/` plus `https://notationeducation.online/?auth=recovery`. Inspect existing email templates before relying on their redirects. Do not add branch preview callbacks to production. No DNS edits are proposed on current evidence.

Apply only after the final launch package, recovery prerequisites and explicit settings/deployment approval. No configuration was changed during screenshot review.

## Hard prerequisites before requesting launch approval

Supply only these non-secret observations (screenshots are fine):

1. **Production Supabase project lmuwsjjrqmmmtmxjvqln**: URL and SMTP screenshots received. Remaining: confirm/reset templates showing link expressions and Auth → Rate Limits. These are production observations, not preview settings; do not change them yet. Public flags do not establish delivery readiness.
2. **Same project**: Database → Backups showing available backups/recovery type/date; what separate backup exists for the 13 Storage objects and how it can be restored. If absent, a concrete backup/restore rehearsal must be separately prepared and authorized; do not purchase an upgrade automatically.
3. **Cloudflare Worker notation-education-lms**: Builds and Domains screenshots received. Remaining recovery evidence: Deployments → current active production version/deployment and rollback availability. No additional Builds/Domain screenshots needed.

These are information blockers, not a new request for blanket production permission. Do not create a broad OAuth connection or paste API/SMTP secrets. No launch approval is being requested until the missing facts make the package executable.

## Reviewable launch sequence (not executed)

1. Freeze a candidate SHA after all requested fixes/accepted deferrals; ensure its Cloudflare preview check succeeds. Confirm actual integration will not publish preview credentials to main. Capture current production version and settings for rollback.
2. Verify recovery readiness, then recapture content baseline immediately before cutover. Retain old hosting until replacement passes checks; consider writes from both clients sharing one backend.
3. After specific approval, run only mm-launch/review-conflicts.forward.sql on retained production. It guards both current definitions and changes four logical error codes. Owner/grants/IDs/rows unchanged. Do not run bootstrap/seed/import SQL. Record applied version without replaying unrelated migrations.
4. Configure only the production build environment: NEXT_PUBLIC_LMS_TARGET=production; NEXT_PUBLIC_DESIGN_PREVIEW=false or unset; existing-project URL and publishable/anon key. Keep preview credentials/commands separate. Install `pnpm install --frozen-lockfile`; build `pnpm build`; deploy existing integration's validated command (verify configuration first). No real key in this package.
5. Stage exact production Auth changes after inspecting current values. Intended callbacks are https://<official-host>/ and https://<official-host>/?auth=recovery. Retain legitimate current callbacks through transition as needed; never add wildcard preview-host access to production.
6. After specific merge/deployment approval, release PR #3 to main using the selected integration. Local merge-tree check is clean; PR remains draft and connector reports mergeable false, so recheck actual GitHub readiness before merge. Merge may itself deploy; approve both together only after production variables are correct.
7. If necessary, perform only exact approved domain/route/DNS edits. Determine actual records and downtime/TTL before approval, not at execution time.
8. Approved smoke scope proposal: one dedicated production student test alias and owner-approved tutor access; isolated synthetic lesson/course explicitly enrolled only for that test account; one saved answer/profile check, one tutor edit and small private file, signin/reload and email flows. Recipient/account creation, production emails and expected rows/objects require explicit approval. Do not reuse/reset existing student accounts or edit real learning material. Never read unrelated student answers. Avoid copying preview accounts/content wholesale.
9. Validate official origin/TLS/backend, representative chapter availability, exact resource references, saving and permissions. Compare baseline counts/digests, separating legitimate tutor edits and approved test rows. Record monitoring and owner/support handover.

## Rollback and stop conditions

Stop on wrong backend hostname, failed authentication/authorization boundaries, content-baseline differences not attributable to approved activity, missing resources or failed saving. Restore the previous frontend version first; do not overwrite new student work with an old database. The prepared backend rollback script restores only the two original definitions and guards against drift. It is not a data backup and restores legacy timeout behavior; use only when required and authorized. Roll back any changed Auth/route settings using captured originals. Database/Storage restoration requires separate impact review and approval.

No promised downtime/cost: these depend on the unverified domain/integration, backup and email configuration. No paid service or DNS action has been taken. No current production version was captured; recovery readiness is therefore **not passing**.

## Evidence

- [Detailed metadata comparison](mm-acceptance/launch-preparation.json)
- [Content/resource preservation baseline](mm-acceptance/content-preservation-baseline.json)
- [Prior named preview evidence](mm-preview-status.md)
- [Prepared SQL scripts](mm-launch/review-conflicts.forward.sql) and [rollback](mm-launch/review-conflicts.rollback.sql)
- [SECURITY DEFINER guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) and [leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)
