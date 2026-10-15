# Year 9 1A spaced-review pilot

## One-time database setup

Open Supabase SQL Editor, create a new query and paste the **whole** `migrations/20261013_mistake_review_1a.sql` file. Ensure no partial text is highlighted, then click Run. Refresh the LMS. The same complete file is available at `/setup/20261013_mistake_review_1a.sql` in the tutor review panel.

The published interface remains inactive until this migration succeeds. Ordinary lesson practice remains usable before setup. The migration adds review schedules/settings and attempt metadata; it does not replace content, remove records, reset progress or rewrite historical answers. Run as the Supabase SQL Editor owner so SECURITY DEFINER functions can perform authorised writes.

## Student workflow

Only students enrolled in the existing Year 9 1A lesson see the dashboard card beneath Your next task. A new incorrect lesson answer enrols/resets that question automatically, in the same transaction as the attempt. Latest incorrect historical lesson answers initialise once when the student opens the dashboard, due one calendar day after their original attempt; older mistakes can therefore be due immediately. Existing schedules are never reset by initialisation.

Start review shows up to five questions in a batch. Continue reviewing advances through the remaining questions without a daily limit. Stop review retains confirmed attempts and schedules; unanswered questions retain their dates. Practise more lets students select future questions for early practice. It does not change future dates merely by selecting/opening questions.

The default intervals are 1, 3, 7, 14, 30 and 60 calendar days. A first scheduled correct answer without help advances one stage; the maximum remains 60 days. Incorrect/help-assisted scheduled answers return to stage 0 and tomorrow. Early correct answers and same-day retries retain dates/stages. Early incorrect/help-assisted answers restart stage 0 and bring the date to tomorrow if sooner. A missed date does not reset progress; the next date is measured from the actual review date.

Only the first scheduled attempt on a local date determines interval advancement. The database determines due/early/retry classification; stale tabs cannot advance an old revision. Immediate corrections never earn interval advancement. Students can reopen existing hints, notes, worked examples and the video within the review card; opening support records that day's help use against the schedule, including after reopening the review. Opening the full lesson waits for confirmed help tracking and ends the review screen. Independent visits to lesson help outside a review session are not globally tracked.

Each student's first captured browser IANA timezone is retained in the existing profile; Australia/Melbourne is the fallback when missing/invalid or ordinary lesson practice starts first. Subsequent logins do not change that timezone. All database due dates and client counts use it, including daylight-saving boundaries.

## Tutor workflow

Tutor Analytics → View profile → Spaced review shows due/future questions, first scheduled-attempt accuracy, repeated incorrect scheduled reviews across distinct dates and full question history. Lesson practice, scheduled review, early practice and retries are labelled separately. No support ticket or tutor approval is generated automatically.

An optional settings dropdown changes the six interval values for this pilot. The first interval remains one day and the six values must increase up to 365 days. Existing due dates and performance records are not rewritten; changed intervals apply on future scheduling decisions.

## Preservation and security

Review attempts reuse `practice_attempts` with explicit context, support-use and result metadata. Legacy/ordinary attempts retain the lesson context. Existing lesson answer restoration, core completion and initial lesson analytics exclude review attempts. Review UI does not write lesson_progress or mark completion, and cannot advance Next Task.

New schedule/settings tables are read-only through client RLS. Students can read only their own enrolled pilot content; tutors use the LMS's existing global tutor role. Students cannot write review metadata via ordinary attempt inserts. Authorised server RPCs save attempts and schedule transitions atomically, grade the pilot's MCQ and precision-sensitive short answers from the current database answer key, and validate actor/enrolment. Other lessons' grading is unchanged.

Stable UUIDs make retries idempotent. Profile and schedule locks serialize writers; schedule revisions reject stale saves. Question snapshots and row locks protect marking when a tutor edits a question. A known conflict refreshes the question and schedule while preserving the typed answer. Duplicate replay returns the original attempt and current schedule without adding another attempt. Client requests have account/unmount guards and preserve failed answers. Historical outcome snapshots are stored only against new review attempts. No background job is required: date comparisons determine what is due on opening the site.

Automated code tests do not substitute for live Supabase execution or authenticated browser/mobile testing. Those checks must be reported separately. An optional, read-only SQL policy verification is supplied at `tests/mistake_review_policy.sql`; it exercises all intervals, early practice, retries, support use and answer precision after setup. It does not test live RLS or concurrent RPC requests.
