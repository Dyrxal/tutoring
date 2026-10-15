# Structured practice template

The shared layout is `LessonPracticeTemplate`. It uses the existing lesson's
questions and `lessons.lesson_flow` JSON; it creates no courses, questions, attempts
or derived progress rows. Enable it through **Edit lesson → Practice layout**.
The editor checks for 21 existing questions: eight core, then 13 suggested.

`lesson_flow.template` holds:

- `version: 1` and optional `enabled` (false preserves the legacy layout).
- `help_links`: `{label, target: "worked_example" | "question", question_id?}`.
  Question links must target one of the first eight questions. Missing or hidden
  examples produce unavailable shortcuts instead of unrelated fallback links.
- `reasoning_prompts`: question-ID → short reminder.

`lesson_flow.practice_help` holds question-ID → `{title, example, steps}`.
An empty title hides an example. `lesson_flow.common_mistakes` is a separate
`{prompt, solution}` activity, independent of `guided` exercises.

Existing Year 9 1A receives a compatibility default in `resolveLessonFlow`.
Its previous `guided` content is preserved and displayed as common mistakes;
`guided_is_common_mistakes` prevents a duplicate guided display. Saving 1A through
the editor persists the resolved configuration. Other lessons normally opt in
when their template configuration is saved. Do not copy 1A's content or help
labels to other topics; author their configuration against existing question IDs.

## Year 9 Chapter 1 rollout

`chapter1-template-rollout.ts` supplies read-through configuration defaults for
1B–1K, using the original 1A lesson ID to locate its parent module. No course or
lesson title is used to determine rollout scope. Year 10 and other chapters are
excluded, even if they contain identical questions. Eligibility requires 21
distinct question IDs and unambiguous matches to the existing section banks in
both the core and suggested groups. Unrecognised or differently sized sets are
left alone and listed in the tutor-only Chapter 1 status panel on the course page.

The adapter creates no database rows and performs no writes on login. Chapter 1's
old empty-lesson auto-import is disabled; deliberate imports remain in Content.
The existing tutor editor receives the resolved configuration and persists it in
`lessons.lesson_flow` on Save lesson. Any saved template (including disabled or
empty help settings) takes precedence over defaults, so repeat loads never refill
removed support or overwrite tutor edits. Questions, attempts, videos, resources
and completion records are not modified by the rollout.

Help shortcuts use the existing worked example and existing core-question hints.
No hints, notes or review questions are invented to fill gaps. Reasoning reminders
bind to exact original question prompts and are omitted for edited questions.
An explicitly labelled Common mistakes activity can be presented separately;
`common_mistakes_source` identifies its original slot so it is not rendered twice.
The original activity remains stored. Missing examples, mistakes, recall, challenge,
remember activities and staged core hints appear in the tutor status panel.

This source-level rollout does not assert how many authenticated live lessons
qualify. The status panel calculates the real count using Supabase-loaded rows.

## Answer saving and history

`savePracticeAttempt` confirms inserted rows before answer feedback/progress is
updated. A retry after an uncertain network result reuses its submission UUID;
a duplicate UUID is recovered only if its stored answer matches. New deliberate
attempts receive new UUIDs. Typed answers are not silently discarded for older
schemas missing `response_text`.

Chapter imports are additive: existing questions and attempt history are never
merged or deleted to remove duplicates. Any future duplicate merge requires a
separate verified transaction, not a browser-side update followed by deletion.

Run `node --test scripts/test-lesson-template.mjs` and
`node node_modules/typescript/bin/tsc --noEmit --incremental false`.
Tests use database mocks and server-rendered components; they do not replace
signed-in browser/mobile testing or a live RLS audit. Database-side grading and
completion enforcement remain a separate task.
# Year 10 rollout

`year10-template-rollout.ts` supplies 99 section configurations to the same
`rolloutCourse` engine. A unique course with at least eight distinct known
Year 10 seed question IDs is required; no course/lesson title checks are used.
Ambiguous or absent identification is reported on the tutor Courses page.
The existing 21-question and prompt-structure safeguards still apply to each
lesson, and saved template configuration always wins. The course overview
lists actual enabled/skipped lessons and missing existing teaching support.

Year 10 automatic imports on tutor login are disabled. Existing Content
buttons still permit deliberate imports. No migration or question/progress
database writes are part of this rollout. Tests exercise all 99 source sets
and the Year 9 regression suite, not live authenticated student accounts.

# Whole Year 9 rollout

The course containing the original 1A lesson now uses the same read-through
configuration for recognised 21-question sections across Chapters 1–10.
`year9-template-rollout.ts` supplies metadata to the existing rollout engine;
it does not insert questions or write database rows. Source banks identify
the existing 8/13 grouping by multiple matching prompts in both groups.
Renamed lessons still work. Unrecognised, incomplete or duplicate-ID sets are
left unchanged and reported in the tutor course overview. Year 10 is excluded.

Existing saved template settings remain authoritative. Existing examples and
question-level hints provide help targets; missing review activities, common
mistakes and staged hints are reported rather than invented. Brief reminders
bind to unchanged prompts, not arbitrary positions. Tutor Save lesson persists
the editable configuration through the existing data layer.

Year 9 automatic question imports on tutor login are disabled to preserve
incomplete sets and tutor edits. Explicit Content import controls remain.
Live enabled/skipped counts and teaching gaps require an authenticated course
load. Source-level tests cover all 97 target section banks, preservation,
grouping, 7/8 completion gating and Year 10 isolation. Browser/mobile and live
Supabase checks must be reported separately from those tests.

