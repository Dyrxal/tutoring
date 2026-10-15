# Reported problems

Students report from the lesson heading or any question. Reports retain the
signed-in student's identity and existing course/lesson/question references.
Context and dates are derived by the database; names/prompts are captured as
ticket context so a later content rename/deletion does not destroy the report.
Native dialog forms provide a focus trap, Escape and labelled fields. Failed
submissions keep their draft and original UUID for safe retries.

Tutors use Dashboard > Open reports or the Reported Problems navigation item.
The initial filter shows New reports. All statuses / history includes accepted,
resolved and ignored reports. Accept, Resolve, Ignore and Reopen append an
actor, timestamp, status transition and optional internal note in one database
transaction. No tickets or history are deleted. Search and status/category/
course filters operate on all paginated reports visible to the signed-in tutor.

## One-time database setup

Run the complete `supabase/migrations/20261012_problem_reports.sql` in the
existing project's Supabase SQL Editor. It adds two tables and two RPCs, with
read-only client grants and RLS. It can be rerun without removing data and does
not modify learning tables. Without it, the UI explicitly reports that setup
is incomplete, and submission cannot succeed.

The repository schema grants tutors global content management via `is_tutor()`;
the feature reuses that scope. Students submit only for enrolled content and
read only their own tickets. History and internal notes are tutor-only. If tutor
scope becomes restricted by course ownership later, update both the report RLS
and management RPC to use that same permission predicate.

## Verification boundaries

`node --test scripts/test-problem-reports.mjs` tests validation, payload context,
confirmed-save feedback paths, stable retry IDs, pagination, filters, accessible
server-rendered markup and source-level permission contracts. The existing
lesson suite covers preserved lesson/save behaviour. These tests do not execute
PostgreSQL RLS or substitute for authenticated UI and browser/mobile testing.

After applying the SQL, use an enrolled student to submit a lesson and question
report. As tutor, accept with a private note, resolve, ignore and reopen; refresh
to check persisted history. A second student's direct table query must not read
the first student's ticket, and neither student may read history or call the
management RPC. A mismatched question/lesson or unenrolled lesson must be rejected.
Check narrow and wide layouts, focus return, keyboard form submission and links
to core and suggested questions. Simulate a lost response and retry: one ticket
or action history entry should exist for the original UUID.
