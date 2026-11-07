# Manual recovery preparation — no export performed

Scope: retain production Supabase; create a recovery option before approved production changes. Free dashboard screenshot shows no scheduled project backups. This document is preparation only. Existing production authorization is metadata/aggregate inspection; full database exports contain authentication and student data and require explicitly approved handling, destination and restore scope before execution.

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

These commands are preparation, not a backup taken by this task. On the approved private workstation/executor, confirm `supabase --version`, `supabase db dump --help`, `psql --version` and Docker requirements against the official guide first. Use tools compatible with the production Postgres major version. Keep the connection string/password in privately entered environment variables or a supported credential file, not shell history, chat, screenshots, Git, public build variables or shared logs. Do not reset the live database password merely to obtain access.

After the destination, retention, encryption and scope are approved, a POSIX-shell procedure follows the official CLI's role/schema/data separation:

```sh
umask 077
mkdir -p "$MM_BACKUP_DIR"
supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/roles.sql" --role-only
supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/schema.sql"
supabase db dump --db-url "$MM_DATABASE_URL" -f "$MM_BACKUP_DIR/data.sql" --use-copy --data-only -x "storage.buckets_vectors" -x "storage.vector_indexes"
```

`MM_DATABASE_URL` must be the privately supplied retained-project connection string, and MM_BACKUP_DIR the approved protected destination. Recheck exclusion flags against the installed CLI. Keep only validated non-sensitive manifests in the review branch. The SQL dump may contain authentication hashes/student records: do not display its contents to the assistant or publish it. Encrypt it with the owner's chosen tool/vault and verify successful decryption locally. A failed command means no complete backup; do not continue launch.

Separately preserve migration history and custom Auth/Storage schema changes when needed by the official procedure. Review this project's captured create_profile trigger and Storage policies for inclusion; do not assume a default filtered dump preserves every managed-schema customization. Save original deploy/Auth configuration separately without putting credentials into the dump manifest.

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
