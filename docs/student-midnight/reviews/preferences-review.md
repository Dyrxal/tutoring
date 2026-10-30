# Scoped re-review — final status

**Both original P2 findings are resolved. No remaining findings within this follow-up scope.** Reviewed only the fixes, their new regressions and the updated implementer report; no new broad review.

- **Session lookup errors: resolved.** `app/use-student-theme.ts:45–49` now throws returned session errors, routing them through existing load/save error handling while preserving the active scope and last confirmed theme. Confirmed identity mismatch still invalidates. Regressions at `scripts/test-student-theme.mjs:105–114` check load feedback/retry and both returned/thrown save errors, rollback to confirmed Midnight and retry without auth events.
- **Writes across client replacement: resolved.** `app/use-student-theme.ts:19–21,65,82–85,91–96` now queues and awaits writes by actor across client instances. Conditional cleanup removes only the settled current tail. The regression at `scripts/test-student-theme.mjs:115–117` confirms that a replacement client's newer write cannot start until the old client's dispatched write finishes; the final selected Light is confirmed afterward.
- Independently reran `node --test scripts/test-student-theme.mjs`: **18 passed, 0 failed**. The added regression cases cover the original reproduced failure sequences.
- Hook and regression source remained stable throughout this verification: SHA-256 before/after matched (`app/use-student-theme.ts`: `4e6d022bd54f6d5e0fa2754753ac45bb9670ed668842b0a4856a8f5c5b411459`; `scripts/test-student-theme.mjs`: `d17d28b2ab02a43767be2b42be954b9338f308b1088af184d93297225d2c4936`). This confirms the reviewed preference sources, not unrelated branch files.

No source edits, subagents or live calls. SQL/UI/staging/browser validation was not repeated for this narrow follow-up. Original review below is retained as historical context; its findings are closed by the fixes above.

---

# Preference implementation review

Scope: app/student-theme.ts, app/use-student-theme.ts, supabase/migrations/20261029_student_theme.sql, scripts/test-student-theme.mjs, scripts/check-student-theme-sql.mjs. Read-only source review against the approved brief; no live calls or source edits.

## Findings

1. **P2 — Transient session lookup errors permanently disable appearance changes without feedback.** `app/use-student-theme.ts:44–47` collapses `getSession()` errors and genuine owner mismatches into `false`. Both callers (`:66`, `:93`) call `invalidate`, setting `active=false`, clearing the error and restoring Light (`:28–33`). Subsequent reload and change attempts return immediately (`:51`, `:85`), even once session lookup works again. Recovery requires an auth event or scope replacement. A temporary refresh/network failure can therefore silently discard a confirmed Midnight appearance and leave the controls unable to retry. Treat lookup errors as retryable load/save failures, retaining the last confirmed theme; reserve invalidation for confirmed identity loss. Add read and write regressions for `getSession` errors followed by successful retry.

2. **P2 — Client replacement does not serialize pending writes for the same student.** The write queue is keyed solely by Supabase client (`app/use-student-theme.ts:20`, `:63`, `:80`, `:91`). Replacing the client invalidates the old scope (`:118–121`) but cannot cancel an already dispatched RPC. A new client for the same student can load and successfully save Light while the old client's Midnight write is still outstanding. If the old request reaches/commits on the database last, it persists Midnight; its result is discarded at `:69`, so the UI continues displaying the newer Light choice as confirmed. Reload later restores the stale choice. Serialize outstanding writes across client replacements for the same actor (including waiting before the new load), or enforce an appropriate write ordering protocol. The current client replacement regression only covers a pending read and does not cover this case.

## Evidence and compliant behavior

- `node --test scripts/test-student-theme.mjs`: **15/15 passed** at review time.
- Additional ephemeral assertions using the existing harness reproduced both findings: after a transient session error, restoring `getSession` and calling both reload/change issued zero RPCs; a replacement client's save completed while the previous client's save remained outstanding. These checks changed no source files.
- Strict allowed theme values, Light fallback, per-user legacy migration, server precedence, optimistic updates, RPC confirmation, failed-RPC rollback, same-client ordered writes, scope reset, and A→B→A generations are implemented and covered by meaningful unit cases.
- SQL review found no additional permission defects: authenticated self/student checks, explicit theme constraint, empty search path, anonymous/public execute revocation, and narrow RPC writes preserve existing profile grants and policies. Migration is designed to rerun safely. The PGlite script exercises actual SQL and double application; this reviewer did not independently rerun it.
- No assessment of UI accessibility/visual fidelity, real staging behavior, or live migration application is included. Implementer report was not present when first inspected.
