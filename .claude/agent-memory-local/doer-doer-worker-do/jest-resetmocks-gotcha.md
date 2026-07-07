---
name: jest-resetmocks-gotcha
description: CRA's jest config sets resetMocks:true — inline jest.fn() implementations set inside a jest.mock() factory get wiped before every test
metadata:
  type: project
---

`react-scripts`' default Jest config (`node_modules/react-scripts/scripts/utils/createJestConfig.js`) sets `resetMocks: true`. This resets every `jest.fn()`'s implementation/return-value **before each test runs** — including ones set inline inside a `jest.mock('./module', () => ({ fn: jest.fn(() => ...) }))` factory. The factory only runs once at module-mock-setup time; the reset then strips the implementation, so `fn()` returns `undefined` in the actual test, not what the factory specified.

**Why:** discovered fixing `src/App.test.tsx` for `[[ux-refresh-dark-mode]]` Phase 0 (Q2 zero-th step) — a mock of `fetchSiteData` returning `new Promise(() => {})` (kept pending on purpose) silently became `undefined`, producing `Cannot read properties of undefined (reading 'then')` with no indication resetMocks was the cause.

**How to apply:** when mocking a module in this repo, declare the mock with a bare `jest.fn()` in the `jest.mock(...)` factory, then set the concrete behavior (`.mockReturnValue(...)` / `.mockImplementation(...)`) inside the test body (or a `beforeEach`), never only inside the factory.
