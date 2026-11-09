# Master Migration release approval package — prepared, blocked

This is one proposed action package, not authorization or a completed release. Current missing production facts prevent presenting it as executable. The owner completed the guided Auth URL/SMTP setup and approved one delivered recovery-email test. That approval does not authorize the remaining SQL, Cloudflare settings, merge or deployment actions below.

## Exact candidate and branch readiness

- Executable candidate: `08c999ca3841b53f68c92ab15972cff053829ed1` on `feat/mm-cloudflare-migration`, pushed and confirmed with git ls-remote. Contains revised SQL, exact after-permission contract/comparator and verification evidence. New production and preview build/scan reports are in finalized-candidate-builds.json. Later documentation-only evidence commits may follow it; verify unchanged executable inputs/protected contracts rather than confusing those with a new application build.
- Remote review branch was verified at `08c999ca3841b53f68c92ab15972cff053829ed1` after the authorized push; main remains `97ab688d9ef138429fd05d78678e2d1236be9957`. The prior screenshot head `8dd7288` is historical. No merge or production deployment was performed.
- Local `git merge-tree --write-tree CANDIDATE origin/main` passed, tree `89581439b05f74c97438ee57c3817e6c8ce3de08`. This is not a PR review/CI pass.
- Owner screenshots (9 November) for [PR #3](https://github.com/Dyrxal/tutoring/pull/3): Draft, one successful Cloudflare check at remote head `8dd7288`, no conflicts with base branch; merge disabled while draft. Required review approval is not established. Updated public PR/check readback confirms head08c999c remains Draft and its Cloudflare check succeeded (build714fb97c-cac6-4cc8-b8e2-4ba4bbbeb12d, displayed0s). This is not deployed production verification. Required-review approval is still not established. See candidate-finalization.json. `gh pr view` previously returned GraphQL Forbidden; no wider access was created.
- Approval must pin this source SHA. If later code/config/SQL changes are needed, produce and verify a replacement SHA. Documentation/report-only updates are outside the existing browser input digest; they do not authorize changing the executable candidate.

## Proposed production settings

Worker `notation-education-lms`, existing Git integration `Dyrxal/tutoring`, root `/`, production branch `main`. Owner has entered the five reviewed build variables below in Production scope and supplied matching screenshot evidence. Persistence is owner-reported; verify saved readback before release rather than reapplying them. Retain existing domain/DNS. Production build scope only:

| Variable | Exact proposed value |
|---|---|
| NEXT_PUBLIC_LMS_TARGET | production |
| NEXT_PUBLIC_SUPABASE_URL | https://lmuwsjjrqmmmtmxjvqln.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Existing production public client key, selected/entered privately; never service_role |
| NEXT_PUBLIC_DESIGN_PREVIEW | false |
| NODE_VERSION | 24.19.0 (tested) |

Repository pins pnpm `11.25.0`. Retain build `npm run build` and deploy `npx wrangler deploy` if current logs verify the committed pnpm lockfile/frozen install semantics; otherwise review the already proposed explicit frozen-install build command before approval. Keep all preview variables/commands unchanged. Never use Worker runtime bindings as a substitute for build-time values.

Production Auth owner screenshots now confirm Site URL `https://notationeducation.online/` and exactly two redirects, `https://notationeducation.online/` and `https://notationeducation.online/?auth=recovery`. Preserve these values; no preview callbacks.

Production custom SMTP is enabled with `smtp.resend.com:465`, username `resend`, sender `no-reply@auth.notationeducation.online`, display name `Notation Education`, and a masked saved credential. Resend domain is Verified. One approved recovery email to the owner-controlled test account was Delivered; production SMTP delivery passed. The recovery link opened sign-in without a password-change form, so the complete production recovery flow remains unresolved until the reviewed frontend is released and verified. The existing preview has the request UI and earlier successful recovery evidence; no repeat preview email is needed. Provider quota/key scope, effective hourly limit and confirmation-enabled setting remain final checks.

Both production template sources use `{{ .ConfirmationURL }}` with existing subjects `Confirm your email address` / `Reset your password`. Preserve them; no branding rewrite or template changes are needed.

## Proposed database and permission actions

Use only production project `lmuwsjjrqmmmtmxjvqln`; verify database `postgres` / system identifier `7678071634733212629` through the existing read-only capture. Never run seeds/bootstrap/imports or migration-history replay. Preserve preview `lcddnpafrkbwsrhqexqe`.

1. Resolve the owner's supplied email to exactly one existing tutor UUID; review and retain the exact current tutor UUID list, roles and original ACL snapshot. Dashboard evidence on 9 November now supplies owner UUID `5f568899-c69c-4838-b527-3dbe68f04e7d`, role tutor, and the sole-tutor filtered result. Expected tutor array is `["5f568899-c69c-4838-b527-3dbe68f04e7d"]`; no demotions are currently needed. Live script assertions and fresh ACL verification remain required. Prepare the three required `mm.owner_*`/`mm.expected_tutors` session inputs as specified in [owner preparation](../mm-launch-readiness.md). Do not guess or promote a missing owner account.
2. After approval, execute only [owner-content.forward.sql](owner-content.forward.sql). Retain the verified owner as the sole tutor, demote only reviewed non-owner tutors and revoke app-role curriculum TRUNCATE. Other tutors lose tutor-wide reads/management too; ordinary enrolments remain necessary.
3. Execute only [security-privileges.forward.sql](security-privileges.forward.sql), after the owner prerequisite. Removes the specific redundant PUBLIC/direct trigger-function grants, remaining app-role TRUNCATE grants, and the 32 reviewed unused TRIGGER/REFERENCES table grants across the eight named tables. Preserve ordinary DML, column grants, required helper calls and service access. Use revised-byte hashes in schema-grants-review.json, not historical security hashes.
4. Execute only [review-conflicts.forward.sql](review-conflicts.forward.sql), SHA-256 `2164ce7f88ddd913b75e0af3e1d0ce2fe7ae021a32b693838a62a3e5553cb3d7`. Changes four explicit logical conflicts from 40001 to PT409 in two review functions, not actual serialization errors.
5. Recapture metadata immediately. Compare only exact approved role/ACL/function changes; preserve unrelated metadata and content aggregates. The reviewed `production-after-contract.json` now describes the exact installed permissions/definitions. Existing preflight metadata defaults to it for production `--phase after`, while phase before retains the reviewed historical contract. It has been independently checked against the supplied production snapshot; no installed-state result is claimed before application.

Revised security SQL/runner hashes and combined evidence are in [schema-grant evidence](../mm-acceptance/schema-grants-review.json); the earlier [local evidence](../mm-acceptance/local-database-rehearsal.json) remains historical for old security bytes. Revised SQL/runner and exact expected contract are now committed in executable candidate `08c999ca3841b53f68c92ab15972cff053829ed1`. Historical e98847f evidence is not evidence of the revised package except where unchanged hashes are explicitly verified. Definition/ACL guards abort on drift; do not edit guards, silently repin or partially continue after errors.

## Merge and deployment proposal

The owner authorized committing/pushing the revised candidate and checking PR #3; this preparation is now complete for executable candidate08c999c. Further documentation-only evidence commits do not alter executable inputs or protected contracts. Once remaining facts, explicit risk decisions and release approval are recorded, confirm the reviewed PR head/source ancestry, checks/review requirements and current mergeability, and ready PR #3 if approved. Recheck main for drift. Do not push main directly or force-push.

Read back the owner-completed production build/Auth values at the agreed cutover window; preserve working official URLs/SMTP and set only separately approved discrepancies. Retain reviewed originals for rollback. Complete approved guarded DB actions and verify their installed state. Merge only after the required branch checks pass. Use a normal merge that preserves the exact candidate ancestry; record the resulting full main merge SHA and confirm no unreviewed source changes.

The existing main-branch integration may deploy on merge. Approve merge and that deployment together; observe the existing pipeline rather than additionally invoking deploy and causing duplicate releases. Check its actual production variables, locked install, artifact target, Worker version and traffic. Stop if anything selects preview or differs from approved source. No DNS/purchase action is included.

## Minimal proposed production smoke test — not executed

Dedicated new student email/sole email recipient proposed: `Drisyantshrestha+mm-launch-20261108@gmail.com`. Owner must confirm the alias reaches their inbox and does not identify an existing account. If it exists, stop and choose a fresh dedicated alias; do not reset/reuse it or any real student. Student Auth UUID is assigned by the approved signup and must be recorded from that response; do not substitute an unrelated ID. The owner's existing verified tutor login is used only for the approved fixture actions, never reset.

Proposed synthetic fixture UUIDs (check all are absent before writing):

| Fixture | Proposed UUID |
|---|---|
| course | `5c781615-c6d5-4d1e-a21a-f22807ed0b35` |
| module | `7594de05-af34-44dd-be86-e69254dad729` |
| lesson | `d8ccd17b-555c-4a08-a6bf-504c763cd5ba` |
| mc_question | `0b186ae5-7992-4c83-8f69-1bff73de750f` |
| short_question | `7fdd6443-eda6-47e5-abef-724a849d65fb` |

Bounded actions, limited to those fixture IDs and the dedicated student:

- One dedicated student signup/profile; at most **two emails total**: signup confirmation and one recovery request, both only to that alias. No retry/resend loop, invites, real-student email or owner password reset. Passwords and live callback/session tokens stay private and out of screenshots/logs.
- Create one synthetic course/module/lesson containing two explicitly synthetic questions (one MC and one short-answer); one enrolment for the dedicated student only; one review-settings row for that lesson using existing supported settings. No existing course/question editing or year-based enrolment. Confirm ordinary students cannot create/update/delete the synthetic curriculum.
- Upload one tiny synthetic PNG to `question-images/0b186ae5-7992-4c83-8f69-1bff73de750f/mm-launch-smoke.png` using the existing path convention (bucket name is not part of the object key). Capture its checksum locally. No other private files are opened.
- Sign in/reload as the dedicated student; confirm assigned fixture content and private image access, plus denial when signed out. Save/reload one MC and one short-answer response; at most three attempt rows total, including one review action against the synthetic MC if the supported UI permits it. Record exact generated attempt IDs. Observe saved progress/lesson access only for this fixture; at most one progress row and two review-schedule rows. Do not manually change due dates to fake an overnight result; report unavailable immediate review explicitly.
- Complete confirmation and recovery/update/sign-in/reload with the dedicated identity. Verify the production origin/backend and absence of preview hosts. Browser automation must not capture tokens or inspect unrelated student rows.

Cleanup proposal is part of the approval, not an automatic blanket delete: retain non-sensitive verification results, then remove the one captured object and only exact recorded test attempt/schedule/progress/settings/enrolment rows, questions, lesson, module and course. Respect FK order; abort rather than cascading through any unrelated data. Delete the dedicated Auth user/profile only after verifying its exact UUID/email and that no unexpected related data exists; never delete by email domain/prefix or wipe all new records. All post-test cleanup and baseline differences must be attributed to exact fixture/attempt IDs. If cleanup cannot be safely bounded, stop and report.

## Frontend rollback — exact procedure prepared, operator verification pending

Retained version `3862f733-48df-4d59-bf0e-d6abe51557a6` is observed active at 100% on `notation-education-lms`. Follow [the exact frontend rollback runbook](frontend-rollback.md). Wrangler 4.92.0's read-only lookup/status and interactive rollback command syntax were verified locally, including its explicit 100% traffic behavior. No production command was executed. Before final approval, an authorized operator must confirm the retained version can be fetched in the correct Cloudflare account and that the operator has Worker deployment authority. No authenticated Cloudflare tool/credential is available in this chat; do not create a broad connection or widen network access to bypass that gap.

At an approved stop condition, restore the exact retained artifact/allocation using the runbook; verify deployment status and official-site behavior afterward. Do not restore localhost callbacks or disable working SMTP merely to revert unrelated frontend code. Build/Auth setting inverses require impact review and specific approval. The old frontend lacks the new recovery UI; record that expected limitation. Rollback neither recovers data nor reverses SQL permissions automatically.

For separately approved DB rollback: capture current metadata and verify the prepared inverse guards first. Roll back review via [review-conflicts.rollback.sql](review-conflicts.rollback.sql), SHA-256 `454aa94ebbcaab6b5955f50e809a46cba2b7de36488ab3313816326b55bb48e1`. Undo security via [security-privileges.rollback.sql](security-privileges.rollback.sql) before [owner-content.rollback.sql](owner-content.rollback.sql), reusing the original verified owner/tutor snapshot. These permission rollbacks restore the earlier risky grants/tutor roles; they are not the default response to a UI problem. Recheck exact role/ACL/function deltas and content baselines afterward. No database restore or overwrite of student work is included.

Stop for wrong backend, unexpected content/resource differences, broken auth/access boundaries, failed saving, unexpected email recipient or SQL/ACL guard drift. Capture non-sensitive evidence and do not keep applying unrelated changes.

## Verification, limitations and decisions

Current candidate verification: 146 unit tests passed (including 35 preflight tests); earlier unchanged application TypeScript evidence retained. Guarded production and preview builds passed with matching commit provenance; production archive rescan matched its digest. Retained 46-check isolated SQL run matches the revised SQL/runner bytes; earlier 45-check evidence describes the old package only. Fresh focused behaviour evidence: 53 tests and seven local mocked Chromium checks; earlier hosted/email acceptance retained within its scope. Preview build restored. See [current build evidence](../mm-acceptance/finalized-candidate-builds.json) and [exact expected permissions validation](../mm-acceptance/expected-permissions-validation.json). Earlier final-release-preparation.json remains historical for e98847f.

The historical e98847f release preflight reported **14 passing, 0 failing, 11 blocked, 3 unverified** and exit 2; it is not a current launch-readiness result. This is intentional blocked readiness, not approval. Reports expire; refresh near actual cutover, without altering timestamps or broadening the freshness window.

Unresolved before a concrete execution approval:

1. Production metadata capture from 9 November passed 85 metadata checks and 3 two-function guard checks; see production-drift-check.json. Content/resource aggregate baseline remains to be captured before release and compared afterward. Do not repeat the completed drift check now or relabel its timestamp.
2. Owner UUID/sole-tutor screenshots, fresh ACL/definition snapshot, current Cloudflare settings and historical install log are recorded. Live apply guards remain required; the exact post-permission expected contract and strict comparisons are now prepared. The revised candidate is pushed and independently reviewed locally; the candidate Cloudflare check has passed and the PR is still Draft. Required-review approval remains unestablished.
3. Exact retained Worker ID/100% allocation and rollback command are recorded. Authenticated operator/version-availability check in frontend-rollback.md remains required; no rollback rehearsal is approved.
4. Production URL/SMTP/templates/delivery readback is recorded. Complete recovery after release, check confirmation setting/quota/credential scope/effective email limit, and finalize bounded smoke identity/writes/cleanup. The owner-controlled existing student account was approved only for the prior single recovery email; do not assume approval for unrelated writes.
5. Explicit test or deferral of physical iPhone/Safari, actual overnight rollover and real time-based expiry. Local emulation/synthetic timing is not those tests.
6. Required TRIGGER/REFERENCES dependency review is complete and scoped removals are prepared; revised bytes and exact expected contract are committed in the new executable candidate. Remaining definer exposure acceptance and leaked-password setting/plan availability still need resolution. No purchase included.
7. **Backup risk:** owner deferred backup/rehearsal; **no verified production database or private Storage backup exists**. Restricting tutor access and frontend/definition rollback cannot recover lost/corrupt/deleted student records or private files. This package proposes no backup purchase/export and does not mark recovery gates passed. Any final exception must explicitly acknowledge proceeding without that recovery capability; do not bypass the readiness tool silently.

No production approval is requested while these exact identifiers/settings/evidence are missing. Complete those facts, revise this same package and then obtain one approval covering the pinned candidate, specific settings/SQL/merge/deploy, named smoke recipient/writes/cleanup and explicit deferrals.
