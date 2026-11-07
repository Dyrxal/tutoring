# Manual recovery preparation — no export performed

Scope: retain production Supabase; create a recovery option before approved production changes. Free dashboard screenshot shows no scheduled project backups. This document is preparation only. The owner has now requested starting the protected database/private-file backup. [Start precheck](../mm-acceptance/protected-backup-start.json) is blocked before export because source credentials/network, owner-controlled destination and decryption/retrieval setup are not configured. Do not ask again for blanket backup permission; collect those missing setup details privately. Full exports contain authentication and student data. A restore target/scope remains separately unapproved.

## Current official guidance

Supabase's [Backup and Restore using the CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) describes separate role, schema and data dumps using the project connection string and database credentials. Confirm installed CLI command/flags with --help before execution. Do not assume a generic raw pg_dump or the schema-only snapshot is a sufficient restorable project backup. The published procedure also calls out migration history and auth/storage custom changes, and transfers Storage objects separately.

No password reset is proposed to obtain credentials: a database-password reset could disrupt existing connections. No credential should be pasted in chat/Git or supplied to a new broad OAuth connection. Use a project-scoped approved mechanism or owner-controlled workstation with the existing project credentials entered privately.

## Proposed handling, to finalize before exporting

- Choose an owner-controlled encrypted destination outside the repository, public artifacts and preview database; name who can retrieve/decrypt it. Confirm retention and available local disk capacity. Do not publish production dump contents, auth hashes/tokens, student records or private files.
- Use a supported Supabase CLI/Postgres toolchain on that workstation or another explicitly approved secure executor. Docker may be required by the CLI; inspect its actual version/help and official guide. Hosted environment currently has no database credentials or approved TCP destination grants; do not bypass proxy/network policy.
- Capture roles, public/application schema/functions/RLS/triggers, required Auth data and migration history as appropriate to the actual supported recovery procedure. Capture custom auth/storage trigger/policy changes separately where the CLI excludes managed-schema definitions. Verify inclusion through counts/manifests, without displaying rows or credentials.
- Copy the three private buckets' actual objects separately, preserving bucket configuration, names/paths, MIME types and a checksum manifest. Current aggregate observation is 13 question-image objects; refresh inventory because live use can change it. Database storage metadata alone is not object backup.
- Capture non-secret configuration needed for reconstruction (URL allowlists, provider modes, exact deploy/build versions); keep any necessary credentials in a separate approved vault. A data dump does not recreate SMTP/provider keys or website deployment settings.
- Produce encrypted files plus byte counts, SHA-256 manifest, timestamp and retrieval instructions. A dump file's existence or digest alone does not prove it restores.

## Restore rehearsal requirements

Use an isolated approved target with outbound email and application jobs disabled. Never restore production dumps into the existing synthetic preview, a public endpoint or production as a test. Do not create a paid/new cloud project without approval.

Restore using the official ordered procedure, including role/schema/data and required auth/storage customizations. Test trigger suppression/restoration as documented so replay does not create duplicate profiles/review schedules. Restore actual object bytes separately. Validate counts, foreign keys, policies, function definitions and file checksums against the captured manifest. Use isolated controlled test identity/fixtures for functional checks; do not sign in as real students or send mail. Destroy sensitive rehearsal material only under the agreed retention/cleanup scope.

Record success/failure and omissions. If a supported managed restore is unavailable on the plan, do not claim an isolated database rehearsal proves a fully reconstructed managed Supabase project; document the exact recovery path and its constraints. Owner may instead approve a paid managed-backup option, but this task has not done so.

## Before launch

Recapture a consistent baseline immediately before cutover; plan for legitimate concurrent writes and no unapproved global write freeze. Retain old frontend version 3862f733 (full ID still needed before executing rollback). Prefer frontend rollback for application failures; don't restore an old database over newly saved student work. Backup readiness remains blocked until the chosen export/recovery path is authorized, executed and checked. No data export, private-file download, backup restore, purchase or production mutation has occurred in this preparation.

## Staged operator procedure — execute only after separate sensitive-data handling approval

Version pin checked on 7 November: **Supabase CLI 2.122.1**. Its `db dump --help` and schema/data `--dry-run` scripts were inspected using a dummy loopback URL; no live dump ran. CLI **3.0.0 no longer accepts `--db-url`**, so do not use an unversioned latest install with this procedure. The repeated `-x` arguments below were confirmed to generate both exclusions in 2.122.1. `--use-copy` produces COPY data with trigger suppression/reset statements. These dry runs establish command construction, not recovery completeness.

These commands are preparation, not a backup taken by this task. On the approved private workstation/executor, confirm `supabase --version`, `supabase db dump --help`, `psql --version` and Docker requirements against the official guide first. Use tools compatible with the production Postgres major version. Keep the connection string/password in privately entered environment variables or a supported credential file, not shell history, chat, screenshots, Git, public build variables or shared logs. Do not reset the live database password merely to obtain access.

After the destination, retention, encryption and scope are approved, a POSIX-shell procedure follows the official CLI's role/schema/data separation:

```sh
umask 077
mkdir -p "$MM_BACKUP_DIR"
npm exec --yes --package=supabase@2.122.1 -- supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/roles.sql" --role-only
npm exec --yes --package=supabase@2.122.1 -- supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/schema.sql"
npm exec --yes --package=supabase@2.122.1 -- supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/data.sql" --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

`MM_DATABASE_URL` must be the privately supplied retained-project connection string, and MM_BACKUP_DIR the approved protected destination. Recheck exclusion flags against the installed CLI. Keep only validated non-sensitive manifests in the review branch. The SQL dump may contain authentication hashes/student records: do not display its contents to the assistant or publish it. Encrypt it with the owner's chosen tool/vault and verify successful decryption locally. A failed command means no complete backup; do not continue launch.

Separately preserve migration history and custom Auth/Storage schema changes when needed by the official procedure. Review this project's captured create_profile trigger and Storage policies for inclusion; do not assume a default filtered dump preserves every managed-schema customization. Save original deploy/Auth configuration separately without putting credentials into the dump manifest.

Read-only source version/extension metadata is recorded in the inventory: production Postgres **17.6**, pg_stat_statements 1.11, pgcrypto 1.3, plpgsql 1.0, supabase_vault 0.3.1 and uuid-ossp 1.1. The local exercise uses Postgres 17, but does not establish a managed target with these service/extension versions. Vault being installed does not prove it contains application secrets; no Vault values/keys were inspected. Any actually used encrypted material needs a separately scoped recovery plan.

The inspected default schema script **excludes `auth`, `storage` and `supabase_migrations`**. The [managed recovery inventory](managed-recovery-inventory.json) records the known **nine custom Storage policies and one Auth profile-creation trigger**, plus dependencies, from the reviewed non-sensitive metadata contract. A plain successful schema dump is therefore insufficient. Refresh these definitions at export time and restore the customizations separately into the explicitly approved compatible managed target; never replace its managed schemas with the synthetic stubs used by local tests. Exact target compatibility and restore SQL remain blocked until a target/handling scope is approved.

If migration-history preservation is needed, the official procedure adds two separately protected files (same CLI pin/approved source URL):

```sh
npm exec --yes --package=supabase@2.122.1 -- supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/history_schema.sql" --schema supabase_migrations
npm exec --yes --package=supabase@2.122.1 -- supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/history_data.sql" --use-copy --data-only --schema supabase_migrations
```

These additional exports were not run against production. Review the `auth,storage` diff/customization process from the official guide on the approved executor; do not introduce a broad CLI connection or blindly apply a managed-schema diff. The inventory is a checklist of required objects, not executable restore SQL or an independently verified production backup.

Use an owner-approved Storage download/export method to copy actual object bytes with private access. Preserve bucket configuration, full paths, MIME types and byte checksums. An S3 tool/API connection must be scoped and approved; no new connection or service-role key is created by this plan. A database dump's storage.objects rows are not copies of the files. Refresh the object inventory rather than assume the historical 13-object count.

Restore rehearsal must use an isolated, explicitly approved target with outbound emails/jobs disabled, not production or the existing synthetic preview. Check destination identity before any restore. Follow the official ordered role/schema/data restore, enable stop-on-error, use a transaction where supported and suppress replay triggers only as documented, restoring normal operation afterward. Check Postgres/Auth/Storage version compatibility; a vanilla local Postgres restore is not automatically equivalent to a fully recovered managed Supabase project.

### Restore-validation checklist

- [ ] Encrypted backup decrypts; role/schema/data files and separate Storage bytes have matching manifests/checksums.
- [ ] Approved isolated destination identity checked; outbound email/jobs disabled; no live or synthetic-preview overwrite.
- [ ] Restore exits successfully with no suppressed errors; required managed schema/custom changes and migration history accounted for.
- [ ] Aggregate Auth account/profile counts compared locally without exposing rows/hashes; application relationships/FKs preserved.
- [ ] New identity-bound baseline capture and comparison establishes courses/modules/lessons/questions/order/lesson configuration preservation; no automatic aggregate approvals.
- [ ] RLS, effective grants, function definitions, constraints and triggers match the recorded contract; planned review-function state identified explicitly.
- [ ] All bucket/object paths and byte checksums restored; controlled test account can decode representative images/PDF; anonymous/unenrolled access denied.
- [ ] Controlled test account login/save/reload tested without impersonating real users or sending real messages.
- [ ] Recovery limitations, duration, retention, decryption access and operator ownership recorded; a second operator can locate the materials.
- [ ] Rehearsal target cleaned up only under approved retention/cleanup scope; no production data left publicly reachable.

The preflight baseline checks aggregate content/resources only. They cannot verify Auth passwords, dump completeness, object bytes or recovery execution; database_backup/storage_backup/restore_rehearsal gates must remain blocked until those separate checks actually pass.

## What was rehearsed independently

`pnpm test:database-local --out /absolute/new/report.json` runs the committed synthetic test in two disposable local containers with no network or published ports. See [local evidence](../mm-acceptance/local-database-rehearsal.json). It tests the exact forward/rollback scripts, permission boundaries, role/schema/data restoration, trigger-replay failure/rollback and a separately copied synthetic Storage-byte checksum manifest. Real production data, private files and secrets are never inputs. Hosted preview is not overwritten.

This test uses raw `pg_dump` on minimal local Auth/Storage **stubs**; it is deliberately separate from the Supabase CLI's managed-project filtering. It demonstrates recovery mechanics and catches package regressions. It cannot clear the real database, separate Storage protection or managed restore-rehearsal gates. Source and target containers/volumes and synthetic byte files are removed after the run.
