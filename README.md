# Notation Education LMS — Cloudflare export

This is a Cloudflare Workers build of the existing LMS. It continues to use the existing Supabase project for authentication, courses, lessons, attempts and progress. It does not copy or migrate Supabase data.

## Deploy from GitHub

1. Upload the contents of this folder to the root of your GitHub repository (for example, `Dyrxal/tutoring`). Keep `package.json`, `pnpm-lock.yaml`, `vite.config.ts` and `wrangler.jsonc` at the repository root.
2. In Cloudflare, open **Workers & Pages → Create application → Import a repository**, then select that repository.
3. Set the Worker name to `notation-education-lms` (it must match `wrangler.jsonc`). Use Node.js 22 or newer and pnpm 11.25.0.
4. Use `pnpm install --frozen-lockfile` as the install command, `pnpm run build` as the build command and `pnpm run deploy` as the deploy command.
5. Deploy first to the generated `workers.dev` address and test student sign-in, tutor access, lessons, saved attempts and private resources before connecting the custom domain.

The existing Supabase URL and publishable key are already referenced by the LMS. They are public client settings; do not add a Supabase service-role key to Cloudflare or GitHub. Supabase remains the system of record.

## Supabase redirect settings

After the Worker is deployed, add its `workers.dev` URL and the final custom-domain URL to **Supabase → Authentication → URL Configuration → Redirect URLs**. Set the production **Site URL** to the custom-domain URL when ready. Keep the existing project and database unchanged.

## Local build

Requires Node.js 22.13+ and pnpm 11.25.0. Run `pnpm install --frozen-lockfile`, then `pnpm run build`. Use `pnpm run start` for a local Wrangler preview. Wrangler uses the generated Cloudflare build output for preview/deploy.

## Notes

- The export removes the Sites-only build and mock-auth integration. LMS accounts continue to use Supabase authentication.
- No database migration is included or needed for hosting. All existing LMS data remains in Supabase.
- Cloudflare DNS and custom-domain routing are separate from this source export. Connect the domain only after the `workers.dev` deployment is working.
