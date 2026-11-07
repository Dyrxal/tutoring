# MM Cloudflare migration design

Implements the user's already agreed MM workflow: one existing GitHub repository, Cloudflare preview/production, existing Supabase production retained; preserve published functionality and all content; design enhancements deferred. User explicitly chose a separate Free Supabase preview project over a synthetic-only demo and authorized proceeding with branch/preview preparation. Production cutover still requires later approval.

## Approach
The inspected Sites source at 116e72b356169832f15c18529d77d0072361ab57 is the baseline. Import its tracked tree into a feature branch based on GitHub main, retain original source/provenance, and adapt the Vinext/Vite build for standalone Cloudflare. Do not merge the functionally older PR #2 or the unfinished local Midnight port.

Options already discussed: keep Sites plus a separate Cloudflare demo (source divergence persists); paid Supabase branching (Pro/usage fees); existing Cloudflare pipeline with a separate Free test project (user selected). Production Supabase remains unchanged. Preview project created: lcddnpafrkbwsrhqexqe, Notation LMS Preview, Tokyo. Quoted project cost 0/month. No paid branch created.

## Boundaries
- GitHub branch feat/mm-cloudflare-migration, isolated worktree /workspace/tutoring-migration.
- Worker remains notation-education-lms; only feature-branch preview deployments during this stage.
- Preview builds must require explicit preview Supabase URL/key and reject production project lmuwsjjrqmmmtmxjvqln. Keep existing NEXT_PUBLIC_DESIGN_PREVIEW=true build command compatible as a preview-mode signal.
- Production builds use explicit production target/configuration; no hard-coded backend key/URL fallback in app code. Reject secret/service-role client keys.
- Copy actual application schema/functions/policies into the new empty test project, preserving the observed absence of auto-enrolment helpers. Seed synthetic courses/accounts/data only, no production records or private image copies.
- Existing application features/styles and theme options remain. Preview status indicator helps users identify test data; no Midnight redesign.
- Keep authentication Supabase email/password. Test accounts are synthetic and confined to preview; exact secure account-provisioning path will be verified against available APIs/schema rather than guessed.
- No production migrations, DNS/access changes, main merge or production deployment.

## Verification
Pure configuration tests cover missing config, preview/production mixups and dangerous client keys. Compare application files to the verified baseline except the backend bootstrap/status indicator. Build and typecheck both targets without deploying production; run original tests and distinguish the three known baseline failures from regressions. Validate preview schema and synthetic workflows. Verify branch deployment status and inspect rendered desktop/mobile pages where available. Production Auth/email/Storage acceptance remains separate until isolated end-to-end checks pass.

## Implementation calls
Standalone Cloudflare uses the existing pinned Vinext/Cloudflare tooling, not a framework rewrite. Source setup SQL is not treated as evidence of applied database state. Generated archives/build caches are excluded from the canonical repository. Existing Sites identity is preserved in archived metadata; its build adapter is not used by the new Cloudflare config.
