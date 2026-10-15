# Next tasks

The student dashboard derives its automatic next task from enrolled courses and existing lesson completion. It selects the first unfinished lesson containing questions, in chapter and lesson order. The last-used enrolled course is preferred; once it is finished, the next enrolled course is used. Chapter introductions without practice questions are skipped. The existing completion rule is unchanged.

Tutor-added tasks need the additive migration `migrations/20261012_next_tasks.sql`. Run the whole file in **Supabase → SQL Editor → New query → Run**. Refresh the LMS afterwards. The automatic task works independently of this migration. The same SQL is available at `/setup/20261012_next_tasks.sql` on the site.

In **Tutor → Students → Manage extra tasks**, select any number of subchapters from the student's enrolled courses and save. Course/chapter filters and bulk selection are available. These appear under **Also assigned by your tutor** on the student dashboard. When an extra task is also the automatic next task, it appears once with a tutor-assigned label. Completed tasks disappear from the student's active list and remain visible in the tutor's completed list. Removing an extra task preserves the assignment row and all progress.

No new deadlines, notifications, completion requirements, enrolments or performance records are created. Students retain access to the rest of their enrolled courses. Extras supplement the automatic task; they do not block advancing through the course.

Permissions follow the existing global tutor role: tutors can assign tasks to existing students, and only for enrolled practice content. Students can read only their own assignments for currently enrolled courses. Writes go through tutor-only RPCs with expected-account checks. Active uniqueness and stable IDs make retries idempotent. Removed rows are retained, and retrying an old request cannot reactivate them. There is no separate identity or progress store.
