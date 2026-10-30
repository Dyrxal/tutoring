# Cloudflare design preview

Set `NEXT_PUBLIC_DESIGN_PREVIEW=true` at **build time**, only for non-production
builds. This disables Supabase client creation and uses the existing sample-data
mode. No authentication, migration, or real account is required. Open Account and
choose Midnight Study; preview appearance choices are temporary and reset on reload.
Sample courses differ from the synthetic screenshot fixtures. Profile saves do not
persist in this mode.

Keep production on `main`. The preview command is `npx wrangler preview`, supported
by the pinned Wrangler 4.92.0. Do not use the production deploy command for previews.

The local preview-flag build completed, the focused test files passed, and none of
the nine emitted client JavaScript files contained the production Supabase URL.
These checks do not establish Cloudflare deployment or real Supabase validation.
See VERIFICATION.md for the original feature evidence and unresolved baseline checks.

The GitHub app transfer recreates commits with new metadata because local Git
authentication/network access is unavailable. The transferred implementation and
documentation trees are checked against the original local tree hashes. This
preview-mode addition is a separate commit after those unchanged trees.
