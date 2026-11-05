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

## Still unverified / blocked

- Real test Auth accounts and hosted sign-in/save/reload, upload/download and enrolment boundaries. Workspace network policy does not yet allow `lcddnpafrkbwsrhqexqe.supabase.co`; no Auth accounts exist yet. No production access was used to substitute for this check.
- Email confirmation/reset URLs and delivery on the new preview project. Existing production Auth settings have not been changed.
- Mistake review scheduling/RPC acceptance and flag workflow. Fixtures now include database enablement, but the synthetic course intentionally lacks the baseline Year 9/10 identification markers used to show flag UI. Full representative fixtures and authenticated acceptance checks are still required. No claim that these flows pass.
- Tutor UI acceptance and signed private Storage access. No production uploads were copied to preview.
- Cloudflare feature-branch build and actual preview URL are recorded separately after remote creation; no guessed URL is provided here.
- Existing production source/backend discrepancy: auto-enrol helper functions/triggers referenced by UI text are absent from the inspected database. Migration preserves observed behavior; that feature is not silently repaired.

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
