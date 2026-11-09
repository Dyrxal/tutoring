# Master Migration frontend rollback procedure

Prepared 9 November 2026. No rollback executed or production authentication added. Local installed Wrangler `4.92.0` help and implementation were checked; authenticated Cloudflare version availability and operator access remain unverified.

## Exact target and prerequisites

Worker: `notation-education-lms`. Retained production version: `3862f733-48df-4d59-bf0e-d6abe51557a6`, observed receiving 100% traffic. Restore that allocation, not an inferred Git commit or a newly rebuilt artifact. This version predates the migration recovery UI; rolling back restores that older behavior too.

Use the reviewed repository and its installed, pinned Wrangler in an already authorized Cloudflare operator terminal. Do not create a broad token, paste tokens into commands/chat, install a second deployment tool, or expand this cloud environment's network policy. If no authenticated operator terminal is available, this prerequisite is blocked. The selected build token label in the dashboard does not establish interactive CLI credentials.

Before release, run only these read-only commands in that terminal:

```sh
pnpm exec wrangler whoami
pnpm exec wrangler versions view 3862f733-48df-4d59-bf0e-d6abe51557a6 --name notation-education-lms
pnpm exec wrangler deployments status --name notation-education-lms
```

Verify the operator/account matches the dashboard account containing this Worker; confirm the full target version exists and current allocation matches the reviewed state. Retain non-secret version/traffic/account verification. Do not paste full command output if it contains bindings, account identifiers or credentials. A read-only version lookup does not prove edit permission; require the intended operator's Worker deployment authority before final approval. Do not perform a production rehearsal now.

Record original build settings (currently no build variables; `npm run build`, `npx wrangler deploy`, root `/`) and any subsequent specifically approved changes. Prevent another release/build from replacing the restored artifact during incident handling; coordinate stopping pending release jobs. Settings changes are separately approved actions, not an automatic part of this command.

## Execute only at an approved release stop condition

Stop the affected rollout for wrong backend/project, broken access boundaries, failed saving/recovery, unexpected content/resource changes, or a failed SQL guard. Capture non-sensitive symptoms and current version/traffic. Reconfirm Worker, operator/account, retained target and approved scope, then:

```sh
pnpm exec wrangler rollback 3862f733-48df-4d59-bf0e-d6abe51557a6 --name notation-education-lms --message "Master Migration release rollback"
```

This is a production mutation. Do not run during preparation. Keep interactive confirmation enabled; confirm only when Wrangler identifies this exact version at 100%. Abort on changed-secret prompts, missing target/version, permission errors, wrong Worker/account, or unexpected resource requirements. Do not force a changed-secret rollback, select a different version, or rebuild old source as an unreviewed substitute. Wrangler creates a new deployment pointing to the retained version; it does not restore database/Storage rows, Auth settings, build settings, or bound resources. The old version must remain retained; do not delete it during launch.

## Verify and stop

Run `pnpm exec wrangler deployments status --name notation-education-lms` again. Require the exact target at 100%. Check the official site and approved test identity for sign-in, content loading and saving; record any known old-version limitation such as absent password-recovery UI. If the old frontend cannot operate with the approved database state, stop and assess the separately approved guarded SQL inverses; do not restore data or blindly reverse security fixes.

Preserve the official production Site URL, redirects and working SMTP unless a particular setting is demonstrated faulty and its inverse is separately approved. Do not reinstate localhost callbacks merely because they were historically present. Reverting production build variables to empty also makes a future migration build unsafe; block further releases until its build target is reviewed again.

DB inverse order where specifically approved: review-function rollback, security privilege rollback, then owner-content rollback. These are definition/permission inverses, not database recovery. No verified production database or private Storage backup exists.
