---
name: react-bootstrap-esm-imports
description: Never import from react-bootstrap/esm/* — breaks Jest's transform; use named imports from the react-bootstrap package root (CJS) instead
metadata:
  type: project
---

`react-bootstrap`'s package.json points `"main"` at `cjs/index.js` and `"module"` at `esm/index.js`. A direct deep import like `import Stack from "react-bootstrap/esm/Stack"` bypasses the `main` field entirely and pulls in raw ESM (`import classNames from 'classnames'`), which CRA's default Jest `transformIgnorePatterns` does not transform inside `node_modules` — any test that touches that import chain fails with `SyntaxError: Cannot use import statement outside a module`.

**Why:** found in `src/App.tsx` (pre-existing `import Stack from "react-bootstrap/esm/Stack"`) while fixing the stale `App.test.tsx` gate for `[[ux-refresh-dark-mode]]` Phase 0 — the test couldn't even parse until this was fixed.

**How to apply:** always import react-bootstrap components as named imports from the package root, e.g. `import { Stack } from "react-bootstrap";` (matches how the rest of the codebase already imports `Navbar`/`Nav`/`OverlayTrigger`/etc. in `appheader.component.tsx`) — never `react-bootstrap/esm/...`.
