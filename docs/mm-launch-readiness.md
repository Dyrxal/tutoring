# MM current completion checklist — 8 November 2026 (Australia/Sydney)

Authoritative current status; older checkpoints in mm-preview-status.md are historical. Owner scope: retain current content and production Supabase, no new curriculum or redesign. Tested executable candidate **`f21dabf2e021a0dcef439bc1329bb51ebc043081`** includes the completed preview fixes and release-preflight tools. The final evidence/documentation commit adds no application changes. Historical preview evidence at `14dae44` and launch-package evidence at `af9dc66` remain applicable within their stated limits. Production read-only inspection authorized; production writes, merge, deployment and DNS await final approval. No emails were sent during the preflight-tooling preparation; the later preview Resend recovery check is recorded below.

## Current owner direction — launch preparation only

Review branch inspected at `8dd72888745a73cf0e0a412c0b1825d54dbbddd7` on 8 November 2026 (Australia/Sydney). The restored checkout was clean on `work` at `97ab688d9ef138429fd05d78678e2d1236be9957`; the fetched review branch matched the expected SHA and was selected without resetting or overwriting local work. The recorded tested executable candidate remains `f21dabf2e021a0dcef439bc1329bb51ebc043081`; its test/build results below are historical and were not rerun in this inspection.

**Backup setup and real restore rehearsal are deferred by the owner. No verified database or private Storage backup exists.** Do not resume backup setup or purchases. This deferral does not establish recovery readiness or authorize launch. The existing automated gates remain blocked, with the deferral recorded in their evidence; no new gate status or release bypass was introduced. This current direction supersedes the older backup-start instructions below.

Remaining work, not implemented by this inspection:

1. Prepare owner-only curriculum/content management using existing permissions while preserving student answers, progress and permitted profile actions. Owner email supplied; production UUID/role snapshot and live enforcement still need verification.
2. Prepare production Auth URLs, email templates, SMTP and rate limits; preview Resend evidence does not verify production configuration.
3. Prepare production-only Cloudflare build settings and verify the resulting artifact targets the retained production project.
4. Recheck and validate the existing guarded two-function review fix and rollback; do not apply it yet.
5. Resolve or obtain explicit decisions on the recorded security findings.
6. Verify relevant device/session/review behaviour and confirm current tutor-managed enrolment; identify unverified physical-device/time cases.
7. Refresh release evidence, establish the full frontend rollback version, and prepare exact production smoke-test scope and one final approval package.

No production settings, permissions, records, deployments or preview data were changed. This inspection changes documentation only and does not approve merge, deployment, production writes or emails.

## Owner-only content permissions — staged, not applied

The owner supplied their existing sign-in email privately in this conversation. It has not yet been resolved to a production UUID or verified against current account roles; no live account-inspection tool/database route is available in this session. No owner UUID or account list was guessed.

The smallest staged approach reuses `profiles.role='tutor'` and `is_tutor()`. Curriculum table policies, tutor mutation RPCs and uploads/deletions in the three private content buckets already use that gate. [Forward SQL](mm-launch/owner-content.forward.sql) retains the confirmed owner as tutor, demotes only other UUIDs in the reviewed original tutor snapshot, and revokes ordinary app-role TRUNCATE on `courses`, `modules`, `lessons`, `questions`. No application code, new role, helper, table, policy rewrite or dependency is added. Other tutors consequently lose tutor-wide reads, enrolment management and tutor RPC access; they need ordinary enrolments for student access. Student answer/progress writes, permitted profile updates and enrolled content/private-file reads keep their existing policies. Database-owner/dashboard/service-role access remains administrative access outside LMS roles.

[Rollback SQL](mm-launch/owner-content.rollback.sql) restores only the originally demoted tutor UUIDs and original eight direct TRUNCATE grants. Both packages use a transaction, bounded locks/timeouts, unique owner email/UUID/role checks, the exact original tutor UUID list, helper/RLS checks and expected role/grant-state checks. Forward verifies the original direct grants are non-grantable and issued by the executing table owner, and aborts if inherited TRUNCATE remains. Rollback aborts on unexpected current tutor roles or missing accounts. These are present-state guards, not an audit log capable of detecting every intervening role change; re-review the original snapshot and later administrative activity before rollback.

### Remaining production prerequisite and operator inputs

Do not execute the forward/rollback packages yet. From the verified production project `lmuwsjjrqmmmtmxjvqln`, use an approved read-only metadata path to resolve the supplied email case-insensitively in `auth.users` and `public.profiles`; require exactly one matching UUID and existing tutor status. Capture the current tutor UUID array, check live policy/function/grant drift against the reviewed contract, and retain that original snapshot for review and rollback. If the account is missing/not tutor, or another tutor needs to retain tutor-wide access, stop and revise the proposal. No password or student-answer query is required.

The packages require explicit session inputs, set separately before the selected package in the same database session:

```sql
-- Replace placeholders only after the production account/role review and approval.
SELECT set_config('mm.owner_id', '<verified owner UUID>', false);
SELECT set_config('mm.owner_email', '<confirmed owner sign-in email>', false);
SELECT set_config('mm.expected_tutors', '["<original tutor UUID including owner>"]', false);
```

The array must include every original tutor UUID exactly once; reuse the same original inputs for rollback. Missing inputs fail before role changes. These settings are assertions, not project authentication: independently verify the selected project/connection. Do not run the synthetic bootstrap/seed against production. Final production write approval remains separate.

### Isolated verification

The existing disposable local runner now exercises the shipped owner forward/rollback files with a synthetic owner, second tutor, enrolled student and other student. It checks curriculum mutations, tutor RPC denial, uploads/deletions in all three private buckets, app-role TRUNCATE denial, preserved student actions, owner access, row/schema/grant restoration, and fail-closed missing/wrong owner, tutor-list drift and inherited-privilege cases. Auth/Storage are minimal local stubs; no hosted account, file bytes, email or actual Storage service is tested. The first new assertion failed against a no-op forward package because the non-owner remained tutor; production was untouched. Final run at 2026-11-08T07:26:29.033Z passed **40 local checks, 0 failures**; `pnpm test` passed **144 tests, 0 failures**. Input hashes match the shipped files. Results are recorded in the linked [local evidence](mm-acceptance/local-database-rehearsal.json). This is staged-package evidence, not evidence of installed production permissions.

## Production Auth and email — proposed settings, not applied

Prepared on 8 November 2026 from the application callbacks, historical production dashboard observations, [verified preview Resend evidence](mm-acceptance/preview-resend-smtp.json), and current public upstream Supabase dashboard/docs source. No production settings were read live or changed, no credentials accessed, and no email sent. Historical production observations remain Site URL `http://localhost:3000`, empty redirects and custom SMTP disabled; these need current non-secret readback before applying a reviewed diff. Preview sender recovery passed by owner report, with its single request independently observed; do not repeat that preview test. Older DNS Pending/Forge Disabled notes below are historical and superseded by the later verified sender evidence.

| Setting | Proposed production value | Verification / constraint |
|---|---|---|
| Site URL | `https://notationeducation.online/` | Official apex origin; not localhost or a preview host |
| Redirect allowlist | `https://notationeducation.online/` and `https://notationeducation.online/?auth=recovery` | Exact paths generated by `app/page.tsx` and `app/password-recovery.ts`; no wildcard or preview callback |
| Custom SMTP | Enabled after final settings approval | Existing Resend service, no new OAuth connection, provider or DNS edits |
| Sender address | `no-reply@auth.notationeducation.online` | Reuse the preview-verified sender/domain |
| Sender display name | `Notation Education` | Proposed display text; actual existing preview display name not recorded |
| SMTP host / port | `smtp.resend.com` / `465` | TLS transport; reuse preview configuration |
| SMTP username | `resend` | Provider's SMTP username, not the owner's login email |
| SMTP password | Existing appropriate scoped Resend sending key, entered privately in provider settings | No value in this repository/chat. Confirm permission/domain scope and availability; do not rotate, create, copy through chat or expose the saved key |
| Confirm-email requirement | Preserve enabled email confirmation | Do not disable confirmation to bypass delivery; inspect the actual setting before final diff |
| Project email send rate | Initial proposal **30 emails/hour** with custom SMTP | Official documented initial custom-SMTP limit; not a measured traffic requirement or verified current value. Review existing value and expected signup/reset traffic before changing |
| Minimum interval per user | Initial proposal **60 seconds** with custom SMTP | Dashboard setting is `Minimum interval per user`; inspect current value and retain a more restrictive value pending review |
| Other login/refresh/OTP verification limits and email-token expiry | Preserve existing settings pending non-secret inspection | No unsupported default values or broad limit increases proposed |

The documented Resend Free limits previously observed were 100/day and 3,000/month; these are historical, not current account readback. Check the actual account plan, remaining quota and combined preview/production use before rollout. A Supabase hourly limit does not enforce a provider daily/monthly quota. Keep email click/link tracking off for Auth links. Do not buy a plan or add a custom mail queue/hook to solve a configuration problem.

### Confirmation and recovery templates

Inspect the current production **Confirm signup** and **Reset password** templates before proposing replacements; preserve compatible existing branding/copy. Their action links must use the Supabase verification URL `{{ .ConfirmationURL }}`. A bare `{{ .SiteURL }}` or `{{ .RedirectTo }}` link does not verify the token. Do not introduce a custom `/auth/confirm` endpoint, manually compose token links, or paste real sent email links/tokens into chat. Existing client code handles Supabase's session callback and recovery event on the root page.

If a template is incompatible, these minimal replacements are prepared for review only (no code change):

Confirm signup — subject: `Confirm your Notation Education account`

```html
<h2>Confirm your email</h2>
<p><a href="{{ .ConfirmationURL }}">Confirm email address</a></p>
```

Reset password — subject: `Reset your Notation Education password`

```html
<h2>Reset your password</h2>
<p><a href="{{ .ConfirmationURL }}">Choose a new password</a></p>
<p>If you did not request this, you can ignore this email.</p>
```

With the proposed allowlist and current application requests, confirmation returns to `https://notationeducation.online/`; recovery returns to `https://notationeducation.online/?auth=recovery`. Template compatibility is not yet established from the existing screenshots. Do not change unrelated invite, magic-link, email-change or security-notification templates.

### Dashboard inspection — one step at a time

Public upstream dashboard routes/menu were checked; authenticated deployed UI and current project values remain unverified. Production project must be `lmuwsjjrqmmmtmxjvqln` throughout.

1. **Current next step:** [Authentication → Notifications → Emails → Templates](https://supabase.com/dashboard/project/lmuwsjjrqmmmtmxjvqln/auth/templates). Open **Confirm signup** and provide only its subject/template HTML (or screenshot of the editor). Do not save, send a test email or share a real email/token. After reviewing it, inspect **Reset password** the same way.
2. Then inspect [URL Configuration](https://supabase.com/dashboard/project/lmuwsjjrqmmmtmxjvqln/auth/url-configuration): current Site URL and full redirect list only. Preserve legitimate existing production callbacks through transition; any removal requires review.
3. Then inspect [Emails → SMTP Settings](https://supabase.com/dashboard/project/lmuwsjjrqmmmtmxjvqln/auth/smtp): enabled state, sender address/display name, host/port/username only. Keep password/API-key fields hidden. Existing scoped credential availability is a private owner check, not a request for its value.
4. Then inspect [Rate Limits](https://supabase.com/dashboard/project/lmuwsjjrqmmmtmxjvqln/auth/rate-limits): displayed limits, units and minimum per-user interval. Check provider quota separately without exposing account billing/payment details or keys. Inspect email confirmation/token expiry where actually exposed; do not invent a control if it is absent.

Remaining blockers: current template/URL/SMTP/limit readback; current sending-domain/quota/key-scope check; canonical `www` to apex behaviour (the app generates callbacks from the browser origin); final settings/deployment sequencing approval; and an approved minimal production confirmation/recovery acceptance test after settings are applied. Existing preview acceptance is retained but cannot prove production delivery. No new application code, dependencies or test tooling is needed for this preparation.

Sources checked: [Supabase email templates](https://supabase.com/docs/guides/auth/auth-email-templates), [custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [rate limits](https://supabase.com/docs/guides/auth/rate-limits), and public upstream `apps/studio/components/layouts/AuthLayout/AuthLayout.utils.ts`, `pages/project/[ref]/auth/templates/index.tsx`, `auth/smtp.tsx`, `auth/url-configuration.tsx`, `auth/rate-limits.tsx`, plus `components/interfaces/Auth/RateLimits/RateLimits.tsx`. Retrieved from the public Supabase GitHub source through already-permitted HTTPS hosts; no network policy changed.

## Cloudflare migration build — prepared, not deployed

[Fresh build-only evidence](mm-acceptance/cloudflare-build-preparation.json) records the local production build, archived artifact rescan and restored preview build. Remote Git refs were checked: review branch remains `8dd72888745a73cf0e0a412c0b1825d54dbbddd7`; `main` remains `97ab688d9ef138429fd05d78678e2d1236be9957`. The recorded Cloudflare integration is `Dyrxal/tutoring`, production branch `main`, Worker `notation-education-lms`, root `/`, build `npm run build`, deploy `npx wrangler deploy`; these are historical owner dashboard observations, not a fresh authenticated Cloudflare read. No Cloudflare credential/management tool is available in this session. Do not merge to verify integration because a merge may trigger deployment.

### Exact proposed production build settings

Apply only after final settings approval in **Worker → Settings → Builds → Production → Variables and secrets** (the production build scope, not Previews Base or only Worker runtime bindings). Preserve preview variables and commands unchanged. Existing production build values must be read back before editing.

| Name | Proposed value |
|---|---|
| `NEXT_PUBLIC_LMS_TARGET` | `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://lmuwsjjrqmmmtmxjvqln.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Existing production publishable client key, selected/entered privately; no literal value recorded here |
| `NEXT_PUBLIC_DESIGN_PREVIEW` | `false` (or absent if it is not inherited as true; explicit false is the reviewed choice) |
| `NODE_VERSION` | `24.19.0`, matching this successful local rehearsal; repository requirement is Node `>=22.13.0` |

The repository already pins `packageManager: pnpm@11.25.0` and contains `pnpm-lock.yaml`; do not add another lockfile, version file or duplicate pin. Local pnpm is `11.25.0`. Current public Cloudflare build-image docs confirm `NODE_VERSION` support, lockfile-based package-manager selection and `packageManager` precedence over `PNPM_VERSION`; no extra `PNPM_VERSION` override is proposed. Do not confuse the Node build tool version with the Worker's compatibility date (`2026-05-15` in tracked Wrangler config); no runtime/date upgrade is proposed.

Retain the existing `npm run build` and `npx wrangler deploy` commands: the build script invokes the committed `vinext build`, and the repository supplies Wrangler `4.92.0`. Preview deploy commands remain unchanged. Current Cloudflare logs must confirm pnpm `11.25.0`, the intended Node version and installation from the committed lockfile. Required install semantics are `pnpm install --frozen-lockfile`. If automatic installation cannot establish those semantics, review an explicit build-command change to `pnpm install --frozen-lockfile && pnpm build` before applying it; do not invent an unavailable separate Install command control or modify the lockfile to work around a failed install.

### Verification and limits

- The retained pre-migration frontend contains one existing production publishable key. It was selected in process memory and accepted by a read-only request to production `/auth/v1/settings` (HTTP 200); response contents were suppressed. No key was printed or copied to Git and no student/private records were requested. No service-role key was used.
- `pnpm build` succeeded with production variables scoped only to its child process. The two backup secret variables were omitted from that build process. Existing asset checks passed **5/5** across **100 served files**, with the intended production hostname, zero unexpected Supabase hosts and zero supported secret-exposure findings.
- The production artifact was copied to a new private temporary directory and rescanned successfully with an identical artifact digest. It was not served or deployed.
- The local build was restored to preview using unchanged preview defaults; preview asset checks passed **5/5**. No production variables were persisted to shell files, `.env`, Vite defaults or preview settings.
- **Candidate provenance remains unverified:** the earlier permission-runner changes are uncommitted and included in the existing input digest, so current inputs do not match HEAD. The strict preflight guard was preserved; no clean-candidate manifest was fabricated. These are local build/scan results, not a verified production release artifact. Commit reviewed changes and rerun the existing guarded `preflight build`/archive checks before final approval.

Remaining blockers: authenticated Cloudflare production settings/build-log readback; final candidate commit/provenance; full prior frontend version/rollback availability; official-domain smoke testing; and explicit final settings/merge/deployment approval. The existing production build gate remains blocked despite passing local scans. No new application code, dependencies or build tooling was added.

**Owner reminder for final launch approval:** production Auth/email template/settings inspection is postponed at the owner's request, not completed or waived. Resume that inspection before final release approval using the production Auth/email section above. No reminder time was specified; this is a checklist reminder, not a scheduled notification.

Sources checked through already-permitted public GitHub HTTPS: Cloudflare [build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/) and [build configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/), plus the tracked repository configuration. No environment network setting was changed.

## Review-function conflict fix — unchanged package verified locally

[Current package review](mm-acceptance/review-package-verification.json) and [fresh isolated execution evidence](mm-acceptance/local-database-rehearsal.json): **43 passing local checks, 0 failures**, plus **144 passing unit tests, 0 failures**. Existing tests were extended only to exercise stale revision and changed-question errors in original, installed and restored states. No application code, unrelated migration or SQL-package change was made.

Exact existing files:

- [Forward](mm-launch/review-conflicts.forward.sql), SHA-256 `2164ce7f88ddd913b75e0af3e1d0ce2fe7ae021a32b693838a62a3e5553cb3d7`.
- [Rollback](mm-launch/review-conflicts.rollback.sql), SHA-256 `454aa94ebbcaab6b5955f50e809a46cba2b7de36488ab3313816326b55bb48e1`.

The forward package replaces only four explicitly raised logical-conflict SQLSTATEs (`40001` → `PT409`) in `public.note_mistake_review_help(uuid,uuid)` and `public.submit_mistake_review(uuid,uuid,uuid,integer,text,boolean,bigint,jsonb)`: missing schedule in each function, stale revision and changed question in submission. No other function body text changes. PostgreSQL-generated serialization failures are not rewritten or caught by a new handler. Existing actor/enrolment/idempotency checks, function signatures, security settings, ownership and ACLs remain intact. The opposite package's definition guards exactly match the definitions installed by each direction. Both packages retain transactions, 5-second lock timeout, 60-second statement timeout and full definition-drift guards.

Synthetic execution confirms all four conflict paths return `40001` originally and `PT409` after forward; exact rollback restores original definitions/schema/owners/ACLs and every synthetic row digest. Repeated forward/rollback and unexpected definitions abort. Student boundaries remain tested; no real student answer, private file or password input is used. No production/hosted preview SQL was executed.

**Fresh live drift check is blocked, not passed.** Historical authorized production metadata at `2026-11-07T12:48:32.975902+00:00` and the associated review result matched the forward preconditions, as recorded in `independent-verification.json`. This is historical evidence, not a current production capture. The checked-in metadata contract is a preview capture and must not be relabelled as production. Current session exposes no Supabase SQL tool and has no approved database TCP grants/VPN; no connection/policy widening was attempted.

The existing capture generator produced `/tmp/mm-review-verification/production-metadata.sql` using:

```sh
pnpm --silent preflight sql --kind metadata --project-ref lmuwsjjrqmmmtmxjvqln
```

This query uses a read-only transaction, 30-second timeout, and production database/system-identifier guard; it returns schema/function/policy/grant metadata rather than student rows. Run it only through an approved production read-only path (for example, the verified production dashboard SQL Editor). Normalize the captured JSON with the existing `preflight snapshot --kind metadata --project-ref lmuwsjjrqmmmtmxjvqln` command, then run the existing `preflight review --actual FRESH_PRODUCTION_METADATA_JSON --direction forward --out NEW_REPORT_PATH` and metadata comparison. Do not alter captured timestamps, widen freshness windows to pass, or substitute preview/synthetic definitions.

Readiness: package unchanged and verified for later review; production execution remains unapproved and live drift unverified. Before execution, obtain fresh identity-bound metadata, resolve final release prerequisites/explicit deferrals (backup remains owner-deferred with no verified backup), and approve the exact production change. Do not replay migration history, bootstrap/seed/import SQL or apply either package merely to check it.

## Security privilege remediation — staged, not applied

See [current security review](mm-launch/security-review.md), [forward package](mm-launch/security-privileges.forward.sql) and [rollback](mm-launch/security-privileges.rollback.sql). Reuses existing roles and policies: removes four redundant PUBLIC function grants, two direct app-role trigger-function grants, and remaining app-role TRUNCATE privileges on four non-curriculum tables. Apply after owner-content forward; roll back security before owner-content. Normal DML, required helper EXECUTE, service access and function bodies are preserved.

Current production ACL/role/definition drift is unverified; only historical source observations are available. The existing test runner exercises both staged packages together with synthetic data. Results and file hashes are retained in the local evidence after verification. No production access/change, purchase, new role, dependency or unrelated refactoring occurred.

Unresolved: fresh production metadata; exact post-hardening comparator/contract update before release; inherited TRIGGER/REFERENCES review/acceptance; required definer exposure; production leaked-password setting and plan availability; final production approval. These are explicit decisions, not confirmed public exploits or silently passing gates. Backup deferral and Auth/email reminder remain unchanged.

## Launch behaviour follow-up — 8 November 2026

[Fresh focused evidence](mm-acceptance/launch-behaviour-followup.json): **53 existing tests passed, 0 failures; 7 focused Chromium browser checks passed** on the local preview build. All backend responses were synthetic, external destinations intercepted/blocked, and no production/hosted-preview writes or emails occurred. Application/configuration inputs match review HEAD; no product defect was demonstrated and no application fix, dependency or permanent browser framework was added.

Fresh coverage: 390px mobile sign-in/recovery layout without horizontal overflow; invalid/expired recovery guidance using a synthetic URL; delayed enrolments show loading rather than false empty content; failed enrolments show retry; retry resolves genuine empty enrolment; synthetic normal session persists after reload. Focused existing source tests cover recovery identity/session/expiry boundaries, saved-answer restoration/failure handling, review scheduling/date calculations, conflicts/account changes and assigned next tasks. Date/expiry tests simulate inputs; they do not establish actual elapsed-time behaviour.

Retained without unnecessary repeat: prior hosted saved answers/completion reread, private PDF mobile/desktop, review/retry/account-switch flows and preview email delivery/password-update acceptance. These remain historical observations with their original scopes, not new hosted or production results. Tutor-managed enrolment is explicitly retained as requested; no automatic year access added.

Local test startup initially hit an unwritable default config directory, resolved by the documented XDG config setting; existing Worker persisted state then failed with a local SQLite `_cf_ALARM` schema mismatch. Existing Wrangler started successfully against a new temporary state directory; old state was preserved. No code/runtime version change was made to mask the issue, and this is not evidence of a production failure.

**Unverified / owner decisions before release:** physical iPhone/Safari (WebKit executable unavailable), actual overnight rollover and actual token/link expiry. Either perform those checks or explicitly accept their deferral in the final release package. Production login/email/saved-progress/review smoke still needs its approved test identity/scope and final configuration. No device/time deferral is inferred from passing synthetic tests. Auth/email dashboard inspection remains postponed with the previously recorded reminder before approval.

## Executable release preflight — current result

[Generated concise report](mm-acceptance/release-preflight.json): **126 passing, 0 failing, 9 blocked, 4 unverified**. This is preparation evidence, not an approved or completed launch. [Verification details](mm-acceptance/independent-verification.json) record the actual candidate, build digests, read-only observation times and limitations. Use [the tested commands](mm-launch/preflight-tools.md), [exact cutover sequence](mm-existing-backend-cutover.md#tested-release-and-rollback-sequence) and [backup/restore checklist](mm-launch/manual-backup-plan.md).

- **Passing:** 144/144 tests (108 application/configuration, 33 preflight, 3 local-runner guards), plus 37 local synthetic database checks; TypeScript; actual preview and production-target build-only rehearsals using their intended public backend settings; both asset scans/provenance; 85 production metadata checks, 12 aggregate preservation checks and 3 forward-SQL package/definition guards. Current local build restored to preview. Production still has its original review functions.
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
| Real preview email | Passing named checks; new sender recovery owner-verified | Resend domain verified; preview SMTP saved. Controlled reset request HTTP 200; owner confirmed delivery, recovery screen, password update, sign-in and reload. Earlier confirmation/reused-token evidence retained; no new signup send. See preview-resend-smtp.json | No repeat message needed |
| Production build isolation | Passing build-only | Tested candidate built with actual retained-project public settings obtained through existing scoped access; all served files scanned, no preview hostname or secret exposure detected, Git/input/artifact provenance matches. Actual Cloudflare build environment unverified; local preview build restored | No |
| Executable release checks | Passing tooling; launch blocked | 144 unit tests plus 37 local synthetic database checks; metadata/baseline/package guards exercised against read-only captures and synthetic negative fixtures. Generated report above retains 9 blockers and 4 unverified gates | Resolve named prerequisites before final approval |
| Review timeout production fix | Package verified locally; fresh production drift blocked | Pinned forward/rollback files unchanged; all four conflict paths and exact rollback tested in synthetic isolated PostgreSQL. Historical production comparison retained separately | Fresh production metadata and final write approval |
| Production Auth/email/templates | Blocked | Existing tools lack management settings; no broad OAuth. Owner screenshots: localhost Site URL, no redirects, custom SMTP off. Need official-origin plan plus templates/limits | Dashboard values/screenshots, no passwords |
| Database + Storage recovery | Deferred by owner; recovery unverified | No verified database or private Storage backup exists. Setup and real restore rehearsal paused; automated recovery gates remain blocked | No backup setup input requested; retain this limitation in final launch approval |
| Cloudflare integration | Dashboard verified; configuration change pending approval | Owner screenshots: Dyrxal/tutoring, production main, builds enabled, npm run build, npx wrangler deploy, root /. No production build variables/secrets. Migration defaults to preview: explicit production configuration required before merge | Final configuration approval; active frontend version 3862f733 captured, rollback execution unverified |
| Final domain / DNS | Existing custom domain observed | Screenshot lists notationeducation.online as Production custom domain on notation-education-lms. Worker and preview workers.dev URLs enabled. No DNS change proposed; actual TLS/runtime smoke remains pending | Final launch approval, not DNS editing |
| Remaining device/time acceptance | Unverified, proposed deferral | Physical iOS/Safari, actual overnight rollover and time-based link expiry. WebKit launch attempted: executable missing. No device-result claim | Explicit deferral or actual device verification |
| Existing loading/enrolment behavior | Loading defects fixed; enrolment limitation retained | Catalogue loading/failure/retry now explicit; no false empty catalogue. Practice locked until saved history is available, with failure retry. No automatic year-enrolment behavior added or changed | Accept current tutor-managed enrolment behavior before launch |
| Security findings | Bounded review completed; acceptance unresolved | See mm-launch/security-review.md. 25 definitions reviewed, 21 definers; local actor/enrolment/role boundaries pass. Inherited broad grants/public exposure and leaked-password settings remain explicit findings | Review/accept limitation or separately approve remediation plan |
| Full-content hosted fidelity | Unverified | Source registries do not write on login; no production question text downloaded. Full live rendering requires approved test-access/smoke scope | Final account/access approval |
| Official launch | Blocked | Resolve hard prerequisites, review exact package and approve actions before launch | One final specific approval |

## Historical protected backup start — superseded by owner deferral

The owner requested starting the actual protected backup. [Precheck evidence](mm-acceptance/protected-backup-start.json): no sensitive export has started. The owner selected Google Drive on 8 November (Australia/Sydney). A folder and non-sensitive status note were created through the existing connection and read back with owner-only permissions; no sharing was added. No encrypted archive exists. This environment still has no configured database/Storage export credential, approved database TCP target or owner-controlled encryption/retrieval setup. Existing metadata/SQL tools cannot safely substitute for a native sensitive dump or private-file export. Backup permission need not be requested again; the next inputs are the existing source credential through a private setup path and an owner-controlled recovery key. Production was not changed; database, Storage and real restore gates remain blocked.

## Independent recovery and permission work — 7 November 2026

[Current evidence](mm-acceptance/independent-verification.json), [37-check local rehearsal](mm-acceptance/local-database-rehearsal.json), [repeatable command](mm-launch/local-database-rehearsal.md), [security findings](mm-launch/security-review.md). No application behavior or hosted data was changed. All new database writes used two network-isolated disposable local containers and synthetic Auth/Storage stubs; containers/volumes and temporary bytes were removed.

- Exact forward/rollback packages preserve synthetic rows and restore original schema/owners/ACLs. Repeated/mismatched packages abort. Both review RPCs return the expected legacy/new conflict code in original/prepared/restored states.
- A negative restore control reproduced duplicate profiles without trigger suppression; stop-on-error rolled back. Suppressed-trigger restore preserved all synthetic table digests/schema, then ordinary new-user profile creation worked. Separate synthetic Storage-byte copy/checksums passed and deliberate corruption was detected. This is not a managed Supabase or real production-data backup rehearsal.
- The default Supabase CLI schema dump excludes managed schemas. Prepared the exact non-sensitive inventory of nine Storage policies and one Auth trigger; migration-history export steps and a tested CLI 2.122.1 pin were added. CLI 3.0.0 has incompatible URL flags. CLI dry runs used only a dummy loopback URL, not production credentials.
- Fresh identity-guarded production metadata and forward guards pass; fresh production and preview aggregate counts/digests match earlier captures with zero missing referenced objects. Production remains 2 courses / 20 modules / 217 lessons / 4,138 questions and 13 private question-image objects. No student answer rows, password material or private file contents were fetched.
- Real recovery, production Auth/SMTP/build configuration, full frontend rollback, existing security/enrolment acceptance, physical-device/time acceptance and final release actions still require the evidence/actions listed in gates.json. No additional emails, production writes, merge, deployment, DNS, purchase or connection creation.

## Resend sender follow-up — 7 November 2026

[Exact evidence and verification method](mm-acceptance/preview-resend-smtp.json). Owner screenshot now shows `auth.notationeducation.online` **Verified**, with Resend Forge enabled. Owner saved the scoped-key SMTP configuration in preview. The first browser request timed out; no matching recovery request appeared in the inspected preview Auth/edge log window. A subsequent single controlled request to preview returned HTTP 200 at 12:30:56 UTC with the exact allowed `/?auth=recovery` redirect. The approved preview account's existence/confirmation was checked with read-only booleans only.

The owner then confirmed receipt and completion of the instructed recovery-screen, password-update, new-password sign-in and reload sequence. **Passing as owner-reported end-to-end preview acceptance**; the request/target/redirect were independently observed, but the assistant did not inspect the inbox or independently operate that callback. No password or live recovery link was collected. No fresh signup/confirmation email, device/expiry/quota test or production email was performed. No repeat send is needed for this passed flow.

This supersedes older statements that the sending domain was still pending. It does not clear production SMTP/Auth, recovery/backup, build/deployment or final approval gates. The earlier preflight evidence is historical; the independent follow-up above refreshes the current report. Every report remains a dated observation and must be regenerated near launch.

## Preview acceptance follow-up — 7 November 2026

[Detailed evidence and exact tested commits](mm-acceptance/preview-final-followup.json). No production request/content access, DNS change, new connection, purchase or email send during this task. Earlier owner-approved email DNS additions were pending at that checkpoint; the later sender follow-up above records successful domain verification.

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

Security package verification at 2026-11-08T10:03:44.721Z: **45 isolated checks passed, 0 failures; 144 unit tests passed, 0 failures**. Evidence input hashes match the current staged SQL and runner. All run-created containers/volumes were removed. No production or hosted-preview access. Security forward SHA-256 `4c53f4bb685775addb60a0a9112159c7340bdb6861a1f01df0def3a119a4d70c`; rollback SHA-256 `52eb81fb11206f75a3f1b28ec024aa9b7b8c851424ee52d836d7008fa315b6de`.
