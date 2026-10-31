# Student Midnight Study for Courses, Progress and Account

**Draft status:** local review material; no GitHub PR exists yet. Target repository `Dyrxal/tutoring`, base `main`, feature branch `feat/student-midnight-screens`. Base commit `97ab688d9ef138429fd05d78678e2d1236be9957`. **Reviewed implementation commit: `f78b7f677f2c5afc552b27de0a9d1eec5b90787d`.** The feature branch also contains the documentation/evidence commit.

Students can choose Classic light or Midnight Study in Account. Midnight gives Courses the approved shallow notebook banner and horizontal course panels, Progress a compact activity calendar with day details and separate completion rows, and Account a profile/appearance composition. The choice also supplies a consistent palette on the existing Dashboard; tutors, Course details and Lessons retain their current appearance.

Course data, navigation, profile saves and practice calculations remain shared. A narrowly scoped profile preference is confirmed by authenticated self/student-only RPCs. Failed saves return to the last confirmed theme with accessible retry feedback; stale account/load/save responses are guarded. A recognized legacy per-user browser choice migrates only when the server preference is uninitialized. Light is the effective default.

## Screenshots and design decisions

| View | Midnight desktop | Midnight mobile | Light desktop comparison | Light mobile comparison |
| --- | --- | --- | --- | --- |
| Courses | [Desktop](screenshots/1513-midnight-courses.png) | [Mobile](screenshots/390-midnight-courses.png) | [Desktop](screenshots/1513-light-courses.png) | [Mobile](screenshots/390-light-courses.png) |
| Progress | [Desktop](screenshots/1513-midnight-progress.png) | [Mobile](screenshots/390-midnight-progress.png) | [Desktop](screenshots/1513-light-progress.png) | [Mobile](screenshots/390-light-progress.png) |
| Account | [Desktop](screenshots/1513-midnight-account.png) | [Mobile](screenshots/390-midnight-account.png) | [Desktop](screenshots/1513-light-account.png) | [Mobile](screenshots/390-light-account.png) |

Dashboard palette: [desktop](screenshots/1513-midnight-dashboard.png), [mobile](screenshots/390-midnight-dashboard.png). All captures are from the actual local application using synthetic data. Light captures are comparison states of the same build, not historical production screenshots.

The notebook is a new generated decorative photograph, optimized to approximately 90 KiB WebP; [asset provenance](../../public/images/midnight/PROVENANCE.md) records its prompt. No UI screenshot is shipped as a background. The activity calendar remains eight weeks; the existing summary calculation remains four weeks and is labelled truthfully. Exact completed/total lesson counts remain visible. Account retains practice history below settings for information parity. Dashboard retains this checkout's existing composition; the screenshot's different live Dashboard source has not been located.

## Validation

- Focused tests: **32/32 passed**; local PostgreSQL migration/policy checks passed; chapter3 validated **210 questions**.
- Full existing Node suite: **96/100 passed**; the same four baseline missing-SQL-download tests fail. TypeScript still reports the baseline missing mobile hook. Lint remains the baseline **44 errors/64 warnings**. No assertions or rules were removed or weakened.
- Production build passed with existing large-chunk/source-map warnings. Standard locked-runtime preview remains incompatible with the configured date; synthetic tests used an explicitly newer local workerd with the same generated configuration and unchanged production date.
- Synthetic desktop/mobile browser run: **40 checks passed**; delayed-profile regression: **2 additional checks passed**. All **8 Midnight axe scans** had zero WCAG A/AA findings. Light retains baseline findings. All external browser requests were intercepted/aborted.
- Independent functionality/permission and preference reviews closed their P2 findings. Visual review accepted the three compositions, and independently confirmed the V1 Dashboard empty-state palette correction at both sizes. Its browser regression failed before the fix and passed afterward.

See [full verification receipt](VERIFICATION.md) for exact commands, qualifications and remaining failures. These checks do not establish real Supabase or staging behavior.

## Migration and release order

`supabase/migrations/20261029_student_theme.sql` is additive/idempotent: nullable constrained theme column, authenticated self/student-only read/save RPCs, safe empty search paths. It does not broaden direct profile column privileges, permit role changes or replace existing RLS policies.

Before release:

1. Reconcile the active production source/revision with this recreated feature and the separately prepared reliability fixes. Do not replace newer live code with this older base.
2. Confirm Cloudflare feature-branch build safety and isolated preview settings. Restore secure GitHub authentication, then push this feature branch and create this PR without merging.
3. Validate the migration in suitable Supabase staging with synthetic student/tutor accounts; verify existing grants, preferences, auth, saves and browser behavior there. No live migration was performed.
4. Resolve baseline release checks and obtain explicit approval for the exact reviewed commit, staging evidence and production Worker target.
5. Apply the compatible additive database migration **before** the approved application release. If migration fails, stop and diagnose. A client encountering a missing migration falls back to Light with feedback.
6. Merge only after production release approval: Cloudflare may automatically build/deploy `main`. Verify the built Git commit, Worker/version/domain mapping and authorized test-account theme load/save.

Rollback restores the verified previous application deployment or reverts the application feature through the normal review process. Keep the additive column and narrow RPCs so student theme preferences and learning records remain intact. Do not drop/reset student profiles, attempts or progress.

## Blockers and limitations

- Active production source cannot be traced with present access; fresh production requests are blocked by the execution proxy with CONNECT403.
- GitHub token is invalid; feature branch is not pushed and no PR link is available.
- Cloudflare feature-branch deployment behavior is unknown, so the authorized push is gated on the user's explicit branch-build inspection requirement.
- Supabase staging and real-account/cross-device validation remain untested.
- Baseline SQL downloads, mobile hook, lint, normal preview startup, dependency/security work, large bundle and Light accessibility findings remain separate unresolved prerequisites.

Nothing has been merged, deployed or migrated against production. [Implementation/release notes](README.md) and the [verification receipt](VERIFICATION.md) distinguish completed local feature work from failed, blocked and untested checks.
