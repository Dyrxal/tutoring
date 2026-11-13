# Approved www routing cutover — configuration completed and verified

Completed 13 November 2026 (Australia/Sydney). Owner approved this exact routing/Auth proposal with “yes please” after the scope, saved rollback and possible brief interruption were explained. Owner dashboard screenshots now show both apex/www Production Worker bindings and all four exact expected root/recovery callbacks, preserving the original apex Site URL. Final public GETs for both website addresses at09:50:02 UTC return HTTP200 on www with the deployed new page, Forgot password and original n logo. The approved routing/Auth configuration scope is complete; do not repeat the changes. Actual login, confirmation/recovery emails and saved-progress flows remain untested. See production-www-routing-public-verification.json. No additional SQL, test account/data or email action performed, and no full-launch claim.

## Reviewed state before the switch

- Zone: notationeducation.online. Existing apex Worker binding: notationeducation.online → notation-education-lms.
- Export and screenshot confirm www.notationeducation.online CNAME → custom-domains.chatgpt.site, Proxied, TTL Auto (export1). This is the old website hosting destination. Export remains at the owner's attachment; its hash and exact www settings are recorded in www-domain-routing-observation.json.
- Public apex redirects301 to https://www.notationeducation.online/; www still serves the old UI and does not have the new deployed page asset.
- Reviewed main merge f6e42e9e8d7d9486dfca93577ad9e7b9641b0228 successfully deployed Worker version afeaaf7c-312b-4dd4-a6af-04666a9e62a0. Owner confirms the direct production Worker has Forgot password. Actual backend on the public official site still needs verification after routing is corrected.
- Production Supabase lmuwsjjrqmmmtmxjvqln uses official apex Site URL and two exact apex root/recovery callbacks. The app requests callbacks from the browser's actual origin. Therefore serving www also requires its two exact callback URLs.

## Exact approved scope

1. Retain the existing apex Worker custom domain, all email DNS records, production database/Storage contents, existing SMTP and preview settings.
2. Remove only the existing www CNAME with the exact reviewed old target. Then attach www.notationeducation.online as a **Custom Domain** to existing production Worker notation-education-lms. Cloudflare creates/manages the replacement DNS record and certificate. Do not manually point a CNAME at workers.dev, add a wildcard, change nameservers, delete the apex binding or buy a service.
3. In production Supabase Auth URL Configuration, add only these exact allowlist entries, preserving Site URL and both existing apex callbacks:
   - https://www.notationeducation.online/
   - https://www.notationeducation.online/?auth=recovery
4. Approval includes restoring only these additions/replacement if verification fails. It does not authorize SQL/data changes, test emails/accounts, another deployment or unrelated redirects.

Cloudflare's official Custom Domains documentation states an existing CNAME prevents attaching that hostname, and recommends Custom Domains when the Worker is the application's origin. Adding an overlay route would retain the obsolete external origin; use the native origin binding here. Both www and apex can be bound to the same Worker. Keep current canonical redirect behavior during this scoped switch; inspect it separately only if it prevents verification.

## Owner-guided execution

**Completed:** initial Add domain attempt was rejected for the expected old CNAME conflict. After the approved removal/retry instructions, owner supplied a screenshot with both notationeducation.online and www.notationeducation.online attached as Production. Public verification at2026-11-13T09:46:40Z confirms normal www root HTTP200 with Forgot password and original n, deployed page-Fx9z6qmR.js, and 7/7 initial JS/CSS assets HTTP200. Checked public JS references only the production project and contains no literal secret/service-role key. One first root request still returned old HTML; a subsequent normal-root request returned the new app. See production-www-routing-public-verification.json. DNS replacement and both exact www Auth callback additions are complete; do not repeat them. No authenticated application smoke or full launch claimed.

**Auth settings completed:** final owner screenshot shows Total URLs:4 and exactly the original apex root/recovery entries plus both approved www root/recovery entries. Site URL remains https://notationeducation.online/. This verifies the configuration shown by the dashboard, not an actual email/token roundtrip. No additional settings are required within this approved scope.

The preparation and replacement procedure below is retained as the execution record; it has already been completed.

Before deletion, open the existing Worker's Domains screen in another tab, verify production Worker name and current www record match this proposal, and keep the exported old record available. Use the existing authenticated dashboard; no token/password needs to be shared. If any target or existing binding differs, stop and report instead of adapting silently.

Delete only the reviewed www CNAME in DNS Records. Immediately use Workers & Pages → notation-education-lms → Domains → Add Domain to attach www.notationeducation.online. Confirm only that exact hostname. A brief interruption is possible between removing the CNAME and the managed domain becoming active; avoid other changes during that window. If Cloudflare reports another conflict, an unexpected fee, or a different target, stop and restore the old record if the domain cannot be attached safely.

Once Cloudflare reports the managed www domain active, add the two exact www Auth callback URLs in the existing production Supabase project. Use no wildcard or preview hostname. Preserve the four DNS rows unrelated to www and retain the Site URL; no sender/DKIM/SPF/SMTP updates are needed.

## Verification and stop conditions

- Read both public apex and www in a fresh browser session, following redirects. Require updated sign-in UI with Forgot password and original n logo, valid HTTPS, and successful new JS/CSS asset responses. Check that new page-Fx9z6qmR.js becomes available or identify the corresponding deployed build asset from the actual release.
- Inspect served public assets for retained production project lmuwsjjrqmmmtmxjvqln, no preview project, no service/secret key. Verify saved exact callback additions without sending an email. No private student data is read.
- Do not claim actual confirmation/recovery, saved-progress writes or other authenticated smoke behavior passed from these public checks. Those require their separately approved test scope.
- Stop on a redirect loop, TLS/domain failure, wrong project, missing resources, unexpected fee or unrelated configuration changes. Do not retry/deploy the app or modify SQL to fix domain routing.

## Exact routing rollback

If www cannot be brought up or points to the wrong app/backend, remove only its newly added Worker Custom Domain. Verify whether Cloudflare removed its managed www DNS entry; if an unexpected locked record remains, inspect it before further action. Recreate the old record exactly: Type CNAME, Name www, Target custom-domains.chatgpt.site, Proxy Proxied, TTL Auto. Do not overwrite another hostname or import the entire zone export.

Remove only the two new www Auth callbacks if reverting that part of the approved change; keep existing apex callbacks and Site URL. Confirm the old official website is reachable again, and report that the new public-site cutover did not pass. No Worker version rollback, database rollback or data restore is part of this routing inverse. Retaining an unused automatically issued certificate does not affect routing; do not broaden the rollback into certificate deletion.

No verified database/private Storage backup exists. This is a DNS/routing/Auth-allowlist change; it does not provide a backup or alter the reviewed DB installation.
