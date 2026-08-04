// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · 02-async-errors-need-trycatch.tsx
// │ ONE IDEA: for event/async errors, catch them yourself and put the
// │           error into state — that turns them back into render
// │           errors your UI CAN show.
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';

function payViaApi(fail: boolean): Promise<string> {
  return new Promise((resolve, reject) =>
    setTimeout(() => (fail ? reject(new Error('Bank declined')) : resolve('TXN-9021')), 800),
  );
}

export default function AsyncErrorsNeedTryCatch() {
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function pay(fail: boolean) {
    setBusy(true);
    setError(null);
    setReference(null);

   

    try {
      const ref = await payViaApi(fail); // an async error — a boundary can't see this
      setReference(ref);
    } catch (e) {
      // We catch it and move it INTO STATE. Now it is part of render, and the
      // component can display it. This is the bridge async errors must cross.
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>Async errors can’t reach a boundary — so catch and store them</h3>
      <div className="row">
        <button disabled={busy} onClick={() => pay(false)}>pay (succeeds)</button>
        <button className="ghost" disabled={busy} onClick={() => pay(true)}>pay (fails)</button>
      </div>
      {busy && <p className="hint" style={{ marginTop: 8 }}>processing…</p>}
      {error && <p className="bad" style={{ marginTop: 8 }}>✗ {error}</p>}
      {reference && <p className="ok" style={{ marginTop: 8 }}>✓ sent · {reference}</p>}
      <p className="note">
        The pattern is always: <code>try</code> the async work, <code>catch</code> the error, and
        <code>setError(...)</code>. Storing the error in state converts an invisible async failure
        into a visible render output. Boundaries handle render crashes; try/catch handles everything
        that happens outside render. You need both.
      </p>
    </div>
  );
}
