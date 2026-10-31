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

Account keeps the approved identity, profile and appearance layout. Practice activity
and progress metrics are shown in Progress rather than duplicated in Account, in
both themes. Historical screenshots and verification notes predate this refinement.

Progress now follows the supplied practice-activity reference: approximately 57 px
square cells and 5 px gaps at a 1156 px panel width, green density buckets, a
right-aligned period label, visible eight-week summary, right-hand day details,
and weekly totals/counting help below the calendar. The extra summary strip was
removed. The calendar shrinks to square cells and stacks day details on mobile.
The eight-week summary now counts the displayed calendar window; separate
four-week calculation fields are retained for compatibility. Local static React
renders were inspected at 1272 px and 390 px, with no horizontal overflow. This
is not a claim of hosted Cloudflare verification.
