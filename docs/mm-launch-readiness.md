# MM current completion checklist — 7 November 2026

Authoritative current status; older checkpoints in mm-preview-status.md are historical. Owner scope: retain current content and production Supabase, no new curriculum or redesign. Tested executable candidate **`f64782c23460a2ae1364b3e1022f42a9c8eabf52`** includes the completed preview fixes and release-preflight tools. The final evidence/documentation commit adds no application changes. Historical preview evidence at `14dae44` and launch-package evidence at `af9dc66` remain applicable within their stated limits. Production read-only inspection authorized; production writes, merge, deployment and DNS await final approval. No new emails sent in this preparation.

## Executable release preflight — current result

[Generated concise report](mm-acceptance/release-preflight.json): **126 passing, 0 failing, 9 blocked, 4 unverified**. This is preparation evidence, not an approved or completed launch. [Verification details](mm-acceptance/preflight-verification.json) record the actual candidate, build digests, read-only observation times and limitations. Use [the tested commands](mm-launch/preflight-tools.md), [exact cutover sequence](mm-existing-backend-cutover.md#tested-release-and-rollback-sequence) and [backup/restore checklist](mm-launch/manual-backup-plan.md).

- **Passing:** 141/141 tests including 33 tooling tests; TypeScript; actual preview and production-target build-only rehearsals using their intended public backend settings; both asset scans/provenance; 85 production metadata checks, 12 aggregate preservation checks and 3 forward-SQL package/definition guards. Current local build restored to preview. Production still has its original review functions.
- **Failing:** none in the final named runs. Negative tests establish that mixed/secret-bearing assets, source/artifact/contract drift, wrong-project captures, stale/incomplete evidence and unapproved baseline changes are rejected. A local archive with leftover old files was correctly rejected; rebuilding and copying to a new empty archive passed.
- **Blocked:** production Auth, SMTP, database backup, separate Storage protection, restore rehearsal, production build settings, owner launch approval, production smoke scope, and verification of the installed review-function change. None is cleared by local builds or unchanged aggregates.
- **Unverified:** full frontend rollback selection/recovery, physical-device/time checks, acceptance/remediation of existing security findings, and tutor-managed enrolment acceptance. No silent deferral.

The checked-in report is a dated observation. Fresh captures and reports are required near launch (default freshness window 3,600 seconds); do not reuse this JSON as a live gate. No production data export, private-file read, restore, write, merge, deployment, DNS change, purchase or new connection occurred.

| Task | Status | Owner / next action | Owner input needed? |
|---|---|---|---|
| Existing-content inventory | Passing | Assistant: production 2 courses/20 modules/217 lessons/4,138 questions; no import required | No |
| Schema compatibility | Passing for compared metadata | Assistant: all 109 column definitions/defaults, 58 constraints, 34 policies, 3 triggers and table grants match preview exactly | No |
| RPC compatibility | Passing except proposed fix | Assistant: 25 signatures; 23 normalized definitions equal; two differ only at four expected stale error codes | No |
| Function privileges | Passing for app roles; inherited warning | Effective anon/authenticated permissions match. Four production helpers retain PUBLIC EXECUTE absent in preview; no permission widening proposed | Review warning/deferral before launch |
| Content/resource baseline | Passing for structural references | Assistant: aggregate content/path digests captured; zero missing referenced private images/resources; no file decoding/content copying | No |
| Preview runtime evidence | Passing named checks | 108 source tests, types/build; 17 local and hosted mocked browser cases; 4 real private PDF checks desktop/mobile; 5 real review/assignment/account-switch flows; tutor notes/two private image saves with reload; enrolled student decodes 3 private images; representative Year 9/10 saved answers/completion/flags reread. Exact tested commits and limits in preview-final-followup.json | No |
| Real preview email | Passing earlier evidence | Confirmation automatic signin/reload and password recovery verified; reused tokens denied. No further send needed | No |
| Production build isolation | Passing build-only | Tested candidate built with actual retained-project public settings obtained through existing scoped access; all served files scanned, no preview hostname or secret exposure detected, Git/input/artifact provenance matches. Actual Cloudflare build environment unverified; local preview build restored | No |
| Executable release checks | Passing tooling; launch blocked | 33 new tooling tests, 141 total; metadata/baseline/package guards exercised against read-only captures and synthetic negative fixtures. Generated report above retains 9 blockers and 4 unverified gates | Resolve named prerequisites before final approval |
| Review timeout production fix | Prepared, not applied | Exact guarded forward/rollback SQL in mm-launch; definitions compared against production; both executed/asserted in a preview transaction and rolled back | Final write approval after prerequisites |
| Production Auth/email/templates | Blocked | Existing tools lack management settings; no broad OAuth. Owner screenshots: localhost Site URL, no redirects, custom SMTP off. Need official-origin plan plus templates/limits | Dashboard values/screenshots, no passwords |
| Database + Storage recovery | Blocked | No backup metadata/restore/download interface available through existing tools. Owner screenshot: Free plan has no project backups. Need verified manual/existing backup and separate Storage recovery, or an explicitly approved alternative | Dashboard backup information and existing backup evidence; no student-data uploads to chat |
| Cloudflare integration | Dashboard verified; configuration change pending approval | Owner screenshots: Dyrxal/tutoring, production main, builds enabled, npm run build, npx wrangler deploy, root /. No production build variables/secrets. Migration defaults to preview: explicit production configuration required before merge | Final configuration approval; active frontend version 3862f733 captured, rollback execution unverified |
| Final domain / DNS | Existing custom domain observed | Screenshot lists notationeducation.online as Production custom domain on notation-education-lms. Worker and preview workers.dev URLs enabled. No DNS change proposed; actual TLS/runtime smoke remains pending | Final launch approval, not DNS editing |
| Remaining device/time acceptance | Unverified, proposed deferral | Physical iOS/Safari, actual overnight rollover and time-based link expiry. WebKit launch attempted: executable missing. No device-result claim | Explicit deferral or actual device verification |
| Existing loading/enrolment behavior | Loading defects fixed; enrolment limitation retained | Catalogue loading/failure/retry now explicit; no false empty catalogue. Practice locked until saved history is available, with failure retry. No automatic year-enrolment behavior added or changed | Accept current tutor-managed enrolment behavior before launch |
| Security findings | Unresolved warning, proposed deferral | SECURITY DEFINER exposure and leaked-password protection warning; same policies/role checks as tested preview. No exploit-free claim or silent revocation | Review/accept limitation or separately approve remediation plan |
| Full-content hosted fidelity | Unverified | Source registries do not write on login; no production question text downloaded. Full live rendering requires approved test-access/smoke scope | Final account/access approval |
| Official launch | Blocked | Resolve hard prerequisites, review exact package and approve actions before launch | One final specific approval |

## Preview acceptance follow-up — 7 November 2026

[Detailed evidence and exact tested commits](mm-acceptance/preview-final-followup.json). No production request/content access, DNS change, new connection, purchase or email send during this task. Earlier owner-approved email DNS additions are a separate historical action, still pending Resend verification.

### Passing

- Expired/reused confirmation links show fixed guidance after hydration; consumed error parameters are then removed so the notice does not return after successful sign-in/reload. Untrusted callback descriptions are not displayed. Recovery invalid/expired screens retain their separate flow; URL markers/cached ordinary sessions still cannot authorize a password change.
- Delayed enrolments show loading instead of “No courses assigned”; failed enrolments offer retry. A successful genuinely empty response retains the existing empty-state behavior.
- MC and short-answer controls are disabled while saved answer history is pending or unavailable; a handler guard also prevents programmatic submission. Retry is offered on history-load failure. Regression holds the history response, verifies both control types are disabled, then releases previously saved answers and verifies restoration. Existing save/retry/account-change tests retain all assertions; their harness now supplies the explicit history-ready prerequisite, with a new negative no-write test.
- 108/108 source tests, TypeScript and preview build pass. 17/17 mocked browser scenarios pass locally and on hosted `14dae44`; backend HTTP fulfilled in-browser, with no real mail. No unhandled main-page exceptions in these scenarios.
- On hosted `b6d9939`: 4/4 actual private-PDF desktop/mobile signin/reload render checks and 5/5 review/assignment/retry/account-switch flows pass. Tutor notes and two private images save and survive reload. Enrolled student decodes all 3 private images. On `3f01eca`: representative Year 9/10 chapter access, flag persistence/withdrawal and previously saved 8 core answers/completion reread pass. This is representative fixture acceptance, not all-section or production coverage.
- Eight fresh preview read-boundary API checks pass: anonymous denial, unenrolled denial, cross-student profile denial, enrolled student/tutor reads. Earlier write-boundary/private-file permission/API and tutor diagram-save checks are retained explicitly as previous evidence because no backend/policy code changed. They were not falsely counted as fresh API tests. Real email evidence is retained; no repeat messages needed.

### Failing / unresolved

- No failing check in the final named source/browser runs. Five regression cases were observed failing before their fixes. An initial review-runner timeout selected another synthetic question that became due after the date changed; fixture scheduling was isolated and unchanged assertions then passed. Original next_due values restored; synthetic review attempts/monotonic revisions retained.
- Physical iOS/Safari, time-based token expiry, real overnight rollover and full hosted visual/content parity remain unverified. Earlier WebKit launch failed because its executable is absent; no physical-device result is claimed.
- Production email/DNS verification, backup/recovery, build/Auth configuration, inherited security warnings and owner launch approval remain outside or blocked in this preview task. These passing results do not establish launch readiness.

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
3. **Cloudflare Worker notation-education-lms**: Builds and Domains screenshots received. Deployments screenshot received: active version 3862f733, 100% traffic, main, Ready; earlier versions 13a8552f and 2afeeb91 are listed. No further Cloudflare screenshots requested at this stage. Full version identifier and actual rollback availability/execution still need confirmation before launch.

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

No promised downtime/cost: these depend on the unverified domain/integration, backup and email configuration. No paid service was purchased. Owner added only the three explicitly approved email-verification DNS records; website routing is unchanged. Current active frontend version prefix 3862f733 was captured from the owner dashboard, serving 100% traffic. This is a frontend rollback candidate, not a verified database/Storage recovery plan; recovery readiness remains **not passing**.

## Evidence

- [Detailed metadata comparison](mm-acceptance/launch-preparation.json)
- [Content/resource preservation baseline](mm-acceptance/content-preservation-baseline.json)
- [Prior named preview evidence](mm-preview-status.md)
- [Prepared SQL scripts](mm-launch/review-conflicts.forward.sql) and [rollback](mm-launch/review-conflicts.rollback.sql)
- [SECURITY DEFINER guidance](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) and [leaked-password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## Active deployment observation

Owner screenshot: version prefix `3862f733`, main build Ready, 100% traffic, deployed “23 days ago”; listed older versions `13a8552f` and `2afeeb91` are manually deployed/Ready. These are version identifiers, not assumed Git commit SHAs. The screenshot's instantaneous 0% error rate is not a reliability test. Retain this frontend version through cutover; obtain the full identifier from the dashboard before an approved rollback action. No deployment/rollout was changed.

Next owner information: whether an existing email delivery provider/account already serves notationeducation.online. Do not open accounts, purchase service, configure SMTP or add DNS records without the final concrete approval. Manual database/Storage backup preparation remains an option; executing exports of sensitive data needs explicitly scoped handling authorization, with no dumps/credentials in chat or Git.

## Email sender proposal — owner has no existing service

Owner confirmed no sending service. Proposed provider: Resend transactional Free plan (official pricing documentation observed 7 November 2026: 3,000/month, 100/day; recheck at signup). Proposed sending domain `auth.notationeducation.online`, subject to review of generated DNS records and existing records before any DNS edit. Website routing remains unchanged; email verification does require separate DNS additions, to be included in explicit approval. No provider account, connection, DNS or SMTP configuration was created by the assistant.

Owner can create a free account and add the proposed domain to obtain its DNS verification record table; stop before modifying DNS. Use manual SMTP rather than Connect to Supabase/OAuth. Proposed later SMTP: smtp.resend.com, 465, username resend, password a scoped sending API key entered directly into production Supabase SMTP settings (never chat/Git/client code); sender must be on verified domain. Keep click/link tracking off for Auth links. Determine actual quota needs and verify only approved production test flows after approval. Resend setup: https://resend.com/docs/send-with-supabase-smtp ; pricing: https://resend.com/pricing . Backup readiness remains separately blocked.

## Exact Resend DNS values received

User supplied the three sending records. See [the exact reviewed proposal](mm-launch/email-dns-proposal.md). Conflict check passed from owner screenshot listing all 2 zone records (apex Worker and www CNAME); none matches proposed email names. Three email additions still await explicit DNS approval; website records remain unchanged. No DNS record, optional DMARC policy, SMTP setting or website route has been changed.

## DNS approval update

Owner approved the three exact Resend sending records. No repeat permission needed. Actual execution blocked by absent Cloudflare connection/desktop-control tool; owner dashboard steps provided. DNS not yet changed/verified by assistant. No need to create a broad connection. Manual-backup planning continued independently: [backup preparation](mm-launch/manual-backup-plan.md).

## Owner DNS execution / verification pending

Owner added the three approved records through Cloudflare. Initial CNAMEs were proxied; later screenshot shows both changed to DNS only. Zone total is now 5 records, versus the original 2 website records. DKIM TXT name matches; content is visually shown quoted by Cloudflare. Full live authoritative DNS readback has not been performed by the assistant.

Latest Resend screenshot shows domain status Pending, Checking DNS and DKIM Pending. It also displays Resend Forge Disabled, so do not infer sending readiness merely from the earlier Forge-target proposal. If Pending persists, compare the full currently expected Resend records (including all sending rows) with the exact Cloudflare values before changing anything. DNS verification is not passing yet; no API key or production SMTP activation is requested at this stage.
