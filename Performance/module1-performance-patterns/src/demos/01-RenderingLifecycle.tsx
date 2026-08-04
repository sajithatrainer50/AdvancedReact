// Render phase (pure, can run more than once) vs Commit phase (DOM + effects, runs once)
import { useEffect, useRef, useState } from 'react';

interface LogEntry {
  renderNo: number;
  commitNo: number;
  renderedAt: string;
  committedAt: string;
}

let renderCount = 0;

export default function RenderingLifecycle() {
  const [balance, setBalance] = useState(48250.75);
  const [log, setLog] = useState<LogEntry[]>([]);
  const commitCount = useRef(0);

  renderCount += 1;
  const renderedAt = performance.now().toFixed(1);

  useEffect(() => {
    commitCount.current += 1;
    const entry: LogEntry = {
      renderNo: renderCount,
      commitNo: commitCount.current,
      renderedAt,
      committedAt: performance.now().toFixed(1),
    };
    setLog((prev) => [entry, ...prev].slice(0, 6));
  },[balance]);

  function postTransaction(type: 'CREDIT' | 'DEBIT') {
    const amount = Math.round(Math.random() * 5000) / 100;
    setBalance((prev) => (type === 'CREDIT' ? prev + amount : prev - amount));
  }

  return (
    <div className="container py-4">
      <h4>NorthBridge — Account NB-2201-887</h4>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <p className="text-muted mb-1">Available Balance</p>
          <h2 className="mb-0">€{balance.toFixed(2)}</h2>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-success" onClick={() => postTransaction('CREDIT')}>
          Post Credit
        </button>
        <button className="btn btn-outline-danger" onClick={() => postTransaction('DEBIT')}>
          Post Debit
        </button>
      </div>

      <div className="card">
        <div className="card-header">Render / Commit timeline (newest first)</div>
        <ul className="list-group list-group-flush">
          {log.map((entry, i) => (
            <li key={i} className="list-group-item small font-monospace">
              render #{entry.renderNo} @ {entry.renderedAt}ms &nbsp;→&nbsp; commit #{entry.commitNo} @{' '}
              {entry.committedAt}ms
            </li>
          ))}
          {log.length === 0 && <li className="list-group-item small text-muted">Post a transaction to start the timeline.</li>}
        </ul>
      </div>
    </div>
  );
}
