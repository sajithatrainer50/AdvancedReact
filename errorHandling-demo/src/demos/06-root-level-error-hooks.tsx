// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · 06-root-level-error-hooks.tsx
// │ ONE IDEA: React 19 lets you hook EVERY error at the root, even
// │           ones a boundary recovered from, for centralised logging.
// └──────────────────────────────────────────────────────────────
import { ErrorBoundary } from '../lib/ErrorBoundary';
import { useState } from 'react';

// NOTE: the actual wiring lives in main.tsx, which passes handlers to
// createRoot: onUncaughtError, onCaughtError, onRecoverableError.
// This demo just triggers errors so you can watch those root handlers fire.
function Crasher() {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error('demo crash for the root logger');
  return <button className="ghost" onClick={() => setBoom(true)}>crash (watch the console)</button>;
}

export default function RootLevelErrorHooks() {
  return (
    <div className="card">
      <h3>React 19: catch every error at the root for logging</h3>
      <ErrorBoundary fallback={(err, reset) => (
        <div style={{ border: '1px solid #c2410c', borderRadius: 8, padding: 14 }}>
          <strong className="bad">{err.message}</strong>
          <div style={{ marginTop: 8 }}><button onClick={reset}>reset</button></div>
        </div>
      )}>
        <Crasher />
      </ErrorBoundary>
      <p className="note">
        Crash it, then read the console. The boundary’s <code>componentDidCatch</code> fires — AND
        the root-level <code>onCaughtError</code> handler in <code>main.tsx</code> fires too. React
        19 exposes three root options: <code>onCaughtError</code> (a boundary handled it),
        <code>onUncaughtError</code> (nothing did), and <code>onRecoverableError</code> (React
        recovered automatically, e.g. a hydration mismatch). This is your single funnel to Sentry —
        every error in the app, in one place, regardless of which boundary caught it.
      </p>
    </div>
  );
}
