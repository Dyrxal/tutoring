# MM implementation ledger

- User approved MM consolidation and directly requested branch/preview preparation. Existing design decisions used; no repeated general confirmation requested.
- User selected separate Free Supabase test project. get_cost(project) returned 0/month; project lcddnpafrkbwsrhqexqe created ACTIVE_HEALTHY. No production project modified.
- Imported exact tracked Sites version-120 tree into GitHub feature worktree based on main 97ab688. Both original checkouts untouched. Shallow fetch warned about roots, but commit/tree objects are locally available and read-tree completed.
- Ruling: sibling worktree instead of modifying old preview branch's ignore file — protects existing preview branch and uses existing /workspace checkout convention.
- Ruling: configuration defaults to preview and fails without preview credentials — costs an intentional build failure rather than risking live data.
- Known baseline suite had 82 pass/3 fail in earlier verified source inspection; rerun and report unchanged failures, no scope expansion to repair unrelated lesson/template assertions.

- Config guard tests RED (module absent) → GREEN (9 assertions). Preview and explicit production builds exit 0, TypeScript exits 0. Full suite 94 total/91 pass/3 pre-existing failures; escalation needed for child-process Git tests (sandbox produced a fourth environment-only failure, removed by correct execution context).
- Ruling: include public preview URL/publishable key in config/preview-public.json — existing Cloudflare preview CI has no environment settings, and these values are already browser-visible by design; no secret/admin key or password included. If wrong/stale, preview requests fail rather than targeting production.
- Ruling: use verified baseline compatibility date 2026-05-15 — old preview's 2026-10-15 exceeds pinned local runtime; preserves published baseline runtime assumptions. Both build targets pass afterward.
- Preview bootstrap initially failed FK-before-PK ordering; native transaction rolled back and empty schema verified before corrected retry. Local PGlite bootstrap checks passed, then native preview-only migration succeeded. No production mutation.
- Synthetic data seeded and verified: 2 courses/2 modules/3 lessons/10 questions; 1 review setting/1 flag scope; 0 Auth accounts. All 15 public tables RLS enabled; 3 private Storage buckets.
- Final independent reviewer: no critical findings; app UI matches published baseline except backend fallback removal. Missing fixture review/flag configuration added; duplicate synthetic answer fixed. Flag UI and hosted Auth/Storage/RPC acceptance remain unverified and explicitly documented.
- Local screenshot comparisons (login/dashboard/lesson × desktop1440x1000/mobile390x844) each 0 changed pixels, no page errors/overflow. Synthetic mocks only; no production writes.
- Blocker: current workspace allowlist excludes preview Supabase hostname; user supplied hostname in reply but environment_status still reports old list. Do not bypass restriction. Auth account provisioning and real network checks pending.

- Ruling: exclude unused legacy mockups/ from migration branch after automatic approval review rejected one screenshot upload (contents not verified for disclosure). Entire equivalent mockup set excluded; retained in source backup. No application import references it. Cost: old design references require the backup; runtime functionality unchanged.
