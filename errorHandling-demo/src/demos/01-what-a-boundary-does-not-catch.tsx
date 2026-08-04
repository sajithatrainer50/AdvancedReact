// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · 01-what-a-boundary-does-not-catch.tsx
// │ ONE IDEA: an error boundary catches errors during RENDER. It does
// │           NOT catch errors in event handlers, timeouts, or promises.
// │           This surprises almost everyone.
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';
import { ErrorBoundary } from '../lib/ErrorBoundary';

function Explosive() {
  const [renderError, setRenderError] = useState(false);

  // ✅ CAUGHT: this throw happens during RENDER.
  if (renderError) throw new Error('Thrown during render — the boundary catches this');

  return (
    <div>
      <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => setRenderError(true)}>
          throw in RENDER (caught ✓)
        </button>

        {/* ❌ NOT CAUGHT: the throw is inside an event handler. */}
        <button className="ghost" onClick={() => { throw new Error('in a click handler'); }}>
          throw in EVENT HANDLER (not caught ✗)
        </button>

        {/* ❌ NOT CAUGHT: the throw is inside a setTimeout callback. */}
        <button className="ghost" onClick={() => { setTimeout(() => { throw new Error('in a timeout'); }, 100); }}>
          throw in TIMEOUT (not caught ✗)
        </button>

        {/* ❌ NOT CAUGHT: rejected promise, unhandled. */}
        <button className="ghost" onClick={() => { Promise.reject(new Error('in a promise')); }}>
          throw in PROMISE (not caught ✗)
        </button>
      </div>
      <p className="hint" style={{ marginTop: 10 }}>
        Only the first button trips the boundary. The other three throw into the console but leave
        this UI untouched — open the console to see them.
      </p>
    </div>
  );
}

export default function WhatABoundaryDoesNotCatch() {
  return (
    <div className="card">
      <h3>Four ways to throw. Only one is caught. Guess which before clicking.</h3>
      <ErrorBoundary fallback={(err, reset) => (
        <div style={{ border: '1px solid #c2410c', borderRadius: 8, padding: 14 }}>
          <strong className="bad">Boundary caught: {err.message}</strong>
          <div style={{ marginTop: 8 }}><button onClick={reset}>reset</button></div>
        </div>
      )}>
        <Explosive />
      </ErrorBoundary>
      <p className="note">
        Error boundaries catch errors <strong>during rendering, in lifecycle methods, and in
        constructors</strong> of the components below them. They do <strong>NOT</strong> catch:
        event handlers, setTimeout/setInterval callbacks, or promise rejections — because those run
        <em>outside</em> React’s render cycle. For those, you use an ordinary try/catch and set error
        state yourself (demo 02).
      </p>
    </div>
  );
}
