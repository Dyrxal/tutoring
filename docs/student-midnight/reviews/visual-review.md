# Midnight visual finish review

Disposition: **FIX** — one bounded palette correction is required; no composition rebuild is warranted.

Method: fresh independent screenshot review against the three explicitly approved mockups, using Impeccable's brief-first visual-fidelity principles. This is a single-reviewer visual finish assessment, not a full dual-agent Impeccable critique or a new direction proposal. No source implementation was edited. Review date: 2026-10-29.

## Evidence inspected

Read `docs/superpowers/specs/student-midnight-brief.md` and `docs/student-midnight/README.md`. Visually inspected all three originals in `/workspace/generated_images/`: `exec-f2f22303-32b2-487a-ab20-1b894e1b9cec.png` (Courses), `exec-c8151b18-922a-424e-bb22-e61aa81bd81b.png` (Progress), and `exec-cba9a547-b62f-462e-b4e9-de3a987c4ed0.png` (Account).

Visually inspected all eight supplied final captures under `outputs/midnight/browser/final/`: `1513-midnight-{courses,progress,account,dashboard}.png` and `390-midnight-{courses,progress,account,dashboard}.png`. The tall mobile Account image was automatically scaled by the viewer; its broad layout and complete content order are visible, but that image alone is not pixel-level evidence about text rendering.

## Material finding

**V1 — Dashboard completed-next-task state retains a large Light surface.**

- Location: `1513-midnight-dashboard.png`, white panel below “Your next task,” approximately x280–1465 / y194–280; `390-midnight-dashboard.png`, same panel approximately x22–368 / y239–348.
- Visible result: the message “You've completed all available practice subchapters in your courses” sits on a pure-white rectangular surface with blue text. It becomes the most visually dominant element in an otherwise dark Dashboard. This is inconsistent with the requested shared Midnight palette and included-screen state coverage.
- Required correction: apply the existing scoped Midnight panel/background, border and supporting-text tokens to this completed-task state. Preserve its message, position, behavior and existing Dashboard layout. Check the same state at desktop and mobile after the correction.
- Scope: a small theme-coverage fix. It does not justify recreating the Dashboard or changing the approved three-screen compositions.

## Composition and responsive assessment

**Courses: faithful structure.** The shallow book photograph is confined to Courses. The desktop view follows the approved two wide horizontal panels: image left, course identity and description centrally, progress and a clearly visible Open course action right. The mobile version groups each thumbnail with its title and description, then places progress and the full-width action below. No cropped control or horizontal overflow is visible. The generated photograph differs from the sample photograph, as permitted; it supports the same restrained academic atmosphere. Real titles and descriptions change line wrapping without breaking the hierarchy.

**Progress: faithful structure with a minor navigational simplification.** The quiet heading, three-part statistics strip, compact eight-column calendar beside day details, and separate course-completion panel follow the reference composition. At 390px, statistics become a readable vertical list, the calendar remains within the panel, details follow it, and course rows retain the title, exact completion count, percentage and chevron. Selected-day treatment is clearly visible. Four-week summary labels, eight-week calendar range, populated day details and retained weekly totals are valid data/semantics differences rather than fidelity defects.

**Account: faithful structure.** The identity card and profile form occupy the principal desktop column, with appearance preview, theme selector and sign-out in the secondary column. Fields are visibly dark and readable; the avatar selection is clearly outlined. Mobile order is identity, profile editing, appearance, then retained activity information. Avatar choices form two rows and Save profile remains a broad action. Additional practice information below settings is the documented parity decision and is not treated as an unwanted redesign.

**Shared shell:** desktop captures consistently show a slim sidebar with one active item, restrained borders and the same near-black/slate/icy-blue vocabulary. Mobile headers retain a visible current-view label and menu affordance. Dashboard retains the existing card layout as scoped, with the V1 state exception above.

## Nonblocking observations

- **V2 — Progress week-date labels are absent.** In the approved Progress mockup, calendar columns are identified by dates such as “7 Sep” and “14 Sep.” The implementation shows weekdays and the overall range but no individual week labels, on both desktop and mobile. This makes locating an older week require counting columns or selecting days. Restore compact week-start labels in a future bounded improvement if space permits; the current complete range and selectable day detail keep this from blocking the main task.
- Secondary copy and course headings are generally smaller and less airy than the mockup, and the existing uppercase N mark differs from the reference mark. The hierarchy is still coherent and the main compositions are retained; these differences do not warrant another broad polish cycle.

## Limits and handoff

This review verifies visible compositions and the supplied viewport captures only. It does not independently establish live behavior, persistence, permissions, keyboard operation, contrast ratios, source provenance, deployment status or database correctness. The parent's reported browser and axe results are separate verification evidence and are not substituted for the visual inspection above. Light, tutor, lesson/detail and transient/error screenshots were outside this specific visual pass.

After V1 is corrected and the same completed-state Dashboard captures confirm the token coverage, the supplied three-screen implementation is visually suitable to ship subject to the project's separate functional, source-provenance and release gates. No further direction interview or layout rebuild is recommended.

Questions skipped: the user already approved the reference compositions and this task is a bounded finish review.

## Scoped V1 re-review — resolved

Reviewer: `/root/midnight_release_notes`, acting as a separate bounded visual reviewer on 2026-10-29. This is an appended follow-up; the original review above is retained unchanged.

I opened and visually inspected the newly generated `outputs/midnight/browser/final/1513-midnight-dashboard.png` and `390-midnight-dashboard.png` at this handoff. The completed-next-task panel now has a dark slate surface, subtle dashed border and readable pale text at both viewport sizes. The previously dominant white rectangle and blue text are gone.

The panel remains in the positions recorded by V1 (desktop approximately x280–1465/y194–280; mobile x22–368/y239–348), beneath “Your next task” and above spaced review. Its message is unchanged; on mobile it wraps cleanly over two lines within the existing panel. The existing heading, review panel and course-card ordering and layout remain intact. No material layout change or clipped text is visible in these two captures.

**V1: resolved.** The requested palette-coverage correction is visually verified at desktop and mobile. The original review's nonblocking V2 observation remains unchanged. This narrow re-review makes no new claim about runtime behavior, contrast calculations, persistence, permissions, deployment or live data; build/browser/axe evidence is recorded separately by the primary implementer.
