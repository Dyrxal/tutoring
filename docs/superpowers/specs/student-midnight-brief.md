Implement the three attached, approved Midnight Study mockups in my LMS.

Repository: Dyrxal/tutoring
Production: https://notationeducation.online
Hosting: Cloudflare Workers, connected to GitHub main

This is an implementation task. Use Superpowers for planning, debugging,
testing and verification, and Impeccable for visual fidelity. Complete
diagnosis, implementation, validation, commits and a GitHub pull request.
Do not stop after producing a plan.

The visual direction and scope below are approved. Do not restart the
design interview or ask me to repeat settled preferences.

APPROVED SCOPE

Implement the Midnight Study versions of these three student screens:

1. Courses
2. Progress
3. Account

The attached “Your learning” Dashboard image establishes the visual
language. Preserve the Dashboard’s existing functionality and design;
ensure the student’s theme preference works consistently across Dashboard,
Courses, Progress and Account.

Students alone get a theme choice. Tutors retain their current appearance.
Course-detail and Lesson screens retain their current appearance for this
phase. Preserve the selected preference when visiting those screens so
returning to an included screen restores the selected theme.

Light is the default when a student has no saved preference.

Both themes must expose the same information, actions and permissions.
Layouts may differ, but learning behavior must remain shared.

FIRST: ESTABLISH THE CORRECT SOURCE

There is a known mismatch between the deployed website and the checkout
previously available to this session. The live site showed a Midnight
Study selector and styling that were absent from the inspected GitHub
branches. A historical explanation-panel edit was never committed and its
working copy is unavailable.

Do not assume that missing edit can be recovered from current main.
Do not repeatedly claim source is missing based only on an old checkout.

Inspect current remote refs and relevant history. Trace the domain’s
active Cloudflare Worker/deployment and its source revision where access
allows. Distinguish Cloudflare build/version IDs from Git commit SHAs.
Check whether live assets, browser caching or another deployment explain
the mismatch.

Record the repository, branch, base commit and production-source
relationship before preparing a release.

If the deployed source cannot be established, identify the exact missing
prerequisite. Continue independent local work where useful, but do not
overwrite production with an unverified older application or claim that
a newly recreated design is recovered historical source.

Never request passwords or secret keys in chat.

PROTECT EXISTING WORK

Read applicable repository instructions and existing reliability reports.

Inspect git status before editing. This workspace may contain extensive
uncommitted reliability fixes, dead-code cleanup and refactoring.

Preserve those changes. Do not reset, overwrite, delete or automatically
bundle unrelated work into this feature.

Use an isolated feature branch/worktree based on the verified integration
base. State which existing fixes are prerequisites if the feature depends
on them. Stage only intentional changes and inspect the staged diff.

VISUAL IMPLEMENTATION

Treat the three attached mockups as the approved composition references.
Implement their structure and hierarchy, rather than applying a generic
dark recolour to the old pages.

Use the shared Midnight language:
- Near-black blue canvas and dark slate surfaces.
- Icy-blue headings and primary actions.
- Readable muted supporting text.
- Subtle borders, restrained rounding and precise spacing.
- A consistent sidebar with exactly one active navigation item.

Courses:
- Restrained, shallow textbook-photo banner.
- Two wide horizontal course panels on desktop.
- Course imagery, title, description, real progress and working Open
  course actions.
- Preserve each course’s own data and destination.
- Stack the panels sensibly on mobile.

Progress:
- Quiet typographic introduction; no photographic banner.
- Clear practice summary.
- Compact eight-week activity calendar, readable legend and selectable
  day details.
- Course completion shown separately from practice activity.
- Preserve existing counting, timezone and retry rules.
- Use real computed values and dates, not the mockup’s sample numbers.

Account:
- Identity and profile editing in the main column.
- Appearance preview and theme choice in a secondary column.
- Preserve name, year-level, avatar, Save profile and Sign out behavior.
- Dark, readable inputs and select controls.
- Stack in a useful order on mobile.

Use the banner selectively. Do not duplicate it on Progress or Account.
Do not add unrelated features, fabricated grades, streaks or activity.

Use real account/course data in production. Names, percentages and dates
in the mockups are examples, not constants to copy into the application.

Create or source appropriate banner/course assets. Do not ship the entire
mockup screenshot as a background or crop interface elements out of it.
Keep asset provenance and appropriate licensing. Optimize image loading.

ARCHITECTURE AND PREFERENCE SAVING

Reuse the application’s real routing/view structure. Do not invent new
URL routes merely because the workspace calls a view a “page.”

Share data loading, calculations, navigation actions and account logic.
Extract theme-specific presentation components where needed for the
approved layouts. Avoid duplicating business logic.

Use scoped theme variables and styles. Prevent Midnight styles from
leaking into Light, tutor screens, Course details, Lessons or dialogs
outside scope. Cover all controls and states within the included screens.

Inspect existing preference storage first. Preserve and migrate a valid
existing choice when possible instead of creating competing mechanisms.

If no suitable persistence exists, add a minimal profile preference with
an explicit allowed-value constraint and safe default. Prepare a
backward-compatible migration and the necessary narrowly scoped
permissions. Preserve ownership checks and existing column-level grants.
Do not broaden profile permissions or permit role changes.

Apply the choice when selected and confirm persistence through the real
save result. If saving fails:
- Return to the last confirmed theme.
- Show a clear, accessible error.
- Allow retry.
- Do not falsely claim the preference was saved.

A late load/save response from another account or an earlier selection
must not overwrite the current account’s preference. Clear account-scoped
state on sign-out/account changes. Avoid a conspicuous wrong-theme flash.

Handle missing migration, invalid preference, loading and offline states
gracefully without breaking the LMS.

VALIDATION

First establish and record a baseline. Do not assume historical passing
test counts describe the current branch.

Add meaningful regressions for changed behavior and run the appropriate
existing suite. Where these repository commands exist, run:

- pnpm test
- node scripts/check-chapter3.mjs
- pnpm run check:content
- pnpm exec tsc --noEmit --incremental false
- pnpm run lint
- pnpm run build
- Relevant SQL/policy checks
- Existing browser and performance checks

Do not delete assertions, disable lint rules or raise performance limits
to hide failures.

Run the actual application in a fresh local Workers preview. Check both
Light and Midnight at desktop and mobile sizes for:
- Courses, Progress and Account.
- Theme selection, reload and persistence.
- Failed-save feedback and retry.
- Account switching and sign-out.
- Course navigation and return to the chosen theme.
- Tutor appearance isolation.
- Course-detail/Lesson scope boundaries.
- Profile fields, avatars and Save profile.
- Heatmap day selection and correct progress data.
- Keyboard navigation, focus visibility, contrast and overflow.
- Loading, empty and error states.

Capture before/after screenshots. Compare Midnight against each approved
mockup and correct material differences in layout, hierarchy, spacing,
imagery and controls. Explain any necessary deviation.

Use synthetic data or a suitable staging environment for writes. Clearly
distinguish mocked browser checks, local SQL checks and real staging
validation. Do not alter real student records.

Request an independent review of functionality, permissions, account
isolation, scope and visual fidelity. Address confirmed material findings.

GITHUB AND RELEASE

Commit the completed, validated feature to a new feature branch and push
that branch. Open a PR into main with:
- What students see and can do.
- Before/after screenshots.
- Verification results.
- Migration requirements.
- Known limitations.
- Release and rollback instructions.

I authorize the feature-branch push and PR creation. Do not merge the PR,
push directly to main, deploy to production or apply a live database
migration without my explicit approval.

Inspect Cloudflare’s branch-build settings before pushing. Use an isolated
preview environment if available; avoid connecting preview writes to
production data.

Prepare the production release as a concrete final approval:
1. Identify the exact reviewed commit and deployment target.
2. Validate the migration in staging.
3. Document the compatible migration/application release order.
4. Provide a rollback that preserves student preferences and records.
5. Explain that merging main may automatically deploy via Cloudflare.

Do all authorized implementation and review work before asking for that
final release approval. If a genuine missing permission or prerequisite
blocks progress, name it precisely and complete unaffected work.

FINISH WITH

- The PR link, feature branch and commit.
- Screenshots of the three implemented screens.
- What was verified, what failed and what remains untested.
- Any source-provenance or access blocker.
- Exact remaining steps before the change becomes live.

Do not describe local changes or an open PR as already deployed.
