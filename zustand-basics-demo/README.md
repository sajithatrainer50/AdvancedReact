# Zustand Basics Demo

A deliberately tiny project — two stores, two pages — built to see every
built-in Zustand method in isolation. Full explanation of each method is
in `STUDY-GUIDE.md`.

## Setup

```bash
npm run go
```

That installs dependencies and starts the dev server (http://localhost:5173).
If dependencies are already installed, `npm run dev` alone is enough.

## What's here

- `src/stores/useCounterStore.ts` — the smallest possible store: `create`, `set` (both forms), `get`
- `src/stores/useBankStore.ts` — validation with `get()` before `set()`, plus a note on the `replace` flag
- `src/pages/CounterPage.tsx` — the store used as a React hook, with selectors
- `src/pages/BankPage.tsx` — `.getState()`, `.setState()`, `.subscribe()` called directly on the store, outside any selector

Open the browser console while clicking around — several actions log
what's happening under the hood.

Read `STUDY-GUIDE.md` for the full breakdown.
