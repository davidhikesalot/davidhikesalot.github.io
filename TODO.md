# TODO

## T/asks

- [x] Mobile header: fix off-frame theme icon, collapse facebook/github/mode into a menu on small screens
  - **Files:** `src/components/appheader.component.tsx`, `src/components/appheader.component.scss`
  - **Acceptance Criteria:** on narrow viewports (use the project's existing `max-width: 600px` breakpoint, per `carddeck.component.scss`/`parkdeck.component.scss`) the Facebook, GitHub, and light/dark mode toggle no longer overflow/clip the header; they collapse behind a single kebab (⋮) or hamburger trigger that opens/closes a small menu exposing all three actions (link/button semantics, keyboard/focus-visible accessible, tooltips or accessible labels preserved); at viewport widths above the breakpoint, the three icons render inline as before (no regression to desktop layout); theme toggle continues to read/write via `services/theme.service`.
  - **Verify:** `/doer:dotest`
  - **Out of Scope:** changes to the main nav links (Goals/Parks/Hikes/Plans) collapse behavior; changes to theme persistence logic itself.
  - **Done 2026-07-07:** hand-rolled kebab toggle + `#appheader-menu` panel added to `AppHeader`, collapsing Facebook/GitHub/theme-toggle behind it under the existing 600px breakpoint (`appheader.component.tsx:79-171`, `appheader.component.scss:47-99`); desktop layout unchanged. `/doer:dotest` 2/2 suites, 5/5 tests PASS. No blockers; minor: first `z-index` usage in the codebase (mobile panel only, `z-index: 20`).
  - **Follow-up 2026-07-07:** user reported tooltip overlap in the open mobile menu (verified live via Playwright at 375px against the dev server, not just from the screenshot). Fixed: tooltip `placement` changed `bottom` → `left` for both `NavLinkWithTooltip` and `ThemeToggle` (`appheader.component.tsx`), plus a dim `.appheader-menu-backdrop` scrim behind the open mobile menu (`appheader.component.scss`) so any tooltip spillover reads as an overlay rather than clashing with page content underneath. Re-verified hover on all 3 items at mobile width and desktop hover (no regression). `/doer:dotest` + `tsc --noEmit` clean.
