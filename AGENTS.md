# Notation Education LMS project instructions

## Standing owner preference —15 November2026, Australia/Sydney

**UI and design changes target the test/preview website by default.** Apply this even when the owner does not mention the test site. Themes, colors, layouts, typography, branding and component appearance all follow this rule.

- Start a review branch from the latest `main`, or bring the latest `main` into the active review branch, preserving already shipped security fixes and existing edits.
- Implement and verify the change on the test/preview site for owner review. Keep preview Supabase `lcddnpafrkbwsrhqexqe` isolated from production `lmuwsjjrqmmmtmxjvqln`.
- Before uploading/publishing changes or making changes on the live site, briefly remind the owner to review the test site first. Do not depend on the owner remembering this step.
- A request to change UI/design does not itself authorize a production merge, `main` push, production deployment or production configuration/data change.
- Publish when the owner clearly instructs production publication. If the owner explicitly targets production or overrides preview, follow that instruction with the brief preview reminder. Once authorization for the reviewed change is established, continue without duplicate confirmation.

## Project context

- `main` triggers the existing Cloudflare production build for Worker `notation-education-lms`. A push or merge to `main` can change the live website.
- Live domains: `notationeducation.online` and `www.notationeducation.online`.
- Original branch preview: `https://feat-mm-cloudflare-migration-notation-education-lms.drisyantshrestha.workers.dev/`. Verify the preview URL for the active branch rather than assuming every branch shares this address.
- Use the current entries in `docs/mm-launch-readiness.md` for release state; older migration entries are historical. Completed migration/SQL/DNS work does not need to be repeated merely to start UI work.
- Read-only production inspections requested by the owner remain allowed. Keep passwords, private keys, session tokens and private student data out of Git and chat.
