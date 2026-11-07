# Executable MM preflight

Run from the review repository root with Node 22.13+ and the committed dependencies. `pnpm test:preflight` exercises the tooling; `pnpm test` runs the entire suite. No new dependency, credential connection or paid service is required. The CLI never executes SQL or deploys. Only `build` invokes `pnpm build`; every other command is local file inspection/transformation.

Exit codes: **0** requested checks passed, **1** invalid input/failing check/drift, **2** blocked or unverified release readiness. A preparation report with exit 2 is expected; never append `|| true` to an actual launch gate.

## 1. Commit and inspect the actual build

Commit application/build/tooling inputs first; dirty or untracked inputs cannot be labelled as a clean candidate. Documentation/README are excluded from the browser-build input digest because this application does not import them; metadata-contract and SQL packages have separate checks. No arbitrary SHA is accepted: the manifest digest must match both a real Git commit's blobs and the current working inputs. The manifest is an integrity record, not a signed build/deployment attestation.

```sh
mkdir -p /workspace/work/mm-preflight
pnpm preflight build --target preview --out /workspace/work/mm-preflight/preview-assets.json
pnpm preflight assets --target preview --dir dist/client --out /workspace/work/mm-preflight/preview-rescan.json
```

`build` forces the requested target, disables Cloudflare binding fetch/metrics, runs the existing build, scans output, and records `dist/client/mm-build-manifest.json`. It does not select production credentials implicitly or disable the preview safety flag for you. Changing source/artifact bytes or using a nonexistent candidate invalidates provenance. Missing manifest remains unverified for release even if asset scanning alone returns 0.

Production build-only rehearsal requires explicit production environment settings (set privately through the existing environment, not chat): NEXT_PUBLIC_SUPABASE_URL for retained project, its publishable/anon key, NEXT_PUBLIC_DESIGN_PREVIEW=false, then:

```sh
pnpm preflight build --target production --out /workspace/work/mm-preflight/production-assets.json
```

This is not permission to deploy. Archive the production build outside the checkout if needed, then restore a preview build before other local/preview work. Do not deploy a dummy-key rehearsal. Public-key format/reference checks do not cryptographically prove an opaque publishable key is valid; retrieve it only through the correct project-scoped source. Actual Cloudflare configuration remains a separate gate.

Scanner hashes/scans every served file, including SVG/TXT/binary bytes, plus decoded gzip/brotli and common JavaScript escapes. It rejects unexpected/lookalike Supabase hosts, modern secret-key prefixes, non-anon/mismatched JWTs, environment files and symlinks without printing key values. It cannot prove absence of arbitrary obfuscated/encrypted secrets; do not intentionally put credentials into source/build outputs. Keep reports outside the browser asset directory.

## 2. Read-only, identity-bound captures

```sh
pnpm preflight sql --kind metadata --project-ref lmuwsjjrqmmmtmxjvqln > /workspace/work/mm-preflight/production-metadata.sql
pnpm preflight sql --kind baseline --project-ref lmuwsjjrqmmmtmxjvqln > /workspace/work/mm-preflight/production-baseline.sql
```

Execute these SQL files through the existing **matching project-scoped connection**, or the matching Supabase SQL editor. Both begin READ ONLY, assert the database's `pg_control_system` identifier against reviewed project-bindings.json, return metadata/aggregate hashes only, and end ROLLBACK. A production-labelled query run in preview fails before returning a snapshot. The two identities were initially observed through the existing scoped connections; no secret was collected. An upgrade/restore that changes identity requires explicit review/rebinding, never automatic learning. If identity access is unavailable, capture is blocked.

Do not substitute a bootstrap, seed, arbitrary export or SQL change package. Do not retrieve student answers/Auth hashes or download private objects. Metadata includes public function definitions, grants/policies and bucket configuration; content capture returns only aggregate counts/digests and missing-reference counts. Stored object metadata is hashed; object bytes are not read. Use the same approach with project lcddnpafrkbwsrhqexqe for preview.

Save the returned snapshot JSON object, or the SQL editor's single-row `[{"snapshot":{...}}]` JSON export, outside Git. Normalize and validate wrappers:

```sh
pnpm preflight snapshot --input /workspace/work/mm-preflight/raw.json --kind metadata --project-ref lmuwsjjrqmmmtmxjvqln --out /workspace/work/mm-preflight/production-metadata.json
```

Do not manually relabel project IDs or timestamps. Snapshots missing identity, fixture scope or required sections fail. The reviewed `metadata-contract.json` is a preview schema contract, not a production data dump. Permissions are compared exactly, with the previously reviewed PUBLIC EXECUTE difference restricted to four helper functions. Effective anon/authenticated permissions must still match.

```sh
pnpm preflight metadata --actual /workspace/work/mm-preflight/production-metadata.json --phase before --out /workspace/work/mm-preflight/metadata-result.json
pnpm preflight review --actual /workspace/work/mm-preflight/production-metadata.json --direction forward --out /workspace/work/mm-preflight/review-result.json
```

Before-change metadata allows only the four pinned legacy conflict codes in the two known functions. After an approved application of the change, recapture and use `--phase after` plus `review --direction rollback`: installed definitions must equal the tested versions, and rollback guards must match. `review` checks exact package SHA-256 pins and current captured definitions; it never runs forward/rollback SQL. Package edits abort rather than silently repinning. The report rechecks package integrity too.

## 3. Content/resource preservation

Capture two baselines with the generated query, before/after the approved operation. Both must be from the same bound project and exclusion scope, in chronological order. All four content entities and all three buckets (including empty ones) are required. Rows are hashed in stable-ID order; storage names/metadata are hashed. These digests detect changes; they are neither a backup nor proof of mathematical correctness.

```sh
pnpm preflight baseline --before /workspace/work/mm-preflight/before.json --after /workspace/work/mm-preflight/after.json --out /workspace/work/mm-preflight/baseline-result.json
```

Legitimate tutor edits are **not** ignored automatically. An approved change file must bind the exact group/entity, complete before/after aggregate objects and a reason, e.g. `{ "group":"content", "entity":"questions", "before":{"entity":"questions","rows":1,"digest":"..."}, "after":{...}, "reason":"Owner-approved edit, evidence reference" }` inside an array. Pass `--approvals /path/approved-changes.json`. A subsequent extra change is still rejected. The file records an approval; the tool cannot authenticate who wrote it.

For already-approved test fixtures only, `sql --kind baseline --project-ref ... --fixtures /path/fixtures.json` accepts explicit UUID arrays keyed by courses/modules/lessons/questions. All scope IDs are recorded, excluded counts/digests are returned separately, and both snapshots must use the identical validated scope. No wildcard, implicit cascade or unrecorded scope is accepted. Referenced-file integrity and Storage aggregates are never silently excluded; approve exact Storage aggregate changes separately. Do not exclude real learning content merely to obtain a pass.

Missing referenced images/private resource paths fail. External links and actual image/PDF decoding are separate acceptance checks; this query never fetches them. The current preparation's unchanged baseline comparison is a short read-only observation, not a completed cutover or absence of future edits.

## 4. One fail-closed report

All paths are inputs produced above. Use the full candidate SHA written by the build manifest (not a fabricated or abbreviated label):

```sh
pnpm preflight report --reports /workspace/work/mm-preflight/production-assets.json,/workspace/work/mm-preflight/metadata-result.json,/workspace/work/mm-preflight/baseline-result.json,/workspace/work/mm-preflight/review-result.json --gates docs/mm-launch/gates.json --candidate FULL_CANDIDATE_SHA --out /workspace/work/mm-preflight/full-readiness.json
```

The console gives counts and nonpassing checks; `--out` preserves every check. Reports from different projects, incomplete function/owner/ACL evidence, contradictory readiness flags, altered contract/package, mismatched candidate/provenance or stale source observations fail. Default freshness is 3,600 seconds; `--max-age-seconds` changes the explicit window, never the observation time. Recapture close to launch. Preview artifacts cannot pass as an official production release.

Before-change metadata and forward preconditions are preparation only: the final report stays blocked until the installed state is verified. Auth, sender, database/Storage backups, actual restore rehearsal, production settings, full rollback selection, owner launch approval and device/time verification/explicit deferral must have real evidence in gates.json. Missing/unknown settings stay blocked/unverified. Do not replace blocked values with “passing” to make CI green. A report is not authorization; no command performs the launch.

## Backup and rollback handoff

Use [manual-backup-plan.md](manual-backup-plan.md) for the explicitly gated export/restore procedure and validation checklist. Aggregate captures do not retrieve or back up student/Auth data, do not copy private files, and cannot establish recovery readiness. Retain frontend rollback candidate prefix 3862f733, obtain its full ID before an approved rollback, and prefer frontend rollback over overwriting new student work. Exact forward/rollback SQL remains separately approved and guarded; no blanket schema or seed execution.
