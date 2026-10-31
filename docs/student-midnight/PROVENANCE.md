# Midnight provenance and access findings

Read-only audit refreshed 2026-10-29 UTC. No GitHub/Cloudflare mutation, push, deploy, or production-record request was made. `/workspace/tutoring` was not edited.

## Current remote source

`git ls-remote https://github.com/Dyrxal/tutoring.git` returned:

```
97ab688d9ef138429fd05d78678e2d1236be9957 HEAD
97ab688d9ef138429fd05d78678e2d1236be9957 refs/heads/main
ae3c7b326d49ba1ddc3927694f75388517545523 refs/heads/audit/heatmap-date-refresh-20261020
ae3c7b326d49ba1ddc3927694f75388517545523 refs/pull/1/head
81e1d7e5e03f533a7514353d786a953b543da404 refs/pull/1/merge
```

The existing public mirror `/tmp/dyrxal-tutoring-audit.git` has matching advertised branch objects. Main contains four commits, all “Add files via upload”: `ff5de011faf8b5e76fd0c3900c552743fd58f5c0`, `58524e23baf08ce51be989b51e880a537b05105a`, `d73a881d38eb11b6fd5c79d56516f53a6406f5f4`, `97ab688d9ef138429fd05d78678e2d1236be9957` (2026-10-15). The audit branch differs only in practice activity date refresh, its test, and package metadata (four files); no theme feature.

`git grep -n -i -E 'theme|midnight|localStorage|sessionStorage|prefers-color-scheme' main -- app components lib` finds only the activity midnight-date comment, Tailwind theme declaration, and generic chart/toast components. There is no Midnight appearance selector/persistence or Year9 dark-course branch in main. `.github` has no tracked workflow files. The dirty `/workspace/tutoring` has substantial authorized earlier repairs and must not be treated as clean main.

## Retained public asset evidence (2026-10-27, not a fresh deployment assertion)

Prior read-only downloads still exist:

- `/tmp/lms-theme-live.html`: 9,892 bytes, mtime 2026-10-27T04:15:05Z, SHA256 `54088bef4d5b734ebe6842d60c0e571321d926b1dc9e1af0de080926e34a857c`.
- `/tmp/lms-live-current.html`: identical content/hash, mtime 2026-10-27T03:41:22Z.
- `/tmp/lms-live-page.js`: 1,577,734 bytes, mtime 2026-10-27T03:41:49Z, SHA256 `6a3b3a5900d55fbb3ea11a9348d4ffa1ca4f87892db85c70e539b8a332ea3121`.

HTML title is `Notation Education`; it references `/_next/static/chunks/page-CNlMSUEk.js`, `index-BWJWQi4W.js`, and CSS `index.HvcBHXoF.css` / `page.CNMUQXD7.css`. The retained page bundle has no `sourceMappingURL`. No source commit or deployment ID was established from these assets.

Exact minified bundle evidence (offsets are Python string indices, all relevant preceding text is ASCII):

- Offset 1472290: `tt=`notation-theme:${$e}`` with `$e=c?.user?.id||`preview-student``. A requestAnimationFrame effect reads `window.localStorage.getItem(tt)`, accepts `midnight` and `light-version`, otherwise sets `light`; `nt(e)` writes `window.localStorage.setItem(tt,e)`. Persistence is per user/browser, with preview fallback.
- Offset 1544880: student Account `Appearance` card, label `Colour scheme`, `<select id="student-theme">`; values/labels `light` / `Classic light`, `midnight` / `Midnight study`, `light-version` / `Light version`. `onChange` calls `nt(e.target.value)`.
- Offset 1510076: root shell receives `"data-student-theme":zt`.
- Offset 1474887: `Ft=!et&&We===`midnight`&&f===`Course`&&at?.id===kt?.id`. `et` is tutor status, `kt` is the Year9 course located by Year9 chapter/lesson content or title; Year10 does not receive this flag.
- The course JSX uses `!Ft` to suppress the Courses back button, adds `year9-course-hero` when Ft, chooses `YOUR COURSES` instead of `at.title`, omits the standard description, and chooses `Learning path` instead of `Modules`. Root class `year9-course-dark-pilot` is enabled by Ft. This directly supports the previously reported Year9-only Midnight layout mismatch.

The cached artifact origin is corroborated by `/workspace/tutoring/docs/reliability-fixes.md:41-47`, which records the previous deployed read-only inspection. The current investigation cannot independently establish that those assets remain active today.

## Hosting configuration and build safety

Source `wrangler.jsonc` at main and the dirty checkout specifies Worker name `notation-education-lms`, main `vinext/server/fetch-handler`, compatibility date `2026-10-15`, `preview_urls: true`, assets binding name `ASSETS`. It contains no `routes`, account ID, deployment/version ID, custom domain mapping, remote source commit, or build-branch rules.

`cloudflare-env.d.ts` declares optional binding names `DB` and `BUCKET`; these are type declarations, not proof of active remote bindings. Local `.wrangler/deploy/config.json` keys are only `auxiliaryWorkers`, `configPath`; its configPath is `../../dist/server/wrangler.json`, which does not establish any deployed version.

The parent task reports user screenshots showing Worker `notation-education-lms`, production branch `main`, builds enabled, include `*`. Those screenshots were not re-inspected by this subagent. They are insufficient to establish current preview command, source linkage, or that pushing a feature branch cannot invoke deployment. **Branch-build safety remains unknown; inspect Cloudflare Builds settings before any push.** In particular, do not infer from production branch main alone that every non-main build uses safe version upload.

## Access blockers

- Fresh `gh auth status`: “Failed to log in to github.com using token (GH_TOKEN)” / “The token in GH_TOKEN is invalid.” Public Git refs remain readable, but authenticated branch/PR mutation is unavailable through that token.
- Credential-related environment names only: `AZURE_FEDERATED_TOKEN_FILE`, `GH_PAGER`, `GH_TOKEN`. No Cloudflare credential variable names were present. No values were printed.
- `/home/agent/.config/.wrangler`, `/home/agent/.wrangler`, `/home/agent/.config/gh` and corresponding workspace-level configs were absent. No Cloudflare/GitHub app tools are available in this tool catalog. `/root` configuration paths are unreadable under the sandbox and were not opened.
- Fresh HTTPS GET to `https://notationeducation.online` and header probes to `https://www.notationeducation.online` fail at the execution proxy CONNECT layer with `403 Forbidden`, `server: envoy`, dated 2026-10-29 09:46 UTC. The HTTP domain probe and GitHub API endpoint likewise return proxy403. This is execution-network denial, not a demonstrated response from the application.
- Active domain → Worker mapping, active deployment/version, deployment source commit, current build branch rules, and current remote bindings cannot be confirmed with available access. No available credentials were used to query Cloudflare. No push should occur until branch-build safety is confirmed; no production deployment is authorized.
