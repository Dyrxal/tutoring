## Email signup, confirmation and password reset

No real email was sent in this run. No approved test address has been supplied. The previous example.com fixture attempts are historical failed requests, not email-delivery proof.

Observed without sending email: `GET /auth/v1/settings` returned 200 with email provider enabled, `disable_signup:false`, `mailer_autoconfirm:false` (confirmation required). Phone and anonymous-user sign-in are disabled. The public settings endpoint does not expose Site URL, redirect allowlist, SMTP credentials/provider, templates or delivery logs; these were not inferred from the public flags.

Needed before delivery acceptance:

1. An explicitly approved test inbox, plus access to its confirmation/recovery messages. Use a new disposable alias for signup and only that same approved account for reset; do not alter existing production accounts.
2. Inspect **preview project lcddnpafrkbwsrhqexqe** Auth URL settings. Site URL must point to the allowed branch preview and any explicitly used confirmation/recovery callback must be in that preview project's redirect allowlist. Current signup does not provide `emailRedirectTo`, so the configured Site URL controls its default destination. Do not use the production domain.
3. Confirm the preview project's sender: Supabase's default SMTP delivers only to organization-team addresses and is rate-limited; otherwise use an already configured test SMTP/mail sink with an approved recipient. Current sender/configuration and remaining quota are unverified. No SMTP credentials or DNS records were changed. Do not add a team member merely to bypass the restriction.
4. In a fresh browser, submit signup, check that unconfirmed password login is denied, open the received confirmation link, verify that it returns to branch preview, signs in, creates the expected student profile, and survives reload. Check link expiry/reuse and a second fresh-browser password login. Explicit enrolment is separate from email confirmation; year-based auto-enrolment is absent from this captured backend.
5. The captured app has **no “Forgot password” action, recovery form or PASSWORD_RECOVERY handler**. An end-to-end reset through this UI currently fails the feature-availability check. Recovery needs a request action (`resetPasswordForEmail` with preview-only `redirectTo`), a recovery-session/new-password screen using `updateUser({password})`, and expiry/error handling before UI reset acceptance can run. This was identified, not silently implemented as part of the PDF fix.
6. With the approved inbox and recovery UI in place: request one reset, follow its link, set a test password, sign out, confirm old password fails/new password succeeds, test used/expired links, and confirm all requests/redirects stay on preview. Record delivery and actual outcomes separately from API response codes.

References: [Supabase custom SMTP restrictions](https://supabase.com/docs/guides/auth/auth-smtp), [password-based auth and recovery](https://supabase.com/docs/guides/auth/passwords), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
