// ┌──────────────────────────────────────────────────────────────
// │ Error Handling · 05-retry-with-backoff.tsx
// │ ONE IDEA: for flaky NETWORK calls, don't hammer instantly —
// │           retry automatically with growing delays (backoff).
// └──────────────────────────────────────────────────────────────
import { useState } from 'react';

// Fails ~60% of the time, to exercise the retry loop.
function unreliableCall(): Promise<string> {
  return new Promise((resolve, reject) =>
    setTimeout(() => (Math.random() < 0.6 ? reject(new Error('network blip')) : resolve('OK')), 300),
  );
}

// Retry helper: up to `max` attempts, doubling the wait each time.
// 200ms, 400ms, 800ms... This is what a resilient client does instead of
// giving up on the first failure or retrying in a tight, server-hammering loop.
async function withBackoff<T>(fn: () => Promise<T>, max: number, onStep: (msg: string) => void): Promise<T> {
  let delay = 200;
  for (let attempt = 1; attempt <= max; attempt++) {
    try {
      onStep(`attempt ${attempt}…`);
      return await fn();
    } catch (e) {
      if (attempt === max) throw e;               // out of retries — give up
      onStep(`attempt ${attempt} failed, waiting ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;                                  // exponential growth
    }
  }
  throw new Error('unreachable');
}

export default function RetryWithBackoff() {
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true); setResult(null); setLog([]);
    const push = (m: string) => setLog((l) => [...l, m]);
    try {
      const r = await withBackoff(unreliableCall, 5, push);
      setResult(`✓ succeeded: ${r}`);
    } catch {
      setResult('✗ gave up after 5 attempts');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <h3>A 60%-failure endpoint, retried with growing delays</h3>
      <button disabled={busy} onClick={go}>call with backoff</button>
      <ul className="mono" style={{ fontSize: 12, marginTop: 12 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      {result && <p className={result.startsWith('✓') ? 'ok' : 'bad'}>{result}</p>}
      <p className="note">
        Watch the waits double: 200 → 400 → 800 → 1600ms. Backoff protects a struggling server from
        a retry storm and rides out transient blips without bothering the user. Pair this with a
        boundary (demo 04) for the case where even the retries are exhausted: automatic recovery
        first, human-visible fallback only when that fails.
      </p>
    </div>
  );
}
