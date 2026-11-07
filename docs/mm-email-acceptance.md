# Email signup, confirmation and password reset

## Latest follow-up — sender rate limit

A fresh Gmail alias was explicitly approved for confirmation investigation. The single preview signup request returned HTTP429 `over_email_send_rate_limit`, surfaced in the UI. No automatic resend or configuration change followed. Delivery/alias eligibility and the original confirmation-navigation issue remain unverified. Retry the same approved alias after the preview sender quota resets; no exact reset time was established. [Evidence](mm-acceptance/email-confirmation-retry.json).

## Latest live results — 7 November 2026

The user approved an inbox and updated only preview Auth URLs. Both emails delivered. Real signup/unconfirmed-login denial, account confirmation/profile, fresh sign-in/reload, recovery redirect/reload/update/signout, old-password denial/new-password success and consumed-link denial were verified on preview only. **First-use confirmation automatic navigation timed out and remains unresolved**, despite persisted confirmation and successful fresh login. See [current checklist](mm-preview-status.md#current-acceptance--live-preview-email-7-november-2026) and [redacted evidence](mm-acceptance/email-live.json).

Custom SMTP remains off; observed sender is Supabase Auth `<noreply@mail.app.supabase.io>`. Two sends total, only to the approved recipient. No broad OAuth connection or production access. Full Site URL is still truncated in the screenshot; effective explicit recovery redirect passes, but fallback is not established. A fresh explicitly approved signup inbox/alias is needed to reproduce first-use confirmation navigation; actual time expiry and mobile callbacks remain unverified.

The earlier implementation/prerequisite notes below describe the previous checkpoint and are superseded by these live results where applicable.

## Current implementation and evidence

Continued from `896e6ce`; the documented two-mode proposal is implemented in `e19d15f`. [Checklist](mm-preview-status.md#current-acceptance--password-recovery-6-november-2026), [machine-readable evidence](mm-acceptance/password-reset.json).

“Forgot password?” opens a request form with a generic acknowledgement, retry and rate-limit handling. A verified recovery session opens new-password/confirmation fields. Expired or invalid links offer another request. Password-policy errors come from Supabase; the existing six-character client minimum is retained. Existing sign-in and registration fields and metadata are unchanged.

Recovery intent is captured before SDK callback processing. A URL marker alone grants nothing: the component verifies the user with the backend and requires matching recovery callback/event evidence or an unexpired account/session-bound tab proof. Reload restores that proof without saving tokens in application evidence. Account changes clear passwords and invalidate pending UI work. Password updates use an isolated nonpersistent Supabase client pinned to the verified session, preventing a shared-session account switch from targeting another account. Successful updates return to sign-in; logout errors do not falsely claim a cancelled password was updated or repeat a successful password mutation.

Seven recovery unit tests and all 105 source tests pass. Build and TypeScript pass. All 13 browser scenarios pass on both local build and allowed hosted branch: request redirects/generic acknowledgement, rate/network retry, marker/expiry denial, verified recovery/reload/password validation/update, ordinary cached-session denial, mobile layout, existing signin/signup metadata, duplicate submission, account switch, forced mutation race, cancellation logout failure, successful-update logout failure and signup confirmation callback/reload. **All backend HTTP requests in these browser scenarios were mocked.** Real provider delivery, token validation and redirect configuration are not established by them.

## Requested redirect URLs

- Signup confirmation: `https://feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev/`
- Password recovery: `https://feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev/?auth=recovery`

These exact request arguments and mocked callbacks were checked. Actual preview Auth Site URL, redirect allowlist and fallback behavior remain unverified. Do not use the blocked version-specific URL or a production domain.

Read-only `GET /auth/v1/settings` on **preview lcddnpafrkbwsrhqexqe** returned HTTP200: email enabled, signup enabled and confirmation required. The public endpoint does not expose Site URL, allowlist, sender configuration, templates or delivery logs. Automatic approval review rejected adding a separate persistent Supabase OAuth connection because its account/project access could extend beyond this preview. No connection was created. Provide the preview settings directly, or explicitly approve the broader connection before management inspection. No SMTP credentials, templates, URL settings or DNS were changed.

## Remaining live acceptance — blocked before any sends

**No approved test address has been supplied; zero real email requests were sent in this task.** Historical fixture signup failures do not prove delivery. An approved inbox and access to its test messages are required before continuing:

1. Confirm the recipient explicitly approved by the user, preferably a new disposable alias for signup. Only that approved preview account may be used for recovery. Do not infer approval from an existing inbox connection.
2. Inspect preview Site URL and redirect allowlist for the exact URLs above. Confirm its configured sender and quota. Default Supabase SMTP is limited to organization-team addresses; otherwise an already configured test SMTP/mail sink is needed. Do not add team members or change DNS to bypass restrictions.
3. Submit signup on the allowed branch; verify unconfirmed password login is denied. Inspect the received link before following it: the verification endpoint must belong to the preview project and its destination must remain the branch preview. Stop if a production destination appears. Verify actual confirmation, expected student profile, reload and fresh-browser login. Enrolment is separate; captured year-based auto-enrolment remains absent.
4. Request recovery for that same approved account. Inspect and follow the actual link, verify the recovery screen after reload, set a test password, and verify old-password denial/new-password success after signout. Check expired/reused links and account-switch denial separately; do not claim mocked cases establish provider token behavior.
5. Record actual delivery, redirect URLs, provider errors and remaining limitations without storing passwords, tokens or message links. Keep unrun/blocked checks marked unverified.

The implementation required no schema or production data changes. Existing preview test accounts were not modified for this task. The branch workflow published only the authorized review preview; no production merge/deployment or DNS change occurred.

References: [SMTP restrictions](https://supabase.com/docs/guides/auth/auth-smtp), [password recovery](https://supabase.com/docs/guides/auth/passwords), [redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
