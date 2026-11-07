# MM release preflight implementation plan

Goal: executable artifact, metadata, baseline and SQL-drift checks with one fail-closed report.
Architecture: Node ESM CLI plus focused modules; no credentials/network/SQL execution. Read-only capture SQL is generated separately and run only through existing scoped access. Structured snapshots preserve project, time and fixture-exclusion scope.
Tech: Node standard library, node:test; no new dependencies.
Spec: owner's five-tooling requirements; docs/mm-launch-readiness.md.
Constraints: no production writes/exports/private-file reads, deployment, DNS, purchases or new connections. Inline execution already requested; no additional plan-approval pause.
Review focus: compressed/escaped assets and redaction; stale/wrong-project snapshots; metadata permission drift; blanket content exclusions; SQL tampering and reversed direction; missing launch gates.

- [x] Write behavioral tests exercising CLI exits/output and core negative cases; observe RED.
- [x] Implement asset scanning and snapshot validators/comparators, guarded-package verification, read-only SQL generation and report aggregation; run tests GREEN.
- [ ] Capture current preview/production metadata/aggregates only; pin reviewed preview metadata and SQL package contract. Run actual builds/scans and real read-only comparison; retain blockers.
- [ ] Document exact executable commands, backup/restore validation and candidate handling; verify full suite/types/build; commit/push.
