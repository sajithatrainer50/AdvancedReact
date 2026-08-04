// flushSync forces React to apply a state update to the DOM synchronously, before the next line runs
import { useState } from 'react';
import { flushSync } from 'react-dom';

interface Txn {
  id: number;
  description: string;
  amount: number;
}

interface LogEntry {
  id: number;
  found: boolean;
}

let nextId = 5;

const seedTxns: Txn[] = [
  { id: 1, description: 'Payroll - Acme Ltd', amount: 3200 },
  { id: 2, description: 'ESB Electricity', amount: -84.5 },
  { id: 3, description: 'Grocery - Tesco', amount: -62.1 },
  { id: 4, description: 'Transfer to Savings', amount: -500 },
];

export default function FlushSyncDemo() {
  const [txns, setTxns] = useState(seedTxns);
  const [useFlushSync, setUseFlushSync] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  function addTransaction() {
    const newTxn: Txn = { id: nextId, description: `New Entry ${nextId}`, amount: -25 };
    nextId += 1;

    if (useFlushSync) {
      flushSync(() => {
        setTxns((prev) => [...prev, newTxn]);
      });
    } else {
      setTxns((prev) => [...prev, newTxn]);
    }

    // This line runs immediately after the call above, in the same tick.
    const node = document.getElementById(`txn-${newTxn.id}`);
    const found = node !== null;
    if (found) {
      node!.scrollIntoView({ behavior: 'smooth', block: 'center' });
      node!.focus();
    }
    setLog((prev) => [{ id: newTxn.id, found }, ...prev].slice(0, 6));
  }

  return (
    <div className="container py-4">
      <h4>NorthBridge — Ledger (scroll to newly added row)</h4>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="flushToggle"
          checked={useFlushSync}
          onChange={(e) => setUseFlushSync(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="flushToggle">
          Wrap the update in flushSync (currently: {useFlushSync ? 'ON' : 'OFF'})
        </label>
      </div>

      <button className="btn btn-primary mb-3" onClick={addTransaction}>
        Add Transaction
      </button>

      <div className="border rounded p-2 overflow-auto mb-3" style={{ maxHeight: 220 }}>
        <ul className="list-group">
          {txns.map((t) => (
            <li key={t.id} id={`txn-${t.id}`} tabIndex={-1} className="list-group-item d-flex justify-content-between">
              <span>{t.description}</span>
              <span className={t.amount < 0 ? 'text-danger' : 'text-success'}>€{t.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="card-header">Was the new row found in the DOM immediately after the update call?</div>
        <ul className="list-group list-group-flush">
          {log.map((entry, i) => (
            <li key={i} className={`list-group-item small font-monospace ${entry.found ? 'text-success' : 'text-danger'}`}>
              txn-{entry.id}: {entry.found ? 'FOUND — scrolled and focused' : 'NOT FOUND — DOM not updated yet'}
            </li>
          ))}
          {log.length === 0 && <li className="list-group-item small text-muted">Click "Add Transaction" to start.</li>}
        </ul>
      </div>
    </div>
  );
}
