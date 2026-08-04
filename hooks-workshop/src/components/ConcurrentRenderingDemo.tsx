import { useEffect, useState, useTransition } from 'react';
import { computeRiskScore, generateTransactions } from '../lib/mockBank';

// Seeing why interruptible rendering matters, not just reading about it

const LEDGER = generateTransactions(6000);

function HeartbeatClock() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  return <span className="badge bg-secondary">heartbeat: {tick}</span>;
}

function FullLedgerTable() {
  const rows = LEDGER.map((t) => ({ ...t, risk: computeRiskScore(t.amount + t.id.length) }));

  return (
    <div className="table-responsive" style={{ maxHeight: 260, overflowY: 'auto' }}>
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.amount.toFixed(2)}</td>
              <td>{t.risk}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConcurrentRenderingDemo() {
  const [showBlocking, setShowBlocking] = useState(false);
  const [showConcurrent, setShowConcurrent] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="container py-4">
      <h3 className="mb-3">Account Manager Dashboard</h3>
      <p>
        <HeartbeatClock /> <span className="text-muted ms-2">watch this while you open a panel below</span>
      </p>

      <div className="row g-4">
        <div className="col-md-6">
          <h5>Blocking update</h5>
          <button className="btn btn-outline-danger mb-2" onClick={() => setShowBlocking(true)}>
            Open Full Ledger
          </button>
          {showBlocking && <FullLedgerTable />}
        </div>

        <div className="col-md-6">
          <h5>Transition-wrapped update</h5>
          <button
            className="btn btn-outline-success mb-2"
            onClick={() => startTransition(() => setShowConcurrent(true))}
          >
            Open Full Ledger {isPending && '…'}
          </button>
          {showConcurrent && <FullLedgerTable />}
        </div>
      </div>
    </div>
  );
}
