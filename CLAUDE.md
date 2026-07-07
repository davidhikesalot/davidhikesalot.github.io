# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personal hiking-log site (davidhikesalot.com) built with Create React App (React 18 + TypeScript). There is no backend: Google Sheets is the database (read via a Google Apps Script webapp deployed as a REST-ish JSON endpoint), and Google Drive serves as the image CDN. The site is static-built and published to GitHub Pages.

## Commands

- `npm start` — dev server (react-scripts)
- `npm run build` — production build to `build/`
- `npm test` — Jest/RTL test runner (interactive watch mode by default); `npm test -- --watchAll=false` for a single non-watch run; `npm test -- App.test` to target one file
- `npm run deploy` — **publishes the live site.** Runs `predeploy` (`npm run build`) then pushes `build/` to the `gh-pages` branch via the `gh-pages` npm package. This is manual, not CI-triggered — pushing to `main` alone does not update the live site.

## Architecture

### Data flow

`App.tsx` fetches both Google Sheets (`parks` and `hikes`) in parallel on mount (`services/data.service.tsx:fetchSiteData`), then builds the domain model in a specific order: `Parks.build()` first, then `Hikes.build(json, parks)` — each `Hike` looks up and registers itself with its parent `Park` during construction (`hikes.service.tsx` `Hike` constructor calls `parks.find()` then `park.addHike(this)`). Parks cannot be resolved without this ordering.

The resulting `{ parks, hikes }` is passed down as React state, not context/redux — `App.tsx` renders `<PageLayout data={...}>`, which forwards it through `<Outlet context={props} />` (`layouts/page.layout.tsx`). Pages/components read it back via `useOutletContext<IPageLayoutProps>()` (see `components/parkdeck.component.tsx`).

### Domain model (`services/`)

Plain TS classes wrapping raw Google Sheet rows (`IGoogleSheetRow`, a `{[col]: string}` bag keyed by sheet column names):

- `Park` / `Parks` (`parks.service.tsx`), `Hike` / `Hikes` / `HikeStats` (`hikes.service.tsx`) — all read fields via a `get(field)` accessor that logs `console.error` on an unknown column rather than throwing, since sheet columns are the real schema and typos there are a real failure mode.
- `HikeStats` derives `difficulty` (easy/moderate/hard) from a distance/elevation-gain heuristic (`hikes.service.tsx`) — this is a business rule, not incidental code.
- `Park.addHike()` aggregates a running `HikeStats` total across its hikes; `Hikes` exposes filtered views (`completed`, `planned`, `nexthikes`) based on the sheet's `hikestatus`/`favorite` columns.

### Routing

`createHashRouter` (`src/index.tsx`), deliberately hash-based (`/#/parks` not `/parks`) because GitHub Pages has no server-side rewrite for client-side routes. Routes map 1:1 to `pages/*.page.tsx`, each a thin wrapper that renders one `components/*.component.tsx` composite.

### Component conventions

- One `*.component.tsx` + co-located `*.component.scss` per component; pages (`*.page.tsx`) contain no logic beyond wiring a component to `useOutletContext`.
- `components/carddeck.component.tsx` (`CardDeckHeader`/`CardDeck`/`CardDeckCard`) is the shared Bootstrap grid-of-cards abstraction reused by `parkdeck`, and the goal/hike list components — extend this rather than building a new grid layout.
- Icons/badges for hike metadata (difficulty, favorite, distance, elevation) are centralized in `components/utils.component.tsx` (`DifficultyIcon`, `DifficultyBadge`, `FavoriteIcon`, etc.) — reuse these instead of inlining FontAwesome icons elsewhere.
- Styling is react-bootstrap + component-scoped SCSS; shared theme values (header/content colors) live as CSS custom properties in `src/App.scss`, tiled background in `src/index.scss`.

### External integrations

- Sheet data source URLs are hardcoded in `services/data.service.tsx` (Google Apps Script `exec` endpoints, one per sheet tab).
- Images (park trail maps) are served from Google Drive via `drive.google.com/{thumbnail,uc}?id=...` URL construction (`components/parkdeck.component.tsx`), lazy-loaded with `react-lazy-load`.
