---
author: Agent
reviewer: Human
status: open
---

# Phase 0

## Q1: Retint Bootstrap's CDN contextual colors globally, or fix icon/badge colors per-component? [Open]

**Grounding:** `text-success`/`text-primary`/`text-dark`/`text-danger` and `Badge bg="..."` drive every difficulty icon (`utils.component.tsx:66-73` `DifficultyIcon`), the favorite icon (`utils.component.tsx:75-77`), goal-status icons (`ebrpgoal.component.tsx:11-18` `parkStatusIcons`), and stat badges (`utils.component.tsx:83-111`) — none of it routed through this app's `--app-*` tokens. These classes come from Bootstrap 5.2.3 loaded via CDN (`public/index.html:53`), not this repo's Sass. Fetched the actual CDN bundle: `.text-success{color:rgba(var(--bs-success-rgb),var(--bs-text-opacity))}` etc., with `--bs-success-rgb`/`--bs-primary-rgb`/`--bs-dark-rgb`/`--bs-danger-rgb`/`--bs-secondary-rgb` defined once at `:root`. A `:root[data-theme="dark"]` override (attribute selector, higher specificity than bare `:root`) can retint all of them at once regardless of stylesheet load order — the app already leans on a Bootstrap CSS var elsewhere (`utils.component.scss:9` `var(--bs-list-group-color)`), so this isn't a new pattern. Without *some* fix here, Phase 2's own acceptance criteria ("difficulty icons legible... in both themes", "badges read correctly in both themes") can't pass, since `text-dark` in particular (near-black) is what a hard-difficulty icon and a `not-started` goal icon render in today, and it won't move in dark mode under Phase 0's current token-only mechanism.

**Author-1:** Two shapes for the actual fix, both compatible with Phase 0's CSS-custom-property mechanism:

- (a) **Global retint** — add a `--bs-*-rgb` override section to Phase 0's `:root[data-theme="dark"]` block (5 vars: success/primary/dark/danger/secondary). Zero component-file changes; fixes difficulty icons, favorite icon, goal-status icons, and badges in one place. Downside: retints *any* Bootstrap-contextual-colored element sitewide, not just the ones this plan is auditing — if some other `text-primary`/`bg-danger` usage exists (or gets added later) expecting Bootstrap's stock colors, it silently inherits the app's dark palette too.
- (b) **Per-component** — in Phase 2, swap `DifficultyIcon`/`FavoriteIcon`/`parkStatusIcons`/badges off Bootstrap contextual classes onto new `--app-difficulty-*`/`--app-favorite`/etc. tokens (inline `style` or new component-scoped classes). Scoped, on-brand, but touches render logic (not just CSS) in 3 files (`utils.component.tsx`, `ebrpgoal.component.tsx`, `hikedeck.component.tsx` reuses `DifficultyIcon`/`FavoriteIcon` so no extra edit there) and is more work for a visual-refresh-only plan.

Leaning **(a)** — cheaper, single-file (`App.scss`), and every current Bootstrap-contextual-color usage in this repo *is* one of the four things this plan already wants dark-safe (difficulty/favorite/goal-status/badges); there's no known usage today that needs Bootstrap's stock colors preserved, so the "sitewide" downside is theoretical, not observed.

**Reviewer-1:** Initial answer raised dropping `react-bootstrap` for Tailwind or similar — out of scope for this plan (visual refresh only, per the original `plan` scoping decision). Confirmed: stick with `react-bootstrap`. For this Q specifically, go with (a).

**Resolved.** Global retint — override `--bs-success-rgb`/`--bs-primary-rgb`/`--bs-dark-rgb`/`--bs-danger-rgb`/`--bs-secondary-rgb` in Phase 0's `:root[data-theme="dark"]` block in `App.scss`. No component-file changes; `react-bootstrap` stays as the styling library (a stack swap to Tailwind/etc. is out of scope, candidate for a future separate plan).

## Q2: `.claude/dotest.txt` is absent (hard-fails every phase gate) and `App.test.tsx` is stale CRA boilerplate that will fail on its own — resolve before Phase 0 `do`? [Open]

**Grounding:** doer's universal rule 10: `/doer:dotest` runs at every phase boundary; an absent `.claude/dotest.txt` is a HARD FAIL (only an *empty* file opts out cleanly). `find /Users/davfive/code/davidhikesalot/.claude` shows no `dotest.txt`. Separately, `src/App.test.tsx` is un-updated CRA boilerplate: `screen.getByText(/learn react/i)` — confirmed via `grep -rn "learn react" src public` that no such text exists anywhere in this app, so this test fails today, independent of this plan. Phase 0 also adds a real new test (`theme.service.test.tsx`) that should actually gate.

**Author-1:** Not a design fork, but blocks `do` mechanically — needs a decision before Phase 0 execution starts:

- (a) Create `.claude/dotest.txt` with `npm test -- --watchAll=false` **and** fix/remove the stale `App.test.tsx` as a zero-th step of Phase 0 (small, unrelated-to-redesign cleanup, but otherwise the gate fails on an unrelated pre-existing test forever).
- (b) Create `.claude/dotest.txt` empty (no-op opt-out) for this plan, leaving the stale test and the gate question for later/another task.

Leaning **(a)** — the plan is about to add a test that matters (`theme.service.test.tsx`'s precedence assertions); a gate that's a permanent no-op would silently mean that test never actually runs. The `App.test.tsx` fix is a one-line change (either delete the file or replace the assertion with something real like the header rendering), not scope creep worth its own phase.

**Reviewer-1:** Agreed, fix both now.

**Resolved.** Create `.claude/dotest.txt` (`npm test -- --watchAll=false`) and fix/remove the stale `App.test.tsx` as a zero-th step of Phase 0.

# Phase 1 [Reviewed]

## Q3: Pull `parkdeck`/`hikelist`'s `--app-content-background-color` token swap into Phase 1, or leave in Phase 2 as originally scoped? [Open]

**Grounding:** `carddeck.component.scss:49`'s base `.card` rule and two component-specific rules — `parkdeck.component.scss:15` (`.dropdown-menu` background under `#parks-dropdown`) and `hikelist.component.scss:15` (`ul.hike-list li` background, the live rule — distinct from the dead `.hike-difficulty-icon` block at lines 19-30 already slated for Phase 2 deletion) — all currently read `background-color: var(--app-content-background-color)`. That token is intentionally left un-overridden in `:root[data-theme="dark"]` (Phase 0 Decisions, brand identity preserved), so it stays `#D6D4D0` (light) in both themes. This plan-review pass already pulled the `carddeck.component.scss:49` swap (`--app-content-background-color` → `--app-surface-background`) into Phase 1 directly (base `.card` is squarely Phase 1's file), but `parkdeck`/`hikelist` are Phase 2's, per Phase 1's `**Out of Scope:**` line. `hikedeck.component.scss` has no reference to this var (confirmed, grep) — moot for that file. Phase 1's own Verify step already visits "any one card-bearing page in both themes" — if that page is Parks or a hike-list view, the reviewer would see the newly-dark `.card` sitting next to a still-light dropdown-menu or `li` background during Phase 1's own gate check.

**Author-1:** Both lines are single-property swaps, not a styling/layout pass (the rest of Phase 2's work on these two files — dropdown polish, list spacing — is unaffected either way):

- (a) **Pull the 2 lines into Phase 1** (`parkdeck.component.scss:15`, `hikelist.component.scss:15`) — Phase 1's own dark-mode Verify pass reads clean on whichever page it happens to hit; Phase 2's `**Out of Scope:**`/file-list still holds for everything else in those files.
- (b) **Leave both in Phase 2** as originally scoped — matches the plan's stated causal-coupling seam ("Phase 1 = base card system, Phase 2 = per-component overrides") exactly; accept that Phase 1's Verify may surface a visibly inconsistent page and the reviewer needs to know that's expected/incomplete until Phase 2, not a regression.

Leaning **(a)** — it's a 2-line, mechanical, zero-design-judgment change (same token rename `carddeck.component.scss:49` is already getting), and it removes a confusing false-negative signal from Phase 1's own Verify step rather than requiring the human reviewer to remember which components are "not yet touched."

**Reviewer-1:** Agreed, pull into Phase 1.

**Resolved.** Pull `parkdeck.component.scss:15` and `hikelist.component.scss:15`'s `--app-content-background-color` → `--app-surface-background` swap into Phase 1, alongside the already-planned `carddeck.component.scss:49` swap. Phase 2's file-list/out-of-scope for everything else in those two files (dropdown polish, list spacing, dead-CSS deletion) is unchanged.

# Phase 2 [Reviewed]

## Q4: Fix the un-retintable list-group/dropdown/badge text-color bug via scoped Bootstrap-var retint, or per-component `color` overrides? [Open]

**Grounding:** Screenshot-confirmed (headless Chromium + human's own browser) that hike-list row text (name/park/stats, both Parks-page `HikeList` and Plans-page `HikeListCard` — `src/pages/plans.page.tsx:14`) renders near-invisible dark-gray-on-near-black in dark mode. Root cause, confirmed by fetching the actual Bootstrap 5.2.3 CDN bundle (`public/index.html:53`): `.list-group { --bs-list-group-color: #212529; --bs-list-group-bg: #fff; ... }` and `.dropdown-menu { --bs-dropdown-link-color: #212529; --bs-dropdown-color: #212529; --bs-dropdown-bg: #fff; ... }` redeclare these vars *locally on the component's own root class*, not just as `:root` defaults. `hikelist.component.tsx:21`'s `<ListGroup as="ul" className="hike-list">` still carries Bootstrap's own `.list-group` class alongside `.hike-list`, so `hikelist.component.scss:15`'s `background-color: var(--app-surface-background)` swap (Phase 1) only ever touched the background — `.list-group-item`'s `color: var(--bs-list-group-color)` was never addressed and still resolves to `#212529`. This is structurally different from Q1's five `--bs-*-rgb` vars, confirmed (grep) to be declared *exactly once*, at `:root`, with **no** component-level redeclaration anywhere in the bundle — which is why Q1's flat `:root[data-theme="dark"]` retint worked. Extending that same retint-at-`:root` pattern to `--bs-list-group-color`/`--bs-dropdown-link-color` would be shadowed by `.list-group`/`.dropdown-menu`'s own local declaration and silently no-op — a naive "just add more vars to Q1's list" fix does not work here. Same root var also read directly at a third site, `utils.component.scss:9`'s `.badge-transparent { color: var(--bs-list-group-color) }` (used by `DistanceBadge`/`ElevationBadge`, e.g. in `HikeDeck` cards) — outside any `.list-group`/`.dropdown-menu` ancestor there, so currently undefined at that call site (falls back to inherited color rather than rendering broken, but fragile/accidental, not a designed fix).

**Author-1:** Two shapes, both compatible with the existing token mechanism:

- (a) **Scoped Bootstrap-var retint** — add `:root[data-theme="dark"] .list-group, :root[data-theme="dark"] .dropdown-menu { --bs-list-group-color: ...; --bs-list-group-bg: ...; --bs-dropdown-link-color: ...; --bs-dropdown-color: ...; --bs-dropdown-bg: ...; }` to Phase 0's dark block in `App.scss`. Keeps the "one retint block, zero component-file color changes" shape Q1 established for these two sites — but requires correctly enumerating every Bootstrap component class with this local-redeclaration shadow (verified here for `.list-group`/`.dropdown-menu`; a different Bootstrap component reached for later could have the same trap and go unnoticed), and does **not** reach `utils.component.scss:9`'s `.badge-transparent` case at all (outside any `.list-group`/`.dropdown-menu` ancestor, so the scoped selector can't touch it — that site needs its own fix regardless of which option is chosen here).
- (b) **Per-component direct `color` overrides** — set `color: var(--app-text-primary)` at the 3 actual read sites, all already in Phase 2's file scope: `hikelist.component.scss:15` (alongside the existing `background-color` swap), a new `.dropdown-item`/`.dropdown-item:hover` rule in `parkdeck.component.scss`, and swap `utils.component.scss:9`'s `.badge-transparent` color from `var(--bs-list-group-color)` to `var(--app-text-primary)`. Same shape as Phase 1's Q3 resolution (direct property override beats var-retinting once a Bootstrap var turns out to be component-shadowed or context-dependent); fixes all 3 read sites uniformly, including the one (a) can't reach.

Leaning **(b)** — it's the only option that actually fixes all 3 confirmed/suspect read sites, doesn't require correctly enumerating every Bootstrap component's internal var-shadowing behavior to trust the fix is complete, and matches the precedent Q3 already set (per-component override over var-retint) once a Bootstrap var stops being a clean single-`:root`-declaration case like Q1's.

**Reviewer-1:** Agreed, go with (b).

**Resolved.** Per-component `color: var(--app-text-primary)` overrides at all 3 read sites: `hikelist.component.scss:15` (alongside the existing `background-color` swap), a new `.dropdown-item`/`.dropdown-item:hover` rule in `parkdeck.component.scss`, and `utils.component.scss:9`'s `.badge-transparent` swapped from `var(--bs-list-group-color)` to `var(--app-text-primary)`.
