# MM independent recovery and permission checks implementation plan

**Goal:** Test the prepared database/rollback and recovery assumptions without production data or owner input.
**Architecture:** A disposable local Postgres container with synthetic Auth/Storage stubs and the committed preview bootstrap/seed. Exercise the exact guarded forward/rollback SQL and RLS, then dump/restore into a separate disposable local target. Preserve non-sensitive results; never accept a hosted database URL.
**Tech Stack:** Node standard library, Docker local socket, pinned official Postgres image, existing repository SQL.
**Spec:** Owner request to complete mission-critical independent migration work; existing-backend cutover and manual-backup plan.

## Global constraints

No production writes/private exports/file downloads, email, merge/deploy/DNS, purchases or broader connections. Synthetic local results do not establish real Supabase recovery, production backups, physical-device behavior or owner acceptance. Existing preview content and enrolment rules remain unchanged. Inline execution without questions is explicitly authorized.

## Review focus

Wrong database/container target; drifted SQL definitions; role escalation/cross-account actions; trigger replay creating duplicate profiles; a successful dump masking missing Storage bytes or failed restore.

- [x] Check local capabilities and current official backup guidance/CLI flags; record exact limitations.
- [x] Add a local-only database exercise with explicit synthetic identity and no network/ports. First run should expose unsupported assumptions; fix the harness only against observed errors.
- [x] Exercise exact forward/rollback definitions, data/ACL preservation and guard failure on drift. Check representative anonymous/student/tutor restrictions and role/enrolment escalation denial.
- [x] Perform local synthetic dump/restore and validate content/config/constraints/policies/functions plus separately handled synthetic Storage bytes. Keep all real recovery gates blocked.
- [x] Inspect exposed definer functions and create a concrete security finding/action record from local evidence; change app/backend behavior only for a proven release blocker and with a failing regression first.
- [x] Verify any changed scripts, update current checklist/evidence and exact operator instructions; commit/push review branch. Reuse successful application/build evidence if no application/build changes occur.

Result: 144 unit checks and TypeScript passed; 37 local integration checks passed. Actual production/preview builds and fresh identity-bound metadata/aggregate comparisons passed at f21dabf2e021a0dcef439bc1329bb51ebc043081. See docs/mm-acceptance/independent-verification.json. Final report retains 9 blocked and 4 unverified gates; sensitive/production work remains prohibited.
