# Launch health check requested 13 November 2026

The live HTTPS website is responding correctly. Two maintenance changes are prepared and tested on `fix/launch-health-20261113`: HTTPS redirects for application pages/callbacks, and security dependency updates including the React server code actually bundled by the build plugin. **These changes have not been deployed.** Production remains on merge `f6e42e9`.

Executable candidate: `b85ce699c090ad806b8e75954235eb0bac89bfc6`. The original checkout and its existing documentation changes were preserved; implementation is isolated at `/workspace/work/mm-launch-maintenance`.

## Verified results

| Check | Result and scope |
|---|---|
| Official HTTPS addresses | Both reach the released app with original n logo and Forgot password. Production backend selected; initial assets load. |
| Production Auth and data API | Auth settings/CORS work; eight `limit=0` data queries return HTTP200 empty responses. No student/curriculum rows fetched. |
| Live browser interface | 27 checks pass across 320, 390, 768 and 1440px; no uncaught browser errors. |
| Auth/recovery client scenarios | 17 pass on released assets with mocked backend responses. The same 17 pass on the final candidate. No real email, login or password change. |
| Candidate browser interface | 27 checks pass on the final compiled preview Worker. |
| Automated tests | 165 pass, zero fail, including new HTTPS and installed bundled-RSC regressions. |
| TypeScript / focused new-file lint | Pass. Full repository lint retains 66 errors/69 warnings; released baseline was 72/75. |
| Production / preview builds | Each passes all five existing artifact/provenance/backend/key/secret checks; archived production build also rescanned successfully. Preview build restored afterward. |
| Compiled application HTTPS redirects | Seven local workerd checks pass, including preserved recovery queries, terminal DNS dots, localhost and lookalikes. |
| Production dependency audit | Zero advisories after classifying executable RSC as a runtime dependency. |
| Full dependency audit | Zero critical; 7 low, 27 moderate and 28 high findings remain in the wider development/toolchain graph. A fully clean repository audit is not claimed. |

## Findings and prepared changes

Plain HTTP currently serves the live sign-in page. The candidate returns 308 redirects for official application hosts, retaining paths/query parameters and canonicalizing a terminal DNS dot. Local development and preview hosts keep their existing behavior. Cloudflare may serve static assets before middleware, so this is application/callback protection rather than a claim of universal edge HTTPS/HSTS enforcement.

The initial production audit found 23 advisories, including three critical Next.js advisories. A full audit and independent review also identified vulnerable React server code vendored inside the Vite RSC plugin, which the production-only audit missed. The candidate patches Next/eslint to16.4.1, Zod to4.6.6, sharp to0.35.5, and compatible transitive dependencies. React, ReactDOM and RSC are aligned at19.3.1; both application and Vinext use plugin-rsc0.5.39 with vendored RSC19.3.1. Two executable dependency checks fail against the old bundled runtime and pass against the patched one. Existing release-age/build-script policy remains intact.

Independent review covered the original two maintenance commits. Its material runtime finding and the hostname finding were addressed in one fix pass, with four failing regressions made green, followed by the full test suite, builds and browser verification. No second independent review is claimed. Current compiled output did not demonstrate exploit reachability; no exploit or compromise claim is made.

Local test setup failures were diagnosed separately: an outbound proxy intercepted loopback requests, and a reused local port later served stale asset references after rebuilding. The optional runner now keeps loopback local while fulfilling/blocking remote backends. Final browser results use a fresh port with build-matching asset readiness checks.

## Delivery and remaining acceptance

[Review the maintenance branch against main](https://github.com/Dyrxal/tutoring/compare/main...fix/launch-health-20261113). Normal PR merge and its Cloudflare production build remain the publication path. This environment has no authenticated GitHub PR-write connector, so a PR has not been created automatically. No direct main push, production deployment, SQL/DNS/Auth change or email was performed in this health task.

After merge, verify the resulting Cloudflare build and public HTTPS app redirects. The owner should then confirm an existing test student can sign in, open a lesson and save/reload progress, and complete a real confirmation/recovery email roundtrip. Mocked client tests do not prove these real production flows. No more Supabase SQL installation or DNS setup is required for this frontend maintenance change.

Preserve the immediate prior Worker version `afeaaf7c-312b-4dd4-a6af-04666a9e62a0` as the maintenance frontend rollback target; see [rollback procedure](../mm-launch/frontend-rollback.md). This is preparation only, with no rollback or database restore performed.

The previously verified database installation remains complete: 85 metadata comparisons, three inverse guards and 12 content-preservation comparisons were recorded on12 November. Its SQL/contracts are unchanged. Physical iPhone/Safari, actual elapsed overnight/token expiry and the owner-deferred database/private Storage backup remain unverified. Backup work was not restarted.

## Decisions and evidence

Maintenance was isolated while preserving the live release. Exact transitive pins were used where a deep update retained vulnerable nested versions. Bundled RSC was checked directly rather than inferring safety from package classification. A valid terminal DNS spelling was treated as an HTTPS boundary case. Broader tooling/lint cleanup was retained as follow-up rather than mixed into the application fix. Real accounts/private files, exploit testing, edge policies and production publication are distinguished from simulated/local evidence.

All decisions, their costs if wrong, test limits and complete results are retained in [the machine-readable report](2026-11-13-launch-health.json) and [review resolution](2026-11-13-launch-health-review.json). Raw logs, temporary screenshots and archived build artifacts remain outside Git at `/workspace/work/mm-overnight-health`.
