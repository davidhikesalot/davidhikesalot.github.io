---
status: doing
based-on: (none — derived fresh from description, no TODO.md item)
---

# ux-refresh-dark-mode — Modernize the site's visual layer and add dark mode

## Problem / Requirements

davidhikesalot.github.io (React 18 + TS, CRA/react-scripts 5.0.1, react-bootstrap 2.6.0, FontAwesome 7.0.0 via react-fontawesome 0.2.3, SCSS with `sass` 1.58.3, date-fns, react-router-dom 6.30.1) has had no visual-design attention since its original build. The ask ("modernize the UX") was scoped down via inline grilling to a concrete brief:

1. **Visual refresh only, not an IA/feature overhaul.** No navigation restructuring, no new features (search/filter/etc.), no framework or dependency swap. Keep CRA + react-bootstrap + SCSS. This is typography, spacing, elevation/shadow, card/list treatment, hover/focus states, and transitions.
2. **Scope = every page + shared chrome**, so the whole site reads as one consistent system rather than a per-page patchwork:
   - Pages: `src/pages/hikes.page.tsx`, `parks.page.tsx`, `goals.page.tsx`, `plans.page.tsx` (+ `plans.page.scss`), `error.page.tsx`.
   - Shared chrome: `src/components/appheader.component.tsx` (+ `.scss`), `src/layouts/page.layout.tsx`.
   - Shared card/list components: `carddeck`, `hikedeck`, `parkdeck`, `ebrpgoal`, `hikelist`, `utils` (`.component.tsx` + `.component.scss` pairs).
   - Root styling: `src/App.scss` (root CSS custom properties, `.app` shell), `src/index.scss` (body font, tiled topo background image).
3. **Keep brand identity, evolve execution.** Do not propose a new color scheme or drop the current identity — blue heading `#3D6B8F` / hover `#3d6c8f83`, heading text `#D6D4D0`, content background `#D6D4D0` (currently the only 4 CSS custom properties, `src/App.scss:1-6`), and the tiled topo-map background (`src/index.scss:7-11`, `public/assets/img/bg-topo-square.png`). This plan refines the token set (spacing scale, elevation, typography hierarchy, radius, transitions) and card/list treatments around that identity — evolution, not rebrand.
4. **Dark mode is genuinely in scope** — a real scope addition, not just polish. Confirmed via grep: zero existing `prefers-color-scheme` / `data-theme` handling anywhere in `src/`. Required:
   - A second (dark) palette derived from/complementary to the existing brand colors.
   - A toggle, defaulting on first load to `prefers-color-scheme` if no stored preference exists.
   - Persistence across sessions (localStorage).

**Grounded findings that shape phasing and file list:**
- All 4 existing brand colors live as CSS custom properties on `:root` in `src/App.scss:1-6` — the natural seam for a token system and for a `data-theme` swap.
- `carddeck.component.scss` defines the base `.card` / `.card-deck` treatment (border, shadow, header/footer) that `hikedeck`, `parkdeck`, and `hikelist` all build on top of or duplicate (`hikelist.component.scss:14` reimplements a card-like `li` treatment independently rather than reusing `.card`). Any change to the base card system reshapes what the per-component overrides need to do — this is real causal coupling, not just breadth, and is why the plan is phased.
- **`hikelist.component.scss:19-30`'s `green`/`blue`/`black`/"unknown" difficulty-icon rules are dead CSS.** Verified via `grep -rn "hike-difficulty-icon" src/` — that class is never rendered anywhere; `hikelist.component.tsx`'s `<DifficultyIcon hike={hike} />` renders `utils.component.tsx`'s `DifficultyIcon`, which uses Bootstrap contextual classes (`text-success`/`text-primary`/`text-dark`) instead, with no class named `hike-difficulty-icon`. A straight "swap these 4 colors for tokens" fix would touch zero rendered pixels. The actual difficulty-icon (and favorite-icon, goal-status-icon, badge) colors sitewide come from **Bootstrap's CDN stylesheet** (`public/index.html:53`, `bootstrap@5.2.3`), via `text-success`/`text-primary`/`text-dark`/`text-danger` and `Badge bg="..."` in `utils.component.tsx`, `ebrpgoal.component.tsx` (`parkStatusIcons`), and `hikedeck.component.tsx` (`DifficultyIcon`/`FavoriteIcon` reuse) — none of it routed through this app's `--app-*` token system. Confirmed (fetched the actual CDN bundle) these resolve as `color: rgba(var(--bs-success-rgb), var(--bs-text-opacity))` etc., with `--bs-success-rgb`/`--bs-primary-rgb`/`--bs-dark-rgb`/`--bs-danger-rgb`/`--bs-secondary-rgb` defined once at `:root` — overridable by a same-or-higher-specificity `:root[data-theme="dark"]` rule regardless of stylesheet load order (`:root[data-theme="dark"]` beats bare `:root` on specificity). See `## Q1` — this reshapes Phase 0's mechanism scope and Phase 2's hikelist file entry (moved off the dead selector). Separately: `utils.component.tsx:72`'s `DifficultyIcon` already renders nothing (`?? <></>`) for an unrecognized difficulty — the "unknown" case needs no color token at all; the dead CSS's same-color "hide it" trick was a superseded earlier approach, not live behavior to preserve.
- `error.page.tsx:9` renders `<div className="App">` (capital A) — `src/App.scss:8` only styles `.app` (lowercase). This is a pre-existing class-name-case bug: the error page never gets the `.app` shell's `max-width`/margin/padding. Since this plan touches `error.page.tsx` anyway, fix it there rather than propagating a redesign onto a broken shell.
- `plans.page.scss` exists but is empty; `goals.page.tsx`, `parks.page.tsx`, `hikes.page.tsx` have no page-specific SCSS at all — they render shared deck/list components directly. So "the 4 pages" mostly means "verify the shared components read correctly under each page's real data," not separate per-page stylesheets to redesign.
- `App.tsx:26` already conditionally toggles a `loaded` class based on fetch state — the same component owns the root `.app` div, so it's the natural place to also own `document.documentElement.dataset.theme` initialization and host the theme toggle (via `AppHeader`, which `App.tsx:27` already renders).
- Services in this repo are plain exported functions in `src/services/*.service.tsx` (see `data.service.tsx`) — no class/singleton/context pattern. The new theme logic should mirror that: a plain `src/services/theme.service.tsx` module, not a new React Context provider, to match the existing idiom and avoid introducing a new pattern for one small piece of state.
- FontAwesome 7.0.0 free-solid-svg-icons already ships `faSun` / `faMoon` — no new icon dependency needed for the toggle.

## Plan

Three phases. Phase 0 is the foundation everything else depends on (token vocabulary + the dark-mode extension mechanism itself) and must land and be reviewed before any visual-application phase starts, since it fixes the CSS variable names and theming API the later phases write against. Phase 1 and 2 split along the causal-coupling seam identified above: Phase 1 redesigns the base card system + chrome that Phase 2's per-component overrides build on.

### Phase 0: Design tokens + dark-mode mechanism (foundation)

Establish the full token vocabulary and the theme-switching mechanism. No visual redesign of any page/component yet beyond what's needed to prove the mechanism works — that's Phases 1-2.

**(Q2, resolved) Zero-th step, before any Phase 0 code:** `.claude/dotest.txt` is absent, which hard-fails the `/doer:dotest` gate at every phase boundary (doer rule 10). Separately, `src/App.test.tsx` is stale CRA boilerplate (`screen.getByText(/learn react/i)`) that already fails today, unrelated to this plan — confirmed via `grep -rn "learn react" src public` that no such text exists anywhere in the app. Fix both before writing any Phase 0 code: create `.claude/dotest.txt` with `npm test -- --watchAll=false`, and fix/remove `App.test.tsx` (replace its assertion with something real, e.g. asserting `AppHeader` renders, or delete the file) so the gate isn't permanently broken by an unrelated pre-existing failure — this matters because Phase 0 adds a real test (`theme.service.test.tsx`) that needs the gate to actually run.

**Extension mechanism (named explicitly per plan.md's rule — this is the load-bearing structural decision):**
- CSS custom properties remain the mechanism (matches existing `App.scss:1-6` idiom). Expand the token set on `:root` in `src/App.scss` to cover: brand colors (existing 4, kept as-is for light), a full semantic layer (text-primary/secondary, border, shadow-color, link, surface/background layers, difficulty-easy/moderate/hard — no "unknown" token needed, see Problem/Requirements finding above), a spacing scale (e.g. `--space-1` through `--space-5`), a radius scale, and transition duration/easing tokens.
- **(Q1, resolved) Global retint:** this phase's `:root[data-theme="dark"]` block also overrides Bootstrap's CDN-loaded contextual utility colors — `--bs-success-rgb`/`--bs-primary-rgb`/`--bs-dark-rgb`/`--bs-danger-rgb`/`--bs-secondary-rgb` — so `text-success`/`text-dark`/etc. (difficulty icons, favorite icon, goal-status icons, badges — see Problem/Requirements) go dark-safe sitewide with zero component-file changes. `react-bootstrap` stays as the styling library (a stack swap to Tailwind or similar was considered and explicitly deferred to a possible future separate plan — out of scope here).
- Dark values live in a `:root[data-theme="dark"]` override block (same file, directly below the light `:root` block) — only the tokens whose dark value differs need overriding; unset ones inherit the light value.
- `document.documentElement.dataset.theme` is the runtime switch. Set once on load, updated on toggle. No CSS-in-JS, no new state-management library.
- `src/services/theme.service.tsx` (new, mirrors `data.service.tsx`'s plain-function style) exports:
  - `getInitialTheme(): "light" | "dark"` — resolution order: `localStorage.getItem(THEME_STORAGE_KEY)` if present and valid, else `window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"`, else `"light"`.
  - `setTheme(theme)` — writes `localStorage`, sets `document.documentElement.dataset.theme`.
  - `THEME_STORAGE_KEY` constant.
- `App.tsx` calls `getInitialTheme()` once (e.g. alongside the existing `useEffect` that fetches site data) and applies it before/without waiting on the data fetch, so there's no flash of the wrong theme while `isLoaded` is false.
- A `ThemeToggle` UI lives in `AppHeader` (`appheader.component.tsx`, in the existing right-hand `<Nav>` alongside the Facebook/GitHub `NavLinkWithTooltip` icons) — a button using `faSun`/`faMoon` that calls `setTheme` and re-renders its own icon from current theme state.
- `src/index.scss`'s tiled topo background (`index.scss:7-11`) needs a dark-mode-aware treatment decided here (not deferred) since it's the single most visible cross-theme surface: keep the same tiled PNG, apply a themed tint via a `background-color` + `background-blend-mode` pairing driven by a new `--app-body-tint` token, rather than inverting/filtering the image (filter/invert risks an ugly, unreadable result). Concrete starting recipe (tune the exact numbers visually during `npm start`, per this phase's Verify step — not an open fork, just a tuning pass): `background-color: var(--app-body-tint); background-blend-mode: multiply;` with `--app-body-tint: transparent` in light (no change from today) and `--app-body-tint: rgba(20, 24, 28, 0.55)` in dark (multiply always darkens, so one blend mode covers both directions — only the tint color/opacity needs adjusting per theme). The mechanism (token-driven blend layer, same image asset) is the locked decision; only the tint's exact rgba value is a visual-tuning knob, checked against this phase's own acceptance criterion ("Body's topo background remains visible... in both themes").

**Files:**
- `.claude/dotest.txt` (new) — `npm test -- --watchAll=false` (zero-th step, Q2).
- `src/App.test.tsx` — fix or remove the stale `"learn react"` assertion (zero-th step, Q2).
- `src/App.scss:1-6` — expand `:root` token set; add `:root[data-theme="dark"]` override block, including the `--bs-success-rgb`/`--bs-primary-rgb`/`--bs-dark-rgb`/`--bs-danger-rgb`/`--bs-secondary-rgb` retint (Q1).
- `src/index.scss:1-12` — dark-aware body background treatment using new tint token.
- `src/services/theme.service.tsx` (new) — `getInitialTheme`, `setTheme`, `THEME_STORAGE_KEY`.
- `src/App.tsx:10-22` — call `getInitialTheme()`/apply theme on mount.
- `src/components/appheader.component.tsx` — add `ThemeToggle` button (faSun/faMoon) to the right-hand `<Nav>`.
- `src/components/appheader.component.scss` — style the toggle button (hover/focus state, sizing consistent with existing nav icons).

**Acceptance Criteria:**
- [ ] `/doer:dotest` gate passes (not hard-failing on a missing `.claude/dotest.txt` or the stale `App.test.tsx`).
- [ ] Loading the site with no prior localStorage value and OS set to dark renders in dark theme; OS set to light renders in light theme.
- [ ] Toggling the theme updates `document.documentElement.dataset.theme` immediately and persists across a full page reload (localStorage).
- [ ] All 4 original brand-color tokens still resolve to their current light-mode hex values — no accidental rebrand.
- [ ] No flash of unthemed content: theme is applied before the loading spinner / first paint of content, not after `isLoaded` flips.
- [ ] Body's topo background remains visible (not fully obscured or inverted-to-noise) in both themes.
- [ ] Bootstrap contextual classes (`text-success`/`text-primary`/`text-dark`/`text-danger`, `Badge bg="..."`) render dark-safe automatically in dark mode via the `--bs-*-rgb` retint, with no per-component changes.

**Verify:** `npm start`, toggle OS appearance + the in-app toggle, confirm via devtools that `--app-*` custom properties resolve to the expected dark/light values in each state; reload and confirm persistence.

**Tests:**
- `src/services/theme.service.test.tsx` (new) — `getInitialTheme()` resolution order: explicit localStorage value wins over `matchMedia`; falls back to `matchMedia` when localStorage is empty; falls back to `"light"` when neither is available. Mock `window.matchMedia` and `localStorage` per case — don't just assert one happy path, assert the *precedence* (a test that passes whether or not localStorage is actually consulted first is not a good test here).

### Phase 1: Shared chrome + base card system

Apply the Phase 0 tokens to the site shell and the base `.card`/`.card-deck` system everything else extends. Fix the `error.page.tsx` class-case bug while it's being touched for the redesign.

**Files:**
- `src/App.scss` — `.app` shell spacing/max-width using new spacing tokens. **Also adds a typography token scale to `:root`** (e.g. `--app-font-size-sm/base/lg/xl/xxl`, `--app-line-height-base/tight`, `--app-font-weight-bold`) — Phase 0 didn't create one (confirmed: no `--app-font-*`/`--app-line-height-*` tokens exist in the shipped `App.scss`), but `index.scss`'s typography pass (below) needs tokens to apply; mirror the existing `--app-space-*` scale's granularity; same value in both themes (typography isn't theme-dependent, no dark override needed).
- `src/index.scss` — typography scale (font sizes/weights/line-height) beyond the current bare `font-family` reset, using the tokens added above.
- `src/components/appheader.component.scss` / `.tsx` — nav hover/focus states, transitions, spacing using new tokens.
- `src/components/carddeck.component.scss` — card elevation (replace the flat `box-shadow: 2px 2px 2px 1px rgba(0,0,0,0.2)` with token-driven elevation that has a sane dark-mode equivalent — a flat black shadow disappears on a dark surface), border-radius, hover/transition states, using the new token set. **Also repoint `.card`'s `background-color`** from `--app-content-background-color` to `--app-surface-background` (`carddeck.component.scss:49`) — the former is intentionally left un-overridden in `:root[data-theme="dark"]` per Phase 0's Decisions (brand identity preserved verbatim), so without this swap `.card` stays light-toned (`#D6D4D0`) in dark mode regardless of the elevation work.
- `src/pages/error.page.tsx` — fix `className="App"` → `className="app loaded"` (matches `App.scss:8`'s `.app` + `.loaded` selector) so the error page gets the same shell and reads as part of the same system; apply the refreshed card treatment to its content.
- `src/components/parkdeck.component.scss:15` — (Q3) repoint `.dropdown-menu` `background-color` from `--app-content-background-color` to `--app-surface-background`, same rationale as the `.card` swap above. Everything else in this file (dropdown polish beyond this one property) stays Phase 2.
- `src/components/hikelist.component.scss:15` — (Q3) repoint the live `ul.hike-list li` `background-color` from `--app-content-background-color` to `--app-surface-background`. The dead `.hike-difficulty-icon` color rules (lines 19-30) stay Phase 2 (deletion), and list spacing/layout stays Phase 2.

**Out of Scope:** `hikedeck`, `ebrpgoal`, `utils` component styling; all of `parkdeck`/`hikelist` beyond the single `background-color` swaps above (dropdown polish, list spacing, dead-CSS deletion stay Phase 2).

**Acceptance Criteria:**
- [ ] `.card` / `.card-header` / `.card-footer` render with refreshed elevation, radius, and spacing in both themes; box-shadow is *actually visible* (not merely present in the DOM) against the dark `--app-surface-background` (`#1E2227`) — a black shadow can read as invisible against an already-dark surface. If the shipped dark `--app-shadow-color` doesn't read, retune its value in `App.scss` (already in this phase's file scope) rather than treating "token exists" as done; border may need to carry more of the elevation cue in dark mode.
- [ ] Body text and headings use the new typographic scale (visible font-size/weight hierarchy, not just the bare `font-family` reset) — check at least one heading + body-copy pairing.
- [ ] Nav links in `AppHeader` have visible hover and keyboard-focus states (not just `:hover`), in both themes.
- [ ] `error.page.tsx` renders inside the same `.app` shell (constrained width, correct margin/padding) as every other page, in both themes.

**Verify:** `npm start`; visually inspect `AppHeader` and any one card-bearing page in both themes — confirm card elevation is *perceptible* against the dark surface (retune `--app-shadow-color` if not) and that heading/body typography reads as a scale; navigate to a broken route (or temporarily throw) to inspect `error.page.tsx` inside the shell.

### Phase 2: Per-component and per-page pass

Apply the Phase 1 card system + Phase 0 tokens to the deck/list components and confirm each of the 4 route pages reads correctly with real data. Delete `hikelist.component.scss`'s dead difficulty-color CSS. Difficulty/favorite/goal-status icon colors (Bootstrap `text-success`/`text-primary`/`text-dark`/`text-danger` utility classes) are dark-safe from Phase 0's global `--bs-*-rgb` retint (Q1) — no work needed there.

**(Phase 2 gate, direct edit — not a Q) Correction to the above:** Q1's retint does NOT cover every Bootstrap-component color. Confirmed via the fetched Bootstrap 5.2.3 bundle (`public/index.html:53`): `--bs-list-group-color`/`--bs-list-group-bg` and `--bs-dropdown-link-color`/`--bs-dropdown-color`/`--bs-dropdown-bg` are redeclared directly on `.list-group`/`.dropdown-menu` themselves (component-local, not just `:root`-default) — unlike Q1's five `-rgb` vars, which are declared exactly once, at `:root`, with zero component-level redeclaration (that's why Q1's flat `:root[data-theme="dark"]` retint worked cleanly for those). A same-shaped extension of Q1's retint list would be shadowed by the component's own local declaration and silently no-op. This left 3 concrete, screenshot-confirmed (headless Chromium + human's own browser) dark-mode legibility bugs unaddressed:
- Hike-list item text (name/park name + distance/elevation stats) in both the Parks page's embedded `HikeList` and the Plans page's `HikeListCard` (`src/pages/plans.page.tsx:14`) — `hikelist.component.scss:15`'s Phase-1 `background-color: var(--app-surface-background)` swap on `ul.hike-list li` never got a matching `color` override, so text still resolves to Bootstrap's un-retinted `.list-group`-scoped `--bs-list-group-color` (`#212529`) — near-invisible against the now-dark surface.
- Parks dropdown item text (`parkdeck.component.scss`'s `.dropdown-item`s, rendered via `Dropdown.Item` in `parkdeck.component.tsx:147-161`) — same `.dropdown-menu`-local-shadow pattern; the dropdown container's background was already swapped to `--app-surface-background` in Phase 1, but item text color was not addressed.
- `DistanceBadge`/`ElevationBadge`'s `.badge-transparent` class (`utils.component.scss:9`) explicitly reads the same un-retinted `--bs-list-group-color`.

**(Q4, resolved) Fix mechanism:** per-component `color: var(--app-text-primary)` overrides at all 3 read sites (not a `:root` Bootstrap-var retint — `.list-group`/`.dropdown-menu` redeclare their color vars locally on themselves, which would shadow and silently no-op a Q1-style retint, and that approach still couldn't reach the `.badge-transparent` site regardless). Same per-component-override pattern Q3 already established once a Bootstrap var stops being a clean single-`:root`-declaration case. The legibility requirement itself is locked below as an Acceptance Criterion, not left implicit.

**Files:**
- `src/components/hikedeck.component.scss` / `.tsx` — apply refreshed card system; spacing/typography pass.
- `src/components/parkdeck.component.scss` / `.tsx` — dropdown styling using new tokens; card system; fix `.dropdown-item` text-color bug (Q4).
- `src/components/ebrpgoal.component.scss` / `.tsx` — list/column spacing pass.
- `src/components/hikelist.component.scss` — delete the dead `.easy-hike .hike-difficulty-icon` / `.moderate-hike` / `.hard-hike` / `.unknown-hike` rules (`hikelist.component.scss:19-30`, confirmed unreferenced — see Problem/Requirements finding); apply card-adjacent styling (radius, border) consistent with Phase 1's card system to `ul.hike-list li` instead; fix `ul.hike-list li` text-color bug (Q4) — the existing `background-color` swap (`hikelist.component.scss:15`) needs a matching `color` fix. While touching this file, also consider retiring `.hike-info a.col:hover`'s hardcoded `#cecece75` in favor of a token (mechanical, not gated on — see Verify).
- `src/components/utils.component.scss` / `.tsx` — badge styling pass using new tokens (spacing/sizing only); fix `.badge-transparent`'s (`utils.component.scss:9`) text-color bug per Q4 — difficulty/favorite/goal-status colors elsewhere in this file are unaffected (already dark-safe via Q1).
- `src/pages/hikes.page.tsx`, `parks.page.tsx`, `goals.page.tsx`, `plans.page.tsx` (+ `plans.page.scss`) — no expected structural changes (they're thin wrappers over the components above); verify each renders correctly under the new system with real fetched data, add page-level SCSS only if something doesn't fall out of the component-level changes.

**Acceptance Criteria:**
- [ ] Hike difficulty icons (easy/moderate/hard — "unknown" renders no icon at all, `utils.component.tsx:72`, so nothing to check there) are legible with sufficient contrast in both light and dark themes.
- [ ] `HikeDeck`, `ParkDeck`, `EastBayChallengePage` (goals), and `HikeListCard` (plans) all render using the Phase 1 card system with no visual regressions against real fetched data.
- [ ] **(New — closes a gap Phase 0/1 left open; screenshot-confirmed regression.)** Hike-list item text — hike name, park name, and distance/elevation stats (`hikelist.component.scss`/`hikelist.component.tsx`, both the Parks page's embedded `HikeList` and the Plans page's `HikeListCard`) — is legible (sufficient contrast) against the dark surface background in dark mode.
- [ ] Parks dropdown (`parkdeck.component.scss:5-23`) — both the container background AND each dropdown item's text — is legible and themed correctly in dark mode.
- [ ] Badges (`utils.component.scss`), including `DistanceBadge`/`ElevationBadge`'s `.badge-transparent` variant, read correctly (visible text against their background) in both themes.

**Out of Scope:** any change to data-fetching, routing, or page composition — pages only get styling/token changes, no structural/JSX-logic changes beyond what's needed to hang the new classes.

**Verify:** `npm start`; visit `/hikes`, `/parks`, `/goals`, `/plans` in both themes with real data; toggle theme on each — specifically check hike-list row text (Parks + Plans pages) and Parks dropdown item text against the dark surface, not just container backgrounds (the two areas Phase 0/1 missed).

## Files
(See per-phase `**Files:**` above — phase-scoped since this is a phased plan.)

## Acceptance Criteria
(See per-phase `**Acceptance Criteria:**` above.)

## Verify
(See per-phase `**Verify:**` above. No automated visual-regression tooling exists in this repo (CRA/react-scripts, no Storybook/Percy/Chromatic) — verification is manual (`npm start`) plus the Phase 0 unit test for theme resolution logic.)

## Tests
- `src/services/theme.service.test.tsx` (new, Phase 0) — see Phase 0 acceptance criteria above for the precedence cases required.
- No other new automated tests planned — remaining phases are CSS/JSX styling changes without new business logic; existing `react-scripts test` / testing-library setup stays as-is. If `rplan` determines specific interaction logic (e.g. the toggle's click handler) warrants a component test, add it at that gate.

## Out of Scope
- IA/navigation restructuring, new features (search, filtering, etc.), CRA/react-bootstrap/SCSS migration to any other stack.
- New UI component libraries — react-bootstrap 2.6.0 stays; no new dependency for theming beyond the plain `theme.service.tsx` module.
- Automated visual-regression tooling setup (out of scope for this pass; manual verification only).

## TODO
- [x] Phase 0: Design tokens + dark-mode mechanism
- [x] Phase 1: Shared chrome + base card system
- [x] Phase 2: Per-component and per-page pass

## Decisions
- `hikelist.component.scss:19-30`'s difficulty-icon color rules are dead CSS (target a class never rendered) — deleted in Phase 2 rather than "token-ified"; the live rendering path is Bootstrap-utility-class-driven (`utils.component.tsx`, `ebrpgoal.component.tsx`). (Author, rplan initial pass — grep-verified, not a judgment call.)
- No `--app-difficulty-unknown` token needed — `utils.component.tsx:72`'s `DifficultyIcon` already renders nothing for an unrecognized difficulty. (Author, rplan initial pass.)
- Topo-background dark tint: `background-blend-mode: multiply` with a `--app-body-tint` token (`transparent` light / `rgba(20,24,28,0.55)` dark starting point) — mechanism locked, exact rgba is a visual-tuning knob checked at Phase 0's Verify step, not a fork. (Author, rplan initial pass.)
- (Q1) Retint Bootstrap's CDN contextual colors (`--bs-success-rgb`/`--bs-primary-rgb`/`--bs-dark-rgb`/`--bs-danger-rgb`/`--bs-secondary-rgb`) globally in Phase 0's `:root[data-theme="dark"]` block, rather than per-component in Phase 2 — cheaper (one file), and every current Bootstrap-contextual-color usage in this repo is one of the things this plan already wants dark-safe. `react-bootstrap` stays as the styling library; a stack swap (e.g. to Tailwind) was raised and explicitly deferred to a possible future separate plan.
- (Q2) Create `.claude/dotest.txt` (`npm test -- --watchAll=false`) and fix/remove the stale `App.test.tsx` as a zero-th step of Phase 0, rather than an empty no-op opt-out — Phase 0 adds a real test (`theme.service.test.tsx`) that needs the gate to actually run.
- (Q3) Pull `parkdeck.component.scss:15` and `hikelist.component.scss:15`'s `--app-content-background-color` → `--app-surface-background` swap into Phase 1 (alongside the already-Phase-1 `carddeck.component.scss:49` swap), rather than leaving them in Phase 2 — 2-line mechanical change, and it removes a false-negative signal from Phase 1's own dark-mode Verify step.
- (Q4) Fix the un-retintable `.list-group`/`.dropdown-menu`/`.badge-transparent` text-color bug (hike-list rows, Parks dropdown items, distance/elevation badges all render near-invisible in dark mode) via per-component `color: var(--app-text-primary)` overrides at the 3 read sites, rather than a scoped Bootstrap-var retint — the retint approach would be shadowed by Bootstrap's own component-local var redeclaration and couldn't reach the badge case anyway; matches the precedent Q3 set.
- (Phase 1 gate, direct edit — not a Q) Phase 1's `index.scss` typography-scale bullet referenced "new tokens" that don't exist — Phase 0's actual token set (verified against shipped `App.scss`) has spacing/radius/transition/semantic-color tokens but no font-size/line-height/weight scale. Added typography token creation to Phase 1's `App.scss` bullet rather than opening a Q — no design fork, just a plan omission (Phase 0 never asked for these either), same latitude as the existing `--app-space-*` scale's non-prescriptive `e.g.` values.
- (Phase 1 gate, direct edit — not a Q) Phase 1's `carddeck.component.scss` bullet didn't call out the `.card` `background-color` token swap (`--app-content-background-color` → `--app-surface-background`) even though it's the base card system Phase 1 already owns and the old var is intentionally un-overridden in dark (Phase 0 Decisions) — without the swap `.card` silently stays light-toned in dark mode. Added explicitly; not a fork, it's required for Phase 1's own "legible in both themes" acceptance bar to be satisfiable at all.
- (Phase 1 gate, direct edit — not a Q) Tightened Phase 1's shadow/border AC + Verify to explicitly require the box-shadow be *visually perceptible* against the dark surface (not just present as a CSS value) and name `--app-shadow-color` retuning as the fallback if not — same "concrete value, tune visually" pattern Phase 0 established for `--app-body-tint`, not a new fork.

## Status
`doing` — Phase 0 in progress on branch `d5.ux-refresh-dark-mode`.
