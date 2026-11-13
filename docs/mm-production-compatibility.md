# Existing backend compatibility — 7 November 2026

## Updated detailed comparison

See [the current checklist](mm-launch-readiness.md) and [evidence](mm-acceptance/launch-preparation.json). All 109 column definitions/defaults, 58 constraints, 34 policies, 3 triggers and public table grants match preview. All 25 signatures and owners match; 23 definitions match after line-ending normalization. Two review definitions differ only at the four expected conflict codes. Effective anon/authenticated EXECUTE matches; production additionally retains PUBLIC EXECUTE on four helpers, whereas preview omits PUBLIC. No privileges changed. Aggregate baselines and zero missing referenced Storage paths are recorded in [preservation evidence](mm-acceptance/content-preservation-baseline.json). These findings supersede corresponding unverified metadata/path items below; Auth, recovery readiness and production live acceptance remain unverified.

The exact proposed forward/rollback SQL was rehearsed successfully in a preview transaction and rolled back. The production database has not been written. Earlier baseline notes follow.

Owner explicitly authorized proceeding with the previously proposed read-only production inspection. Existing project `lmuwsjjrqmmmtmxjvqln` is ACTIVE_HEALTHY. No writes, real emails, deployment, merge, DNS changes, new connections, student-answer reads or private file downloads occurred.

## Observed preservation baseline

- 2 courses, 20 modules, 217 lessons, 4,138 questions.
- No orphan questions (every question has an existing parent lesson).
- All 15 public application tables have RLS enabled; 34 public/Storage policies exist. Policy counts and RLS enablement alone do not establish correct authorization.
- All three buckets are private: question-images, lesson-images, lesson-resources. Storage currently lists 13 objects, all in question-images. This inventory alone does not prove every referenced resource exists or decodes.
- 109 public columns inventoried; 25 public function signatures inventoried. Required application table/RPC names are present. Field-by-field compatibility and full permission/definition comparison are not yet certified.
- No question text, answer, student record or object content was returned. An aggregate question-row digest was calculated for a future preservation comparison; no source banks were imported.

## Confirmed backend difference

Production submit_mistake_review and note_mistake_review_help contain legacy 40001 conflicts and no PT409. The preview-only 20261106074516_mm_review_conflicts migration is not reflected in those bodies. This is a candidate narrowly scoped production fix, not permission to replay baseline/bootstrap/seed SQL. Before any write, compare full definitions/privileges, prepare rollback definitions and include the exact change in the reviewable launch package. Other functions also contain 40001; do not automatically replace genuine serialization errors.

## Remaining inspection and launch gates

- Compare exact column requirements, function definitions/privileges and policy conditions with the tested preview baseline; verify relevant trigger behavior. Presence/counts are preliminary compatibility evidence only.
- Check missing resource references and capture broader course/module/lesson content baselines without exposing private content.
- Production Auth Site URL, redirect allowlist, email sender and quotas are unverified. Existing tools do not expose these settings; no broader OAuth connection was created. Owner-provided production dashboard values remain a safe option.
- Verify backup/restore and Storage recovery coverage. No claim that a backup exists or has been tested.
- Keep the branch preview on its isolated backend. Prepare exact production build/route, Auth callback, old-host retirement and rollback steps before launch.
- Preview synthetic content must never be copied over these existing live records. Retaining this project preserves current records, but production rendering/editability still requires approved acceptance tests.

See [cutover plan](mm-existing-backend-cutover.md). No launch action was performed by this inspection.
