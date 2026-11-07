# Notation Education LMS

This migration branch preserves the published Sites version-120 application and prepares it for the existing GitHub → Cloudflare workflow. Design changes are deferred. Do not merge or deploy to production until the migration acceptance checks and owner approval are complete.

## Preview

`pnpm install --frozen-lockfile`, then `pnpm dev` starts a local preview. `pnpm build` creates the Cloudflare build. The existing Cloudflare preview-branch build command also works.

The preview uses the separate **Notation LMS Preview** Supabase project (`lcddnpafrkbwsrhqexqe`). Its public URL and publishable key are in `config/preview-public.json`; these are browser-visible connection details, never administrative credentials. Optional environment overrides are listed in `.env.example`. Passwords and session tokens must stay outside Git.

Preview data is synthetic. Nothing in the build seeds a database or writes to the live project. A missing or invalid backend configuration fails the build. A preview cannot select the established production project, even if production environment variables are present. `NEXT_PUBLIC_DESIGN_PREVIEW=true` is retained only as a guard for the existing Cloudflare build command; it does not activate sample-data mode.

`pnpm start` serves a built Worker locally. `pnpm preview:deploy` uses Wrangler's branch-preview command; it requires Cloudflare credentials. The Cloudflare GitHub integration can publish branch previews instead. Do not use `pnpm deploy` for a feature preview.

## Future production release

Production requires **explicit** `NEXT_PUBLIC_LMS_TARGET=production`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` build settings. The URL must identify the original production Supabase project. Remove the design-preview flag. No production build settings, DNS, Sites identity, accounts or production data were changed for this branch.

Do not run the historic `supabase/schema.sql` or other setup files on production. `supabase/preview/bootstrap.sql` is a guarded snapshot of the observed application schema for the new empty test project only; it is not a production migration. The `.openai/hosting.json` identity is retained as provenance and is not used by the Cloudflare build.

## Verification

- `pnpm test:config`: backend isolation and key validation.
- `pnpm exec tsc --noEmit --incremental false`: TypeScript check.
- `pnpm test`: existing application checks plus configuration tests. All 108 current source tests pass at the prepared application baseline; see `docs/mm-preview-status.md` for exact limits and pending acceptance checks.

Source provenance: Sites commit `116e72b356169832f15c18529d77d0072361ab57`, imported on top of GitHub main `97ab688d9ef138429fd05d78678e2d1236be9957`. PR #2 was not merged or used as the migration baseline. Private backups and uploaded learning content remain outside this repository.
