// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · 04-retry-and-reset.tsx
// │ ONE IDEA: "retry" means clearing the boundary AND remounting the
// │           subtree so it starts fresh. A resetKey bump does the
// │           remount — the exact key mechanism from Module 2b.
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { ErrorBoundary } from '../lib/ErrorBoundary';

// Fails the first two times, succeeds the third — simulates a flaky endpoint.
let attempts = 0;
function FlakyData() {
  attempts++;
  if (attempts < 3) throw new Error(`attempt ${attempts} failed`);
  return <strong className="n ok" style={{ fontSize: 20 }}>Loaded on attempt {attempts}</strong>;
}

export default function RetryAndReset() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="card">
      <h3>Fails twice, then works. Retry until it loads.</h3>
      <button onClick={() => { attempts = 0; setResetKey((k) => k + 1); }} style={{ marginBottom: 12 }}>
        hard reset (attempts = 0)
      </button>

      {/*
        key={resetKey} is the crucial line. When retry bumps it, React treats
        this as a NEW ErrorBoundary + a NEW FlakyData — a full remount, so the
        component re-runs from scratch instead of re-rendering in its failed
        state. This is Module 2b's key-as-remount, used as a recovery tool.
      */}
      <ErrorBoundary
        key={resetKey}
        fallback={(err, reset) => (
          <div style={{ border: '1px solid #c2410c', borderRadius: 8, padding: 14 }}>
            <strong className="bad">{err.message}</strong>
            <div style={{ marginTop: 8 }}>
              {/* reset() clears the boundary; bumping the key remounts the child. */}
              <button onClick={() => { reset(); setResetKey((k) => k + 1); }}>retry</button>
            </div>
          </div>
        )}
      >
        <FlakyData />
      </ErrorBoundary>

      <p className="note">
        Clicking retry does two things: <code>reset()</code> clears the boundary’s error state, and
        the <code>key</code> bump forces React to throw away the failed subtree and mount a fresh
        one. Without the remount, the child would just re-enter its broken state and fail again
        instantly. Recovery = clear the error <em>and</em> give the subtree a clean start.
      </p>
    </div>
  );
}
