# Year 9 1A flag trial

Run `supabase/migrations/20261012_question_flags_trial.sql` in the existing
Supabase project's SQL Editor. It is independent of the Reported Problems
migration and adds a table, index, read policy and three validated RPCs.
Without administrative Supabase access this migration cannot be applied by
the publishing workflow; the UI shows an explicit setup message until it is run.

Only the original Year 9 1A ID is enabled on both client and database. Students
see Ask my tutor below each core or suggested question, before or after an
attempt. Confirmed saves show Flagged for tutor review; another click withdraws
the flag. Stable pending IDs and account checks protect uncertain retries.
Students refresh their flag list or reopen the lesson to see tutor decisions.

Tutor Dashboard > Flagged questions groups requests by student. It shows
question context, latest existing answer, attempts, flagged date and status.
Refresh flags reloads flags and existing practice data. Open question navigates
to the question; Mark reviewed closes the request without changing progress or
claiming understanding. Reviewed/withdrawn requests remain in history, with
dates and reviewer identity. A later student request creates a new history row.

RLS permits students to read only their flags and authorised tutors to review
all requests, matching the existing LMS global tutor role. Students can create
flags only for enrolled 1A questions. No client write/delete grants or learning
data writes are introduced. One active flag per student/question is enforced by
an index; concurrent flagging is serialised using the existing student's row.

Source tests cover RPC payloads/retries, history preservation, unanswered and
repeated attempt context, account isolation, pagination, markup, scope and SQL
contracts. They do not execute PostgreSQL RLS or provide live browser QA.
After migration: test flag, unflag, refresh/reopen, tutor review, and reflag for
both core and suggested questions. Verify another student cannot read/withdraw
the flag; a student cannot review; other lessons cannot be flagged through the
RPC. Check keyboard operation and narrow-screen wrapping.
