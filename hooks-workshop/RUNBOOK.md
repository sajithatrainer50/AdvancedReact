# Run Guide — Advanced Hooks Workshop

## First-time setup

```
npm install
npm run go
```

Open the URL shown in the terminal (http://localhost:5200).

## Running a demo in class

Everything is controlled from one file: `src/App.tsx`.

1. Open `src/App.tsx`.
2. Uncomment the `import` line for the component you want to run.
3. Comment out the previous import line.
4. Update the line inside `App()` to return the new component.
5. Save. Vite hot-reloads automatically — no restart needed.

Example — switching from the first demo to the second:

```tsx
// import SyncExternalStoreDemo from './components/SyncExternalStoreDemo';
import OptimisticPatternManual from './components/OptimisticPatternManual';

export default function App() {
  return <OptimisticPatternManual />;
}
```

## Order used in the session

| # | Component file | Concept |
|---|---|---|
| 1 | `SyncExternalStoreDemo.tsx` | useSyncExternalStore |
| 2 | `OptimisticPatternManual.tsx` | Optimistic UI, built by hand |
| 3 | `OptimisticHookDemo.tsx` | useOptimistic |
| 4 | `TransitionDemo.tsx` | useTransition |
| 5 | `DeferredValueDemo.tsx` | useDeferredValue |
| 6 | `ConcurrentRenderingDemo.tsx` | Concurrent rendering concepts |
| 7 | `SchedulingPriorityDemo.tsx` | Scheduling and prioritization |
| 8 | `ActionStateDemo.tsx` | useActionState |
| 9 | `UseHookDemo.tsx` | The `use` hook |
| 10 | `FormStatusDemo.tsx` | useFormStatus |
| 11 | `UseIdDemo.tsx` | useId |

Full explanations, talking points, and anticipated questions for each one are in the Study Guide document, not in the code.

## What to click / type for each demo

- **SyncExternalStoreDemo** — just watch. The queue number changes every 1.5s on its own. Toggle your machine's network off/on to flip the gateway badge.
- **OptimisticPatternManual / OptimisticHookDemo** — click "Flag" or "Unflag" a few times. About 1 in 3 clicks is set to fail on purpose, so a rollback will show up naturally within a few tries.
- **TransitionDemo** — type quickly in the search box. Try commenting out `startTransition` temporarily to show the difference live if you want the blocking version.
- **DeferredValueDemo** — type quickly; watch the table dim slightly while it catches up.
- **ConcurrentRenderingDemo** — open the left panel first and watch the heartbeat number stall. Then open the right panel and watch it keep ticking.
- **SchedulingPriorityDemo** — switch between the three mode buttons and repeat the same search term in each to compare behaviour.
- **ActionStateDemo** — try submitting with an empty IBAN, then a valid one. About 1 in 4 valid submissions is set to fail on purpose to show the error path.
- **UseHookDemo** — just load it; the spinner shows for ~1.2s while the promise resolves.
- **FormStatusDemo** — click submit and watch the button disable itself for ~1s.
- **UseIdDemo** — click "Add another beneficiary" a few times; inspect the DOM to show the ids never collide.

## Troubleshooting

- **Port 5200 already in use** — another demo project is probably still running. Stop it, or change `server.port` in `vite.config.ts`.
- **Blank page** — check the browser console; this is almost always a typo in the `App.tsx` swap (mismatched import name vs. JSX tag).
- **Bootstrap classes not styled** — check your internet connection; Bootstrap CSS loads from a CDN link in `index.html`, it is not bundled locally on purpose to keep the project dependency-free.
