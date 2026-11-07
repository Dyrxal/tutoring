# MM preview preparation — 5 November 2026

This branch moves the verified published Sites application into the existing GitHub/Cloudflare build workflow. It does not release production or change DNS. Existing application UI, learning templates and functionality are preserved. Midnight redesign work remains separate.

## Completed

- Imported Sites version 120, commit `116e72b356169832f15c18529d77d0072361ab57`, on GitHub main `97ab688d9ef138429fd05d78678e2d1236be9957`.
- Standalone Cloudflare build; same `2026-05-15` compatibility date as the verified baseline build. Original Sites identity retained as provenance.
- Separate Free Supabase project `lcddnpafrkbwsrhqexqe`, Notation LMS Preview, Tokyo. Captured application schema installed only there: 15 tables, 25 functions, 34 policies, 3 triggers, 3 private buckets. All 15 application tables have RLS enabled.
- Initial synthetic seed: 2 courses, 2 modules, 3 lessons, 10 questions; one review-enabled lesson and a flag RPC course scope. No production records, accounts or uploaded learning files copied into this test project.
- Build selects preview by default and rejects the production project for preview use. Production requires explicit target and configuration. Secret/service-role keys are rejected. Preview browser bundle contains the test hostname and zero occurrences of the production hostname.
- TypeScript check passes. Preview and explicit production-target builds pass; build output restored to preview afterward. No production deployment performed.
- 94 tests: **91 pass, 3 fail**, matching the three existing published-source failures. All 9 new backend-isolation tests pass. The existing failures are Year 10/99-section identification, Year 9/97-section rollout, and the next-tasks test expecting a UI component absent from the published source. They were not hidden or repaired by changing application behavior.
- Local baseline/migration render comparisons: login, student dashboard and lesson at **1440×1000** and **390×844**. Each matched comparison has **0 changed pixels**; no page exceptions or horizontal overflow. These are comparisons of local builds with mocked synthetic requests, not proof of a hosted end-to-end match. See [screenshots and machine-readable results](mm-comparisons/results.json).

## Content audit — 7 November 2026

[Chapter/section inventory and launch content work](mm-content-audit.md): all 196 recovered Year 9/10 registry sections inventoried, with source counts and preview exact-prompt matches. Preview catalogue is synthetic acceptance fixtures, not the complete launch curriculum. No chapter is certified complete: original scope/count approval, mathematical review, resources and full hosted visibility/editability remain unverified. No content/database/settings changes or email sends during this audit.

## Current acceptance — confirmation retry blocked, 7 November 2026

Continued from `432f716`. The user explicitly approved one additional Gmail alias for a fresh preview signup to investigate confirmation automatic navigation. One hosted signup request to preview `lcddnpafrkbwsrhqexqe` returned **HTTP429 / `over_email_send_rate_limit` / “email rate limit exceeded”**, displayed by the app. No success/session returned. [Redacted evidence](mm-acceptance/email-confirmation-retry.json).

- **Passing:** request remained on the allowed branch and preview backend; requested confirmation redirect was the branch root. The UI surfaced the provider error.
- **Blocked:** fresh confirmation delivery and automatic sign-in reproduction cannot proceed until the preview sender rate limit resets. No exact reset time was supplied in the captured response. The alias's eligibility for default SMTP delivery remains unverified; rate limiting does not establish acceptance or rejection of that recipient.
- **Unresolved:** earlier first-use confirmation automatic navigation timeout, full Site URL fallback value and other acceptance gaps remain as recorded below. Prior successful signup/reset results are unchanged.
- Stopped after one request: no send retries, no broad OAuth connection, no sender/rate-limit/settings changes, no production access, merge, production deployment or DNS changes. Do not bypass the quota with alternate recipients or team changes. The approved alias can be retried later without requesting address approval again.

## Previous acceptance — live preview email, 7 November 2026

Continued from `cdf4bc8`. User approved the exact test inbox and updated preview Auth URLs in the dashboard. [Redacted live evidence](mm-acceptance/email-live.json). This section supersedes earlier missing-inbox/allowlist blockers; all backend access remained on `lcddnpafrkbwsrhqexqe`. No broad OAuth connection, production access, merge, production deployment or DNS change.

### Passing

- Dashboard screenshot shows both exact branch root and `/?auth=recovery` allowlist entries. Site URL shows the branch prefix but is truncated. Custom SMTP remains off; actual messages arrived from Supabase Auth `<noreply@mail.app.supabase.io>` in the approved connected inbox.
- One real hosted signup request returned HTTP200/session absent and the expected confirmation notice. Before confirmation, password login returned HTTP400/“Email not confirmed”. The delivered signup link targets the preview Auth verify endpoint with the exact allowed branch-root redirect. The account became confirmed with the expected student name/year/role. Fresh password login and reload succeeded.
- One real hosted reset request returned HTTP200 with the exact recovery redirect. Email delivered; actual verify response HTTP303 returned to the allowed branch origin/root with `auth=recovery`. Verified recovery fields rendered and survived reload. Real password update succeeded and signed out (HTTP204), returning to sign-in. Old password then failed HTTP400/“Invalid login credentials”; new password succeeded and dashboard survived reload.
- Reusing each consumed email link returned preview `otp_expired`, no callback access token and no password fields. Recovery displays invalid/expired state with Request a new link. Both reuse destinations stayed on the allowed branch.
- Two real send requests total (one signup, one reset); no retries of sends. Earlier browser selector timeouts occurred before submission. One synthetic preview student account retained; no course content/enrolments changed. Prior source/build/mock results remain recorded below; no application code changed in this email run.

### Failing / unresolved

- First-use confirmation browser timed out waiting for Account/dashboard after 60 seconds. Confirmation itself persisted, and fresh login works, but callback automatic sign-in/navigation is **not passing**. Final callback state was not captured, so a root cause cannot be claimed. A fresh explicitly approved signup inbox/alias is needed to reproduce without reusing the consumed link.
- Reused confirmation links return to ordinary sign-in without a visible expiry notice. Backend denies reuse; user-facing diagnostic is absent.

### Unverified

- Full Site URL value (truncated screenshot), actual time-based expiry, real mobile email callbacks, live recovery account-switch race, sender quota/rate limits and custom template settings. Successful explicit redirects do not prove Site URL fallback. Existing mobile/account-switch mocks remain separate.
- Other broader migration acceptance gaps below remain open. These email checks do not establish production release readiness.

## Previous acceptance — password recovery, 6 November 2026

Continued from `896e6ce`; implementation `e19d15f` is pushed to the review branch and served on the allowed branch preview. Only preview Supabase `lcddnpafrkbwsrhqexqe` was contacted. [Evidence](mm-acceptance/password-reset.json) and [email acceptance procedure/blockers](mm-email-acceptance.md). Historical sections below are superseded where noted.

### Passing

- Implemented the documented two-screen proposal: “Forgot password?” request form and verified recovery/new-password form. Existing sign-in and registration fields/metadata are retained; signup explicitly requests the branch root as its confirmation redirect.
- Recovery requires a server-verified user and matching recovery callback, SDK event or account/session-bound tab proof. A query marker or ordinary cached login alone is insufficient. Reload retains valid recovery intent; account changes clear sensitive fields. Password mutation uses an isolated, nonpersistent SDK client bound to the verified session, preventing a switched shared account from receiving the update.
- **13/13 mocked browser scenarios pass locally and on the hosted branch preview**, including retry/rate errors, generic acknowledgements, duplicate submission, expired/invalid links, recovery reload, password validation, mobile layout, signup confirmation callback, account switching and signout failures. All Supabase HTTP requests in these browser tests were intercepted; these results do not establish delivery or real token acceptance.
- **105/105 source tests pass**, including 7 recovery tests. Preview build and TypeScript pass. Review findings were reproduced and fixed: cached-session request navigation, wrong-account mutation race, misleading cancellation status and stale async exit handling.
- Read-only preview public Auth settings returned HTTP200: email enabled, signup enabled, confirmation required. No real signup/reset messages were requested; existing preview accounts were not changed by this task.

### Failing

- No failing check in the named source suite or mocked browser scenarios. Real email acceptance remains incomplete; mocked success is not a substitute.

### Unverified / blockers

- **Approved test inbox required before any real messages.** Signup delivery, actual confirmation/recovery links, real redirect destinations, old/new password login, token expiry/reuse and sender quota remain unverified. No approved address has been supplied.
- Preview Auth Site URL, redirect allowlist and sender configuration remain unverified. Public settings do not expose them. Automatic approval review rejected adding a separate persistent Supabase OAuth connection because it could grant account/project access beyond this preview. No connection was created. Supply the preview settings directly or explicitly approve that broader connection before management inspection.
- Requested confirmation redirect: branch root. Requested recovery redirect: branch root with `?auth=recovery`. Both request values and mocked callbacks pass; the real service allowlist/fallback behavior is not yet verified.
- No production access, merge, production deployment or DNS changes. Existing non-email acceptance gaps recorded below remain open.

## Previous acceptance — review/conflict follow-up, 6 November 2026

Continued from `5f9abb9`. Runtime fix `bd3a24b` was verified on the **allowed branch preview** with **Supabase `lcddnpafrkbwsrhqexqe` only**. [Current evidence](mm-acceptance/review-followup.json). No production access, merge, production deployment or DNS changes. The previous sections below are historical and superseded where noted.

### Passing

- **Stale review timeout fixed.** Expected stale revision, edited question and missing-schedule conflicts now use SQLSTATE `PT409`/HTTP **409**, rather than retryable `40001`/HTTP500. The reproduced 25-second timeout became a **0.56-second** response. The client recognises both new and legacy conflict codes and offers refresh while retaining the typed answer.
- Applied preview migration **`20261106074516_mm_review_conflicts.sql`** to `submit_mistake_review` and `note_mistake_review_help`. Only the four logical conflict error codes changed; owner, ACL, security/search-path settings, actor/enrolment checks, grading, locks and idempotency are unchanged. The local migration/setup mirror uses the actual applied version (the CLI-generated draft was renamed to align with the recorded preview migration). Future preview setup must apply this follow-up after its captured baseline; historical setup files remain historical.
- **22/22 preview API checks:** fast conflicts with no answer/schedule write, saved short answer, same-ID uncertain retry, duplicate-ID/different-answer rejection, fresh revision retry, concurrent duplicate retries producing exactly one answer and one schedule transition, and anonymous/other-account/unenrolled denials.
- **5/5 hosted browser flows:** tutor assignment is visible and opens its lesson without duplicating the current continue card; stale refresh retains typed `5` and saves under a fresh ID; a deliberately lost successful response retries with the **same** ID; a held A response released after same-page sign-out/sign-in cannot populate B's dashboard, before or after reload; signing back into A restores the original ordinary lesson answer `4`, separate from review answer `5`.
- Four authenticated rereads confirmed the conflicted browser submission was absent and each successful browser submission was stored once. The assigned fixture is also the automatic next lesson, explicitly covering that filter edge.
- **98/98 source tests pass**, including four new conflict/retry/account/assignment tests. Preview build and TypeScript pass. Independent review found no blocking/important issue and independently passed 44 affected tests.
- **PDF non-regression: 4/4** hosted desktop/Android-emulated render checks still pass after sign-in/reload. The same private PDF, browser worker/version and nonblank-pixel checks were used.

### Three previous baseline failures: diagnosis and resolution

| Failure | Classification | Resolution without weakening safeguards |
|---|---|---|
| Year10/99-section assertion | Stale assertion | Import `6fd82bf` deliberately added common-mistakes-only fallbacks. Flow-map presence does not mean structured practice is enabled. Tests still cover all 99 sections and now verify skipped reasons, legacy rendered grouping, saved opt-out and unchanged data. Rollout code/content unchanged. |
| Year9/97-section assertion | Stale assertion | Same published fallback. Retained all 97 sections and added rendered checks for incomplete/duplicate-ID sets and unchanged inputs. No content/eligibility rules relaxed. |
| Missing StudentNextTasks mount | Actual defect | Tutor-created assignments were persisted but invisible to students. Restored the existing component in assignment-only mode, preserving the current resume card and showing unfinished accessible assignments, including an assigned automatic lesson. Original integration assertion remains. |

The source history and clarified behavior are recorded in [lesson-template guidance](lesson-template.md#imported-common-mistakes-fallback-and-skipped-layouts). The tests were not made green by dropping cases, lowering section counts or enabling invalid layouts.

### Failing / unresolved

- No failing check in this run's 98-test suite, 22 API checks or named hosted browser flows. This does not establish release readiness for the unverified items below.
- Historical status at the review/conflict checkpoint: password-reset UI was still absent. This is an explicitly deferred feature gap, not an implemented fix. The smallest proposal is two auth-card modes: request a link and choose a new password from a verified recovery session, with cold-load/reload/error handling. [Concrete proposal, touched files and prerequisites](mm-email-acceptance.md#smallest-password-reset-change-proposed-not-implemented). **Implemented in the current password-recovery checkpoint above.**
- Existing captured auto-enrolment absence, generic distractor fixture drift, transient catalogue-loading empty state and advisor findings remain unchanged. Advisors still show 4 anon/17 authenticated SECURITY DEFINER signatures and disabled leaked-password protection.

### Unverified / retained fixtures

- **Email delivery remains unverified. No real emails sent.** No approved test address was supplied; no signup/confirmation/reset send endpoint or delivery configuration was used/changed. SMTP, Site URL and redirects still need preview-only verification before an approved-inbox test.
- Full all-section hosted acceptance, full hosted visual parity, physical iOS/Safari and real overnight schedule rollover remain unverified. Passing source tests and controlled fixtures do not establish those results.
- Added one clearly named preview review lesson with three questions, two incorrect lesson attempts, a tutor assignment and synthetic review history for reproducibility. Current totals: 3 accounts, 4 courses, **7 lessons/55 questions**, 3 private buckets/4 retained objects, 15 application tables with RLS. Only this new fixture's due date was controlled; its final schedule was saved by the real RPC. Original lesson content and account enrolments are retained.
- Optional acceptance runner: `MM_TEST_ACCOUNTS=/path/to/untracked-preview-accounts.json node scripts/check-review-preview.cjs` (Playwright/Chromium available to Node). It uses the retained fixture, starts from a due short-answer review, confines requests to branch/local preview plus the specified preview backend, and writes no credentials. It simulates stale/lost/delayed responses against actual preview RPCs. A fresh run may need that **preview-only** fixture marked due; never change real account schedules to run it.

## Previous acceptance — PDF fix follow-up, 6 November 2026

Continued from `345476a`; worker fix pushed as `6aab022`. Tested only the allowed branch preview and **Supabase `lcddnpafrkbwsrhqexqe`**. No production requests/data access, production deployment, merge or DNS changes. The existing review-branch workflow published the preview update. [Detailed current evidence](mm-acceptance/pdf-followup.json); the historical run below is retained and superseded by this section.

### Passing

- **Private PDF: 4/4 hosted render checks.** Chromium desktop **1440×1000** and Android mobile emulation **390×844**, each after password sign-in and after reload. Verified “Page 1 of 1”, nonblank rendered pixels, a newly created same-origin worker per phase, HTTP 200 JavaScript worker content, PDF.js **6.3.289** and no viewport overflow/page exceptions. Physical iOS/Safari was not tested.
- The old URL was reproduced in a failing browser regression. `app/PdfViewer.tsx` now imports `pdfjs-dist/build/pdf.worker.min.mjs?url`; Vite emits the worker from the installed package. It no longer resolves the URL against Vinext's server `file:///ROOT/...` replacement. The original authenticated private download and in-memory PDF bytes are unchanged. No CDN or copied/version-mismatched worker was introduced.
- Preview build and TypeScript check pass. Local built-app PDF checks also pass on desktop/mobile. Independent code review found no blocking issue; its reload-worker test gap was addressed by requiring a new worker for each phase.
- **78 API checks pass:** the previous 70 were repeated (existing progress upsert correctly returns 200 and was reread), plus 6 checks on the retained private PDF and 2 controlled scheduled-review transitions. Enrolled private download succeeds; anonymous/public/unenrolled access and unenrolled signing fail; student upload fails. All three buckets remain private, and all 15 application tables retain RLS.
- **6 additional hosted UI checks pass:** Year 9 1B and Year 10 1A flag/withdraw with persistence after reload; 8 core answers saved and lesson completion retained after reload without optional answers; tutor lesson-text and notes/example image saves with reload; tutor question-diagram edit with reload; enrolled-student decoding of all three private images.
- Scheduled-review fixture: a due correct answer advances stage 0→1 and next due date by 3 days; correct answer with help already used resets stage to 0/due +1 day. Original schedule stage/dates restored; monotonic current revision and synthetic test attempts retained. These are controlled preview fixtures, not an overnight clock test.

### Failing / unresolved

- **Stale review conflict response:** two requests using an outdated revision timed out after 25 seconds. Preview logs show repeated SQLSTATE `40001` from `submit_mistake_review` line 26 under PostgREST 14.18 at approximately one-second intervals. The stale write was not counted as accepted, but a prompt denial and UI recovery response were not verified. The captured RPC error/retry interaction needs a separate fix; no schema/RPC permissions were changed here.
- **Source suite remains 91/94**, the same before and after the worker fix. Failures: Year 10/99-section identification; Year 9/97-section rollout; next-tasks UI assertion expecting the absent `StudentNextTasks` component. They were not hidden by changing application behavior.
- **Password reset UI is absent** in the captured application: no recovery request action/form or `PASSWORD_RECOVERY` handler. This is a feature gap, separate from email delivery. The PDF fix does not add an authentication feature.
- Generic synthetic question distractors still differ from the committed seed. Transient “No courses assigned”/answer-loading states remain unchanged. Security advisors still report 4 anon and 17 authenticated SECURITY DEFINER signatures, plus disabled leaked-password protection. These findings were not silently cleared. [Password-security guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

### Unverified / prerequisites

- **No real emails sent.** Public preview Auth settings confirm email enabled, signup allowed and confirmation required. No approved test inbox was supplied. Site URL, redirect allowlist, SMTP sender/configuration and actual delivery are not exposed by that public endpoint and remain unverified. [Exact email acceptance prerequisites and steps](mm-email-acceptance.md).
- Full all-section Year 9/10 acceptance remains pending; one 21-question representative lesson per year was tested. Full hosted visual parity, physical mobile browsers and real overnight review rollover remain unverified. Automatic year-based enrolment remains absent from the captured backend; fixtures are explicitly enrolled.

### Retained fixtures and rerun

Added two separate repository-bank acceptance courses, leaving original generic fixture content intact. Current preview totals: **3 accounts, 4 courses, 4 modules, 6 lessons, 52 questions**. Student A is enrolled in the original mathematics course plus both acceptance courses; Student B remains enrolled only in MM Access Check. Retained Storage: the existing private PDF and three UI-uploaded images on the new Year 9 lesson (4 objects total). Replaced and API-only upload objects were removed. No production records were copied.

Optional browser regression (Playwright 1.62.1 and Chromium were available in this execution environment):

```sh
MM_TEST_ACCOUNTS=/path/to/untracked-preview-accounts.json node scripts/check-pdf-preview.cjs
```

The untracked JSON array must contain the enrolled test student first as `{ "email": "...", "password": "..." }`. The script permits only this branch host or local builds, blocks other application hosts, and writes no credentials/tokens. `MM_PREVIEW_URL` and `CHROMIUM_PATH` select a local build/browser if required. Playwright must be available to Node; it is not a new application dependency.

## Historical acceptance — before the PDF fix (6 November 2026)


Tested commit `6fd82bf` on `feat/mm-cloudflare-migration`. The active managed environment reported running, connected, current observations and enforced network policy. Only the [allowed branch preview](https://feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev/) and preview Supabase **`lcddnpafrkbwsrhqexqe`** were used for application checks. The version-specific deployment URL remains blocked and was not retried in this run. No production application/backend requests, merge, production deployment, DNS change, schema change or production data write was performed.

**70/70 authenticated/anonymous API checks pass. Hosted acceptance is not fully passing: the PDF viewer fails.** [Recorded results, statuses and exact limitations](mm-acceptance/results.json).

| Check | Actual result |
|---|---|
| Preview network | Branch app HTTP 200; Supabase reached and identified the preview project (401 without a key). Authenticated REST/Auth/Storage requests succeeded. |
| Test accounts | Three confirmed synthetic accounts provisioned through preview-only SQL fixtures, including email identities and password hashes. Profile trigger created student profiles; only the tutor fixture was explicitly promoted through privileged SQL. These were not successful self-service signups. |
| Password sign-in | Student A, Student B and tutor pass through Auth. Hosted browser sign-in passes for all three; tutor sees Content and both synthetic courses. |
| Session handling | Valid refresh succeeds, sign-out succeeds, refresh after sign-out and wrong password are denied. Hosted student sign-out remains signed out after reload. Existing access JWT lifetime was not tested. |
| Student saving | Own practice attempt, profile and lesson-progress writes persist. Hosted short answer `3` saves with HTTP 201 and is restored as “Your answer: 3” after reload and a separate sign-in. Existing incorrect MC answer also restores. Lesson completion was written as an API fixture; completing all core questions through UI remains unverified. |
| Tutor saving | Tutor lesson-note edit is visible to enrolled student on a fresh read; original notes restored afterward. Tutor can read student attempts. Task assignment and report resolution RPCs pass. |
| Course/data boundaries | Each student reads only their enrolled course; tutor reads both. Student B hosted dashboard shows only MM Access Check. Other-student attempts are hidden. Forged student IDs, unenrolled answers/progress, self-enrolment, role escalation and direct forged review metadata are denied. Other-profile/progress/content updates affect zero rows or are denied. |
| Uploads/private Storage | Tutor upload, byte-identical enrolled-student download, enrolled signing/signed download, public denial, unenrolled download/signing denial, student-upload denial and tutor cleanup pass for question-images, lesson-images and lesson-resources. All three buckets remain private. |
| Hosted PDF upload | Tutor uploads valid synthetic one-page `mm-acceptance.pdf`; lesson resource list saves and enrolled student can open its viewer. **Rendering fails; see below.** |
| Review RPC | Initialisation, early-practice submission and idempotent retry pass. Other-student/tutor/anonymous initialisation and actor spoofing are denied. Future due-date progression has not been time-advanced or tested. |
| Flag/report/task RPCs | Enrolled flag/withdraw, student report submission, tutor report resolution and tutor task assignment pass. Spoofed flag actor, student tutor spoof and student moderation are denied. |

### Synthetic fixtures retained

- Student A: `mm-student-a-20261106@example.com`, ID `e1111111-1111-4111-8111-111111111111`; enrolled only in MM Preview Mathematics.
- Student B: `mm-student-b-20261106@example.com`, ID `e1111111-1111-4111-8111-111111111112`; enrolled only in MM Access Check.
- Tutor: `mm-tutor-20261106@example.com`, ID `e1111111-1111-4111-8111-111111111113`.
- Random passwords, session tokens and temporary automation files are untracked in the execution workspace; none are included in GitHub evidence. These fixture emails are not inboxes.
- Synthetic saved attempts/progress, one withdrawn flag, one resolved problem report, one assigned task and review schedule are retained for repeat checks. API-only upload fixtures were deleted and verified absent before the hosted PDF test. The single hosted PDF and its lesson resource reference are retained to reproduce the viewer error. Original lesson notes were restored.

### Unresolved / not release-ready

- **PDF worker failure:** tutor upload and enrolled private download succeed, but hosted student viewer reports `Setting up fake worker failed: "Failed to fetch dynamically imported module: file:///_next/static/media/pdf.worker.min.Dswkl-cV.mjs".` Worker requests fail and “Page 1 of 1” never appears within 60 seconds. A canvas element alone was not accepted as rendering proof. Investigate the build/runtime worker URL in `app/PdfViewer.tsx`; no application change or preview redeploy was made in this acceptance run.
- **Self-service signup/email:** requests with synthetic `example.com` addresses returned `email_address_invalid` (400), followed by `over_email_send_rate_limit` (429). Confirmed fixtures allow real sign-in tests but do not verify signup email, confirmation/reset redirects or delivery. No real recipient email was used and no Auth delivery configuration was changed.
- **Fixture drift:** live preview question 3 options are `["5","4","6","3"]`; committed seed specifies `["5","4","6","7"]`. Other distractors also differ. Correct answer used in acceptance remains unchanged. No live content was overwritten to conceal this discrepancy.
- **Loading UX:** student dashboard briefly shows “No courses assigned” before its real catalogue request finishes; lesson answers also populate asynchronously. Course/answer checks passed when waiting for data. This transient empty state remains unchanged.
- Full representative Year 9/10 fixtures, flag UI, scheduled review day transitions, full tutor lesson/image editor workflows, and hosted mobile/visual parity remain pending. RPC acceptance does not establish those UI flows. Existing baseline source-test failures and advisor findings below are not cleared by these checks.
- Existing source/backend discrepancy remains: auto-enrol helper functions/triggers referenced by UI text are absent from the captured database. Account fixtures were explicitly enrolled; automatic year-based enrolment was not claimed to work.

## Historical source/security review

Unused legacy `mockups/` files are excluded from this branch and retained in the original source backup. Automatic approval review rejected uploading one legacy dashboard mockup because its contents had not been verified for GitHub disclosure. No indirect upload of its SVG/embedded-image equivalent was attempted. New comparison screenshots use verified synthetic mocks.

Independent review found no critical issue or application-code drift from the published baseline. It identified missing review/flag fixture enablement (added; UI acceptance remains pending) and a duplicate synthetic MC answer (corrected in file and test database).

Supabase advisors flag the captured SECURITY DEFINER RPC exposure: four functions callable by anon and seventeen signatures by authenticated users. These match the captured baseline permissions, not a new grant expansion. At that review, authenticated actor/role checks and access boundaries were pending. Current acceptance above verifies the named flows, not every exposed function signature. See the [anon function advisory](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) and [authenticated function advisory](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

## Screen comparisons

| State | Baseline desktop | Migration desktop | Baseline mobile | Migration mobile |
|---|---|---|---|---|
| Sign in | [image](mm-comparisons/baseline-login-desktop.png) | [image](mm-comparisons/migration-login-desktop.png) | [image](mm-comparisons/baseline-login-mobile.png) | [image](mm-comparisons/migration-login-mobile.png) |
| Dashboard | [image](mm-comparisons/baseline-dashboard-desktop.png) | [image](mm-comparisons/migration-dashboard-desktop.png) | [image](mm-comparisons/baseline-dashboard-mobile.png) | [image](mm-comparisons/migration-dashboard-mobile.png) |
| Lesson | [image](mm-comparisons/baseline-lesson-desktop.png) | [image](mm-comparisons/migration-lesson-desktop.png) | [image](mm-comparisons/baseline-lesson-mobile.png) | [image](mm-comparisons/migration-lesson-mobile.png) |
