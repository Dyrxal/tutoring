# Student Midnight Study — implementation and release notes

This is a **new recreation from the approved mockups** on public GitHub main `97ab688d9ef138429fd05d78678e2d1236be9957`, branch `feat/student-midnight-screens`. It is not recovered historical source and is not deployed. The separate `/workspace/tutoring` checkout contains earlier uncommitted reliability/refactoring work; none of that work was copied into this feature branch.

## Implemented

- Student-only Classic light / Midnight Study selector in Account. Effective default is Light. Tutors have no selector or Midnight styling.
- Midnight Courses uses the shallow book banner, wide course panels, actual enrolled course data and real completion percentages. Progress uses the existing activity builder, compact calendar/day details and exact course completion counts. Account composes the existing profile editor, identity, appearance preview and sign-out controls.
- Scope is Dashboard, Courses, Progress and Account. Course-detail/Lesson views use their existing appearance; returning restores the selected preference. Dashboard keeps this checkout's existing layout with a compatible Midnight palette. The live screenshot's different Dashboard composition cannot be claimed to be preserved from source that is absent here.
- Shared course navigation, profile saves and practice calculations remain authoritative. Existing practice history on Account remains below the redesigned settings, even though the mockup did not show that lower content.
- Profile-backed preference RPCs confirm saves. Optimistic failures restore the last confirmed theme and show retry feedback. Loading, invalid values, missing migration, network failures, actor/client changes, sign-out, legacy migration and late responses are handled.
- Cached October 27 live evidence used per-user localStorage `notation-theme:<id>` values light/midnight/light-version. A valid value is migrated only when the server profile is uninitialized; light-version maps to Light. Server values win. Preview-only choices remain memory-only. No write to browser preference is presented as server persistence.
- Additive nullable `profiles.student_theme` with allowed values, self/student-only read/save RPCs and empty SQL search paths. No new direct profile UPDATE grants, role grants or permissive RLS policy. Existing grants remain intact.

## Visual system and necessary differences

Approved mockup references: generated image IDs f2f22303 (Courses), c8151b18 (Progress), cba9a547 (Account), retained in this documentation as [Courses](references/courses.png), [Progress](references/progress.png) and [Account](references/account.png). These reference images are documentation only; none is shipped as an application background.

Token palette: canvas #0e151b, sidebar #131d25, panels #142029/#1b2934, borders #344651, body #e2edf2, supporting text #afc1cb, icy headings/actions #d3edf5. Styles are scoped below `.student-midnight`; the light Account selector is its own new component. Desktop sidebar 232px; mobile menu below 800px; course panels stack and Account columns collapse without clipping controls.

The notebook is a standalone generated photograph, optimized to approximately 90 KiB WebP. It is decorative, never instructional maths. Provenance and exact prompt: `public/images/midnight/PROVENANCE.md`. No interface screenshot or cropped mockup ships as an asset.

All names, descriptions, dates and statistics come from real application props. Screenshot data is synthetic. The existing activity builder's summary is four weeks, while its calendar is eight weeks; labels preserve that meaning rather than copying the example mockup's eight-week summary claim. Exact completed/total lesson counts remain available alongside rounded percentages. Retained weekly totals and counting help are placed within/below the day-detail area.

## Reproduction

```sh
pnpm install --frozen-lockfile
pnpm run test:theme
pnpm run check:theme-sql
node scripts/check-chapter3.mjs
pnpm test
pnpm exec tsc --noEmit --incremental false
pnpm run lint
pnpm run build
pnpm start --port 8790
# With a local preview running and an installed Playwright Chromium:
MIDNIGHT_ROUND=final pnpm run check:theme-browser
# Container alternative, only where sandboxed Chromium needs it:
BROWSER_PATH=/usr/bin/chromium BROWSER_NO_SANDBOX=1 MIDNIGHT_ROUND=final pnpm run check:theme-browser
# Delayed-profile regression:
BROWSER_PATH=/usr/bin/chromium BROWSER_NO_SANDBOX=1 MIDNIGHT_DELAY_PROFILE=1 MIDNIGHT_ROUND=delayed-profile-green pnpm run check:theme-browser
```

The three pinned dev-only dependencies added are Playwright 1.58.2, axe-core 4.11.0 and PGlite 0.3.14. Application dependency versions are unchanged. pnpm also resolves the new test-only PGlite package as Drizzle’s optional peer; no PGlite code is imported into or found in the generated application chunks. Scripts reject non-loopback browser target URLs and intercept/abort all external browser requests. SQL checks use disposable in-memory PostgreSQL roles and rows. They do not validate real Supabase auth, deployed grants, real storage or staging. Do not point manual preview sign-in or writes at production; configure staging Supabase public settings at build time for authenticated staging validation.

## Baseline failures and prerequisites

Fresh clean GitHub baseline: 78 Node tests, 74 pass, 4 fail because downloadable SQL mirrors are absent; TypeScript fails on missing `@/hooks/use-mobile`; lint has 44 errors/64 warnings. These failures also remain after the feature. The feature does not remove assertions, disable rules or incorporate unrelated historical cleanup.

Production builds pass but retain the baseline large-page-chunk warning (approximately 1.5 MiB) and upstream source-map warnings. No performance limit was raised. This feature is not the earlier performance/security repair branch. The separately prepared reliability/security fixes must be reconciled before production release; merging this older baseline as a replacement for newer deployed code is unsafe.

Normal `pnpm start` fails because the locked local workerd supports only 2026-05-22 while the unchanged production compatibility date is 2026-10-15. For local browser validation only, the same generated production configuration and same Wrangler CLI were started with `MINIFLARE_WORKERD_PATH` pointing to the separately installed workerd 1.20261019.1. `/tmp` configuration/log locations avoid sandbox telemetry writes. This is an explicitly temporary verification override, not a claim the normal runtime workflow is repaired.

## Production/source and GitHub blockers

Fresh remote refs confirmed main at 97ab688 and audit/heatmap-date-refresh-20261020 at ae3c7b3. Neither explains the screenshot's live theme. Retained live HTML/JS from October 27 confirms the selector and localStorage behavior, but fresh HTTPS access receives execution proxy CONNECT403. The active domain → Worker → version → Git source relationship remains unverified.

Cloudflare screenshots show linked Dyrxal/tutoring, production main and builds enabled. They do not establish current non-production branch deployment behavior. No Cloudflare API/tool credentials are available here, so a feature-branch push must wait until its build command is confirmed not to deploy the production Worker or use production data for preview writes.

`gh auth status` reports the existing GitHub token invalid. No authenticated GitHub connector is available. No branch was pushed and no PR was created with that token. Restore authenticated repository access through the environment's secure connection/settings, never by pasting secrets into chat. A local commit and PR draft can still be reviewed.

## Release sequence — requires separate approval

1. Establish the exact active production source and reconcile it with this branch. Integrate prerequisites explicitly; do not replace newer live code with this older GitHub base.
2. Confirm feature-branch builds cannot deploy the production Worker; isolate preview/staging Supabase settings. Restore GitHub auth, push the feature branch and open the prepared PR without merging.
3. Apply `supabase/migrations/20261029_student_theme.sql` to a suitable staging database; verify student/tutor/anonymous behavior, existing preferences and profile grants with synthetic accounts, then rerun authenticated browser checks against staging. Local PGlite is not a substitute for this step.
4. Resolve baseline release-blocking checks and obtain approval for the concrete reviewed commit, staging evidence, migration and production target.
5. Apply the additive migration before enabling the application release in production. Existing clients continue to work; a new client with a missing migration falls back to Light with feedback.
6. Merge the approved PR only when ready for Cloudflare's automatic main build/deployment. Verify its exact built commit, domain mapping and real student theme load/save in an authorized test account.

Rollback: restore the verified previous application deployment/revert the feature commit through the normal release process. Keep the additive preference column and narrowly scoped RPCs so student choices are retained. Do not drop columns, reset profiles, alter attempts/progress or delete student records to roll back the UI. If migration fails, stop the application release; rerun only after diagnosis. No live step above was executed by this task.

## Evidence

Baseline/final logs, snapshots, browser results, RED→GREEN regressions and review reports are retained in ignored `outputs/midnight/`. Screenshot links below use only synthetic student/course data. Exact final results are recorded in the final verification receipt and PR draft alongside any unresolved checks.

## Implemented screenshots and final receipt

| View | Midnight desktop | Midnight mobile | Light desktop comparison | Light mobile comparison |
| --- | --- | --- | --- | --- |
| Courses | [Desktop](screenshots/1513-midnight-courses.png) | [Mobile](screenshots/390-midnight-courses.png) | [Desktop](screenshots/1513-light-courses.png) | [Mobile](screenshots/390-light-courses.png) |
| Progress | [Desktop](screenshots/1513-midnight-progress.png) | [Mobile](screenshots/390-midnight-progress.png) | [Desktop](screenshots/1513-light-progress.png) | [Mobile](screenshots/390-light-progress.png) |
| Account | [Desktop](screenshots/1513-midnight-account.png) | [Mobile](screenshots/390-midnight-account.png) | [Desktop](screenshots/1513-light-account.png) | [Mobile](screenshots/390-light-account.png) |

Dashboard palette: [desktop](screenshots/1513-midnight-dashboard.png), [mobile](screenshots/390-midnight-dashboard.png). All captures are from the actual local application using synthetic data. Light captures are comparison states of the same build, not historical production screenshots.

See [verification receipt](VERIFICATION.md), [prepared PR description](PR_DRAFT.md) and [source/access investigation](PROVENANCE.md). The receipt distinguishes passing local feature checks from unchanged baseline failures and untested staging behavior.

Reviewed implementation commit: `f78b7f677f2c5afc552b27de0a9d1eec5b90787d`. The following documentation commit packages the evidence; use the complete feature branch when reviewing.
