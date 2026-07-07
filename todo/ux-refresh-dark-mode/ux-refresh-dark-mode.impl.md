---
name: ux-refresh-dark-mode.impl.md
based-on: 7e8cd82
---

# ux-refresh-dark-mode — Activity Log

[Plan: todo/ux-refresh-dark-mode/ux-refresh-dark-mode.plan.md] [Branch: d5.ux-refresh-dark-mode]

## Log

- `.claude/dotest.txt` created (`npm test -- --watchAll=false`), Q2 zero-th step.
- `src/App.test.tsx` — replaced stale "learn react" assertion; mocks `fetchSiteData` (never-resolving promise) and asserts `AppHeader` nav renders (`Goals` link). Avoids real network calls in test env.
- `npm ci` run — node_modules was absent, installed from `package-lock.json`.
- `src/services/theme.service.tsx` (new) — `getInitialTheme`, `setTheme`, `THEME_STORAGE_KEY`, `Theme` type. Precedence: localStorage > matchMedia > "light".
- `src/services/theme.service.test.tsx` (new) — precedence tests (localStorage wins, matchMedia fallback, light default) + `setTheme` persistence test.
- `src/App.scss:1-70` — expanded `:root` token set (semantic text/border/shadow/link/surface, difficulty tokens aliasing `rgb(var(--bs-*-rgb))`, spacing/radius/transition scales, `--app-body-tint`). Added `:root[data-theme="dark"]` block: Bootstrap `--bs-*-rgb` retint (Q1) + dark values for the new semantic tokens. Original 4 brand tokens (`--app-heading-*`, `--app-content-background-color`) left unoverridden in dark — brand identity preserved verbatim in both themes per Decisions; new `--app-surface-background`/`-alt` tokens are what later phases will wire components to instead.
- `src/index.scss:7-13` — `background-color: var(--app-body-tint); background-blend-mode: multiply;` added to `body`, per plan's locked mechanism.
- `src/App.tsx:10-27` — `useLayoutEffect(() => { document.documentElement.dataset.theme = getInitialTheme(); }, [])`, separate from the data-fetch effect — runs synchronously before paint, independent of `isLoaded`.
- `src/components/appheader.component.tsx` — added `ThemeToggle` (new internal component, not `NavLinkWithTooltip` — that defaults to an anchor with `href=""`, wrong semantics for an action button). Uses `Nav.Link as="button"` + `OverlayTrigger`/`Tooltip` (same pattern as existing nav icons), toggles `faSun`/`faMoon`, calls `setTheme` + local state.
- `src/components/appheader.component.scss` — `.theme-toggle-button` style nested under `.nav-link`: background reset, hover (heading-hover token), `:focus-visible` outline.

Next: run `/doer:dotest`.

- Ran `.claude/dotest.txt`'s command (`npm test -- --watchAll=false`). Hit two pre-existing/incidental issues while fixing the zero-th step, both root-caused and fixed (not worked around):
  1. `App.tsx`'s `import Stack from "react-bootstrap/esm/Stack"` broke Jest's transform (`SyntaxError: Cannot use import statement outside a module` — ESM subpath bypasses `react-bootstrap`'s CJS `main` field, ignored by CRA's default `transformIgnorePatterns`). Fixed by switching to `import { Stack } from "react-bootstrap"` (same CJS export, root package already imported that way elsewhere in the file). Pre-existing bug, unrelated to Q2/Phase 0, but blocked the gate — fixed at the import.
  2. CRA's Jest config sets `resetMocks: true`, which strips a `jest.fn()`'s inline implementation before each test runs. My first `App.test.tsx` draft set the never-resolving-promise mock inside the `jest.mock(...)` factory, which the reset wiped (`fetchSiteData()` returned `undefined`). Fixed by mocking with a bare `jest.fn()` in the factory and calling `.mockReturnValue(new Promise(() => {}))` inside the test body (after the per-test reset).
  3. `AppHeader`'s `LinkContainer`/`useNavigate` needs Router context — wrapped the test render in `<MemoryRouter>`.
- `npx tsc --noEmit` — clean, no type errors.
- `npm start` (BROWSER=none) — compiled clean (1 pre-existing unrelated ESLint warning, `hikedeck.component.tsx:2` unused `Stack` import, not touched this phase). Verified via `curl` that both `--app-body-tint` values (`transparent` / `rgba(20, 24, 28, 0.55)`) are present in the compiled bundle. Server stopped after check.
- Final gate run: `Test Suites: 2 passed, 2 total / Tests: 5 passed, 5 total`, exit 0.

Next-phase needs: Phase 1 should be aware that `--app-content-background-color`/`--app-heading-*` (the original 4 brand tokens) are intentionally NOT overridden in `:root[data-theme="dark"]` — they resolve identically in both themes. The new `--app-surface-background` / `--app-surface-background-alt` tokens are what Phase 1's card-system rewrite should switch components to for a real dark surface (currently `carddeck`/`parkdeck`/`hikelist`/`hikedeck` still reference the old `--app-content-background-color` var directly and will look unchanged/light-toned in dark mode until Phase 1 repoints them).

- `rdo ux-refresh-dark-mode --done` — no items raised in `.impl.review.md`; closed out. Re-ran `/doer:dotest`: 2 suites / 5 tests passed, exit 0. Plan `## TODO` Phase 0 checked off.

Next: `rplan ux-refresh-dark-mode phase-1` (gate review) before Phase 1 `do`.

# Phase 1

- `rplan ux-refresh-dark-mode phase-1` gate review complete: Q3 resolved (pulled `parkdeck.component.scss:15`/`hikelist.component.scss:15` token swap into Phase 1); plan's Phase 1 section also gained a typography-token fix, base `.card` background-color repoint, and a tightened shadow-visibility acceptance criterion (all direct author fixes, no Q needed).

Next: Starting Phase 1 `do`.

- `src/App.scss:38-51` — added typography token scale (`--app-font-size-sm/base/lg/xl/xxl`, `--app-line-height-base/tight`, `--app-font-weight-bold`), same value both themes, per plan's Phase-1-gate direct edit.
- `src/App.scss:67-71` — retuned dark `--app-shadow-color` from `rgba(0,0,0,0.6)` to `rgba(0,0,0,0.75)`; a flat low-opacity black was imperceptible against `--app-surface-background` (`#1E2227`). Paired with carddeck's larger blur radius (below) to make elevation actually read.
- `src/index.scss:1-34` — applied typography scale to `body` (font-size/line-height/color) and added `h1`-`h6` weight/line-height + `h1`/`h2`/`h3` size rules, beyond the prior bare `font-family` reset.
- `src/components/carddeck.component.scss` — `.card` background-color repointed `--app-content-background-color` → `--app-surface-background` (so it's actually dark-toned in dark mode); added `border-radius: var(--app-radius-md)`; box-shadow reworked from flat `2px 2px 2px 1px` to soft `0 var(--app-space-2) var(--app-space-4) var(--app-shadow-color)` (offset/blur via spacing tokens); added `transition: box-shadow`; added `.card-deck .card:hover` shadow lift (scoped to deck cards only, not the lone AppHeader/error-page card wrappers, since those aren't clickable as a whole unit); swapped remaining hardcoded spacing/font-size values (`.card-deck-header`, `.row` gap, `.col` margin, card-header/footer padding+font-size, card-body font-size) to the new spacing/typography tokens.
- `src/pages/error.page.tsx:9` — fixed `className="App"` → `className="app loaded"` (matches `App.scss`'s lowercase `.app`/`.loaded` selectors; pre-existing bug, error page now gets the shared shell).
- `src/components/parkdeck.component.scss:15` — `.dropdown-menu` background-color repointed `--app-content-background-color` → `--app-surface-background` (Q3 swap). No other property in this file touched.
- `src/components/hikelist.component.scss:15` — `ul.hike-list li` background-color repointed `--app-content-background-color` → `--app-surface-background` (Q3 swap). Lines 19-30 (dead `.hike-difficulty-icon` rules) and list spacing untouched, per Out-of-Scope.
- `src/components/appheader.component.scss` — moved hover/focus-visible/transition from `.theme-toggle-button`-only to the general `.nav-link` (so Goals/Parks/Hikes/Plans/Facebook/GitHub links get the same states, not just the theme toggle); `.theme-toggle-button` now only carries its unique background/border/cursor resets. `header`'s `margin-top` swapped to `var(--app-space-3)`.

- `rdo ux-refresh-dark-mode --done` — no items raised in `.impl.review.md`; closed out. Re-ran `/doer:dotest`: 2 suites / 5 tests passed, exit 0. Plan `## TODO` Phase 1 checked off.

Next: `rplan ux-refresh-dark-mode phase-2` (gate review) before Phase 2 `do`.
  - Deviation: left `.nav-link`'s `border-left: 1px solid #999999` hardcoded rather than swapping to `var(--app-border-color)` — that token's low-alpha values (0.15) are tuned for neutral surfaces, not the saturated brand-blue navbar backdrop; swapping risked the divider becoming nearly invisible in both themes. Not part of any acceptance criterion, so left as-is rather than risk a visual regression.

Next: run `/doer:dotest`.

- `npm test -- --watchAll=false` — 2 suites / 5 tests passed, exit 0 (no test changes needed this phase; pure CSS/JSX styling).
- `npx tsc --noEmit` — clean.
- `npm start` (BROWSER=none) — compiled clean, no new warnings. Verified via bundle.js: `--app-font-size-xxl: 2rem` present; `--app-shadow-color` resolves to `rgba(0, 0, 0, 0.2)` (light) and `rgba(0, 0, 0, 0.75)` (dark, retuned this phase); `"app loaded"` string present (error page fix compiled in). Server stopped after check.

Next: `rdo ux-refresh-dark-mode --done` (Phase 1 gate review), then `rplan ux-refresh-dark-mode phase-2` before Phase 2 `do`.

- `rdo ux-refresh-dark-mode --done` — no items raised; closed out. Re-ran `/doer:dotest`: 2 suites / 5 tests passed. Plan `## TODO` Phase 1 checked off.

# Phase 2

- `rplan ux-refresh-dark-mode phase-2` gate review complete (retried once after a first attempt hit an API session-limit error mid-task with no files written): Q4 resolved — a real dark-mode text-legibility bug (hike-list rows on Parks/Plans pages, Parks dropdown items, and `.badge-transparent` all render near-invisible) fixed via per-component `color: var(--app-text-primary)` overrides at `hikelist.component.scss:15`, a new `.dropdown-item` rule in `parkdeck.component.scss`, and `utils.component.scss:9`, rather than a Bootstrap-var retint (which would be shadowed by `.list-group`/`.dropdown-menu`'s own local var redeclaration). Phase 2's plan section also gained 3 new locked Acceptance Criteria for this and a corrected Files list.

Next: Starting Phase 2 `do`.

- `rdo ux-refresh-dark-mode --done` — no items raised in `.impl.review.md`; closed out. Re-ran `/doer:dotest`: 2 suites / 5 tests passed, exit 0. Plan `## TODO` Phase 2 checked off — all 3 phases now complete.

Next: `done ux-refresh-dark-mode` to verify and close the plan.

- Human spotted a 4th dark-mode legibility bug during final review (same class as Q4, but not caught by the Phase 2 gate since `App.tsx` wasn't in that phase's file list): the loading `ClimbingBoxLoader` (`App.tsx:45`) hardcoded `color="var(--app-heading-background-color)"` — the brand blue, intentionally un-overridden in dark mode per Phase 0's Decisions — rendering low-contrast against the now-dark, tinted body background.
- First fix attempt swapped to `var(--app-text-primary)` directly, but human clarified: the blue was fine (good, in fact should) in light mode — matches the card-header color — only dark mode needed to change. Corrected: added a new `--app-spinner-color` token (`App.scss`) — light value `var(--app-heading-background-color)` (brand blue, unchanged), dark value `var(--app-text-primary)` (`#E8E6E3`, the already-approved dark legibility color). `App.tsx:45` now reads `color="var(--app-spinner-color)"`. Re-ran `/doer:dotest`: 2 suites / 5 tests passed, exit 0.

- `src/components/hikelist.component.scss` — deleted dead `.easy-hike`/`.moderate-hike`/`.hard-hike`/`.unknown-hike` `.hike-difficulty-icon` rules (lines 19-30, confirmed unreferenced). Added `color: var(--app-text-primary)` to `ul.hike-list li` (Q4 fix, site 1). Card-adjacent styling: `border-radius: 6px` → `var(--app-radius-sm)`; mechanical em→token swaps on `margin-bottom`/`padding` (equivalent values). Left `.hike-info a.col:hover`'s hardcoded `#cecece75` as-is — no existing token models a neutral hover-tint overlay and this file isn't in scope to add one to `App.scss`; not gated on any acceptance criterion.
- `src/components/parkdeck.component.scss` — added `.dropdown-item` + `.dropdown-item:hover` under the existing `+ .dropdown-menu` nesting, `color: var(--app-text-primary)` (Q4 fix, site 2), scoped to the Parks dropdown only (not a global `.dropdown-item` rule). Token pass: `#parks-dropdown`'s `font-size: small`/`padding: 0.25em 0.5em` → `var(--app-font-size-sm)`/`var(--app-space-1) var(--app-space-2)`; `.card-deck` `gap: 0.25em` → `var(--app-space-1)`; `.card-footer` `font-size: smaller` → `var(--app-font-size-sm)`. No `.tsx` change needed — `Dropdown.Item` already renders the `.dropdown-item` class Bootstrap-side.
- `src/components/utils.component.scss` — `.badge-transparent` `color: var(--bs-list-group-color)` → `var(--app-text-primary)` (Q4 fix, site 3). `.badge`'s padding already references Bootstrap's own `--bs-badge-*` vars appropriately; left as-is rather than swapping to the app spacing scale (font-size especially — Bootstrap's default `0.75em` vs our `--app-font-size-sm` `0.875rem` aren't equivalent, risk of a visual-size regression with no acceptance criterion requiring it). No `.tsx` change needed.
- `src/components/hikedeck.component.scss` — `.card-footer`'s `font-size: unset !important` (stale comment "set to smaller globally") → explicit `var(--app-font-size-sm) !important`, matching the comment's actual intent. Added `padding`/`border-radius`/hover `transition` tokens to `.card-header a:has(svg)` (the map/post icon links) for a card-adjacent hover affordance. No `.tsx` change needed.
- `src/components/ebrpgoal.component.scss` — added `margin-bottom: var(--app-space-4)` between the three `.ebrp-goal-list` blocks (Completed/In Progress/Not Started), `gap: var(--app-space-2)` on the multi-column `ul`, `margin-bottom: var(--app-space-1)` on `li`. No `.tsx` change needed — purely spacing.
- Pages (`hikes.page.tsx`, `parks.page.tsx`, `goals.page.tsx`, `plans.page.tsx`/`plans.page.scss`) — read all 4; confirmed thin wrappers with no page-specific styling gaps (`plans.page.scss` still empty). No changes made — nothing needed hanging new classes.

Next: run `/doer:dotest`.

- `npm test -- --watchAll=false` — 2 suites / 5 tests passed, exit 0 (no test changes needed; pure CSS styling this phase).
- `npx tsc --noEmit` — clean.
- `npm start` (BROWSER=none) — compiled clean, no new ESLint warnings. Verified via bundle.js source: dead `.hike-difficulty-icon` color rules absent; `ul.hike-list li { ...; color: var(--app-text-primary); ... }` present; `#parks-dropdown + .dropdown-menu .dropdown-item` (+ `:hover`) with `color: var(--app-text-primary)` present; `.badge-transparent { ...; color: var(--app-text-primary); }` present. Server stopped after check.

Next: `rdo ux-refresh-dark-mode --done` (Phase 2 gate review), then `done ux-refresh-dark-mode` to close out the plan.
