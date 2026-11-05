# MM preview preparation — 5 November 2026

This branch moves the verified published Sites application into the existing GitHub/Cloudflare build workflow. It does not release production or change DNS. Existing application UI, learning templates and functionality are preserved. Midnight redesign work remains separate.

## Completed

- Imported Sites version 120, commit `116e72b356169832f15c18529d77d0072361ab57`, on GitHub main `97ab688d9ef138429fd05d78678e2d1236be9957`.
- Standalone Cloudflare build; same `2026-05-15` compatibility date as the verified baseline build. Original Sites identity retained as provenance.
- Separate Free Supabase project `lcddnpafrkbwsrhqexqe`, Notation LMS Preview, Tokyo. Captured application schema installed only there: 15 tables, 25 functions, 34 policies, 3 triggers, 3 private buckets. All 15 application tables have RLS enabled.
- Synthetic content only: 2 courses, 2 modules, 3 lessons, 10 questions; one review-enabled lesson and a flag RPC course scope. No production records, accounts or uploaded learning files copied into this test project.
- Build selects preview by default and rejects the production project for preview use. Production requires explicit target and configuration. Secret/service-role keys are rejected. Preview browser bundle contains the test hostname and zero occurrences of the production hostname.
- TypeScript check passes. Preview and explicit production-target builds pass; build output restored to preview afterward. No production deployment performed.
- 94 tests: **91 pass, 3 fail**, matching the three existing published-source failures. All 9 new backend-isolation tests pass. The existing failures are Year 10/99-section identification, Year 9/97-section rollout, and the next-tasks test expecting a UI component absent from the published source. They were not hidden or repaired by changing application behavior.
- Local baseline/migration render comparisons: login, student dashboard and lesson at **1440×1000** and **390×844**. Each matched comparison has **0 changed pixels**; no page exceptions or horizontal overflow. These are comparisons of local builds with mocked synthetic requests, not proof of a hosted end-to-end match. See [screenshots and machine-readable results](mm-comparisons/results.json).

## Hosted acceptance — 6 November 2026 (Australia/Sydney)

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

## Review

Unused legacy `mockups/` files are excluded from this branch and retained in the original source backup. Automatic approval review rejected uploading one legacy dashboard mockup because its contents had not been verified for GitHub disclosure. No indirect upload of its SVG/embedded-image equivalent was attempted. New comparison screenshots use verified synthetic mocks.

Independent review found no critical issue or application-code drift from the published baseline. It identified missing review/flag fixture enablement (added; UI acceptance remains pending) and a duplicate synthetic MC answer (corrected in file and test database).

Supabase advisors flag the captured SECURITY DEFINER RPC exposure: four functions callable by anon and seventeen signatures by authenticated users. These match the captured baseline permissions, not a new grant expansion. Authenticated actor/role checks and access boundaries still require integration testing. See the [anon function advisory](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable) and [authenticated function advisory](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable).

## Screen comparisons

| State | Baseline desktop | Migration desktop | Baseline mobile | Migration mobile |
|---|---|---|---|---|
| Sign in | [image](mm-comparisons/baseline-login-desktop.png) | [image](mm-comparisons/migration-login-desktop.png) | [image](mm-comparisons/baseline-login-mobile.png) | [image](mm-comparisons/migration-login-mobile.png) |
| Dashboard | [image](mm-comparisons/baseline-dashboard-desktop.png) | [image](mm-comparisons/migration-dashboard-desktop.png) | [image](mm-comparisons/baseline-dashboard-mobile.png) | [image](mm-comparisons/migration-dashboard-mobile.png) |
| Lesson | [image](mm-comparisons/baseline-lesson-desktop.png) | [image](mm-comparisons/migration-lesson-desktop.png) | [image](mm-comparisons/baseline-lesson-mobile.png) | [image](mm-comparisons/migration-lesson-mobile.png) |
