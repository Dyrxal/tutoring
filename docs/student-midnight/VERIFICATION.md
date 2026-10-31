# Student Midnight verification receipt

Reviewed 29 October 2026 in the isolated `/workspace/tutoring-midnight` checkout. Branch: `feat/student-midnight-screens`. Base: `97ab688d9ef138429fd05d78678e2d1236be9957` from public `Dyrxal/tutoring/main`.

**Reviewed implementation commit: `f78b7f677f2c5afc552b27de0a9d1eec5b90787d`.** A subsequent documentation-only commit adds this receipt and the review artifacts. Nothing in this receipt establishes a production deployment, a GitHub push or a created PR.

## Verified locally

| Check | Result and limits |
| --- | --- |
| `pnpm install --frozen-lockfile` | Passed with the feature lockfile. Verification tools are pinned development dependencies; application dependency versions are unchanged. Drizzle also resolves PGlite as an optional peer. No PGlite code appears in the generated application chunks. |
| `pnpm run test:theme` | **32 passed, 0 failed**: 18 preference-hook, 4 presentation/parity and 10 shared activity tests. Hook tests use a deterministic hook harness; presentation tests use static React rendering. |
| `pnpm run check:theme-sql` | Passed actual PostgreSQL execution in disposable in-memory PGlite. Applies the migration twice; checks allowed values, self/student-only RPCs, anonymous/tutor rejection, account isolation, preserved profile grants and empty search paths. This is not Supabase staging validation. |
| `node scripts/check-chapter3.mjs` | **210 questions** passed answer-validation, TeX and multi-page checks. |
| `pnpm run build` | Passed again after the V1 correction. Existing large-chunk and upstream source-map warnings remain. |
| New feature-file ESLint check | Passed without disabling rules. Repository-wide lint remains failing as recorded below. |
| Local Workers preview | Started successfully with the generated production configuration and unchanged compatibility date, using an explicit newer local workerd override. The normal locked-runtime start still fails; details below. |
| Synthetic browser checks | **40 passed, 0 execution failures** at desktop 1513×1040 and mobile 390×844. All network calls outside loopback were intercepted or aborted. No real student/account data was written. |
| Delayed-profile regression | RED reproduced an empty editor after delayed profile arrival; GREEN passed at both viewport sizes after the profile-key correction (**2 additional checks**). |
| Midnight accessibility scans | **8 scanned Midnight states, zero axe WCAG A/AA findings**: Courses, Progress, Account and Dashboard at both sizes. This does not certify every state, assistive technology or browser. |
| Screenshots | Fourteen synthetic captures: six Light comparison states and eight Midnight states. The final Dashboard captures include the corrected V1 dark surface. |

The browser scenarios exercise theme selection and reload; confirmed preference/name/year/avatar persistence through fixture responses; failed-save rollback with visible feedback and retry; keyboard focus; heatmap day selection with 12 synthetic responses; Course/Lesson style boundaries and return; loading failures for missing migration and offline conditions; sign-out; tutor isolation; overflow; and uncaught errors/unknown fixture requests. Preference account-switch, race and stale-response behavior is additionally tested in the deterministic hook harness. These are mocked integrations with the actual local application, not real Supabase authentication or cross-device validation.

## Checks that still fail

| Check | Fresh baseline | Feature result |
| --- | --- | --- |
| Complete Node suite, `pnpm test` | 78 tests: 74 passed, 4 failed | **100 tests: 96 passed, the same 4 failed** |
| TypeScript, `pnpm exec tsc --noEmit --incremental false` | Missing `@/hooks/use-mobile` in `components/ui/sidebar.tsx` | Same missing-module error |
| `pnpm run lint` | 44 errors, 64 warnings | Same 44 errors, 64 warnings |
| Normal `pnpm start --port 8790` | Locked workerd supports 2026-05-22; configured date is 2026-10-15 | Same runtime incompatibility; no normal-workflow repair claimed |

The four Node failures require these missing public download mirrors:

- `public/setup/20261013_mistake_review_1a.sql`
- `public/setup/20261012_next_tasks.sql`
- `public/setup/20261013_question_flags_all_lessons.sql`
- `public/setup/20261013_mistake_review_all_lessons.sql`

Their meaningful assertions were preserved. Earlier uncommitted reliability fixes remain in the separate original checkout; they were not silently bundled into this feature. Existing dependency advisories, approximately 1.5 MiB page chunk, normal startup failure and Light accessibility findings are not described as resolved. Light scans retain contrast findings; Light Progress also retains unnamed progress bars. Shared course-card progress bars now have accessible names.

`check:content` and a pre-existing performance-check script are absent from this clean base. No warning threshold or performance limit was increased. A fresh production dependency audit is outside this bounded UI branch and is not claimed here.

### Local preview qualification

Browser checks used the same Wrangler CLI and generated production configuration, with `MINIFLARE_WORKERD_PATH` pointing to local workerd `1.20261019.1`, because the locked workerd cannot honor the configured production date. Temporary `/tmp` config/log locations accommodated sandbox filesystem permissions. Production compatibility date and deployment configuration were unchanged. The successful override is evidence about this local application build, not a repaired standard developer workflow or tested deployment.

## Independent review and corrections

- [Whole-feature code review](reviews/final-code-review.md): both P2 findings closed. Delayed profile arrival now remounts the shared editor with loaded values; Midnight Progress preserves exact completed/total lesson counts alongside rounded percentages. RED→GREEN evidence was inspected.
- [Preference/security review](reviews/preferences-review.md): both P2 findings closed. Session transport errors remain retryable with feedback; in-flight writes serialize by actor across client replacements. Reviewer independently reran all 18 preference tests.
- [Visual review](reviews/visual-review.md): the three approved compositions and responsive stacking were accepted. **V1 resolved:** the Dashboard completed-task empty state now receives the scoped dark surface. An independent reviewer visually rechecked both final captures and confirmed the layout/message are preserved. Missing individual week-date labels on the otherwise labelled/selectable Progress calendar are a nonblocking observation, not a new requirement silently claimed complete.

**Final V1 receipt:** the new palette assertion first failed against the old build (RED), then passed on the rebuilt application at both sizes. Final browser run: **40/40**; delayed-profile run: **2/2**; all **8 Midnight axe scans** have zero findings. Final screenshots and the independent scoped visual re-review confirm the white panel is corrected. See [browser evidence](evidence/browser-final.json), [RED result](evidence/dashboard-palette-red.log), [build log](evidence/build-final.log) and [visual re-review](reviews/visual-review.md).

## Unresolved release prerequisites

1. The exact active `notationeducation.online` domain → Worker → version → Git revision relationship remains unknown. The theme is a recreation from approved references on the stated GitHub base, not recovered historic/live source. Fresh production requests receive execution-proxy CONNECT403; this is not an application HTTP response.
2. Existing `GH_TOKEN` authentication is invalid and no authenticated GitHub connector is available. No feature push or PR has been performed.
3. Current Cloudflare non-production branch-build commands/settings are unavailable. Feature pushes must wait until they cannot deploy the production Worker or connect preview writes to production records. User screenshots establish a linked repository and main production branch, not current safe feature-branch behavior.
4. Real staging migration/auth/profile-grant validation has not occurred. Local PGlite and mocked browser checks do not establish live Supabase behavior.
5. Baseline release-blocking test/type/lint/startup issues and separate reliability/security work need explicit reconciliation before production approval.

No merge, production push/deploy, live migration, production write or real student-record alteration was performed. Restore repository/hosting access through secure environment connections, never secrets pasted into chat. See [release and rollback sequence](README.md#release-sequence--requires-separate-approval).

## Evidence location

Full command logs, node-level axe reports, RED/GREEN artifacts and browser JSON remain in ignored `outputs/midnight/`. Selected command logs and machine-readable results are also committed in [evidence](evidence/). The committed review copies above, screenshots and this receipt make the result reviewable outside that execution directory. Final capture links are maintained in the PR draft and main implementation notes.
