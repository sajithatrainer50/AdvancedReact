import { useState } from 'react';
import { generateTransactions, simulateServerCall } from '../lib/mockBank';
import type { Transaction } from '../lib/types';

// Building an optimistic update by hand, with a manual rollback on failure

export default function OptimisticPatternManual() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => generateTransactions(6));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleFlag(txn: Transaction) {
    const previous = transactions;
    const next = transactions.map((t) => (t.id === txn.id ? { ...t, flagged: !t.flagged } : t));

    setError(null);
    setPendingId(txn.id);
    setTransactions(next);

    try {
      await simulateServerCall(true, { failRate: 0.35 });
    } catch {
      setTransactions(previous);
      setError(`Could not update "${txn.description}". Reverted.`);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="container py-4">
      <h3 className="mb-3">Suspicious Activity Review — NorthBridge Ops</h3>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Flagged</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.amount.toFixed(2)}</td>
              <td>{t.flagged ? <span className="badge bg-warning text-dark">Flagged</span> : '—'}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={pendingId === t.id}
                  onClick={() => toggleFlag(t)}
                >
                  {pendingId === t.id ? 'Saving…' : t.flagged ? 'Unflag' : 'Flag'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
